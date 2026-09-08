import json
import sys
import urllib.request
import urllib.parse
import urllib.error
import http.cookiejar

sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://localhost"

def run_tests():
    results = []

    # 1. Nginx Routing
    print("[1] Testing Nginx routes...")
    try:
        req = urllib.request.Request(f"{BASE_URL}/auth/")
        with urllib.request.urlopen(req) as resp:
            assert resp.status == 200
            results.append(("TC-NGINX-01 (/auth/)", "PASSED"))
    except Exception as e:
        results.append(("TC-NGINX-01 (/auth/)", f"FAILED: {e}"))

    # 2. TC-WEB-01: Access Web App without Login -> Redirect to Central Auth
    print("[2] Testing unauthenticated access...")
    try:
        opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor())
        # Custom redirect handler to inspect 302
        req = urllib.request.Request(f"{BASE_URL}/api/me")
        try:
            opener.open(req)
            results.append(("TC-WEB-01 (Unauth /api/me -> 401)", "FAILED (expected 401)"))
        except urllib.error.HTTPError as e:
            if e.code == 401:
                results.append(("TC-WEB-01 (Unauth /api/me -> 401)", "PASSED"))
            else:
                results.append(("TC-WEB-01 (Unauth /api/me -> 401)", f"FAILED ({e.code})"))
    except Exception as e:
        results.append(("TC-WEB-01", f"FAILED: {e}"))

    # 3. TC-AUTH-01: Login Success (Student)
    print("[3] Testing student login...")
    cj_student = http.cookiejar.CookieJar()
    opener_student = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj_student))
    
    login_data = urllib.parse.urlencode({
        "username": "66010001",
        "password": "password123",
        "return_to": "/"
    }).encode("utf-8")
    
    try:
        login_req = urllib.request.Request(f"{BASE_URL}/auth/login", data=login_data)
        with opener_student.open(login_req) as resp:
            results.append(("TC-AUTH-01 (Student Login)", "PASSED"))
    except Exception as e:
        results.append(("TC-AUTH-01 (Student Login)", f"FAILED: {e}"))

    # 4. Student fetch profile & grades
    try:
        me_req = urllib.request.Request(f"{BASE_URL}/api/me")
        with opener_student.open(me_req) as resp:
            data = json.loads(resp.read().decode())
            assert data["user"]["role"] == "student"
            assert data["user"]["username"] == "66010001"
            results.append(("TC-ROLE-01 (Student Profile)", "PASSED"))
            
        grades_req = urllib.request.Request(f"{BASE_URL}/api/grades")
        with opener_student.open(grades_req) as resp:
            gdata = json.loads(resp.read().decode())
            assert gdata["role"] == "student"
            assert float(gdata["cumulativeGpa"]) > 0
            results.append(("TC-ROLE-01 (Student View Grades & GPA)", "PASSED"))
    except Exception as e:
        results.append(("TC-ROLE-01", f"FAILED: {e}"))

    # 5. TC-ROLE-04: Student unauthorized modification (Student cannot update grades or add calendar)
    print("[5] Testing role authorization restrictions...")
    try:
        update_req = urllib.request.Request(
            f"{BASE_URL}/api/grades/update",
            data=json.dumps({"id": 1, "grade": "A"}).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        try:
            opener_student.open(update_req)
            results.append(("TC-ROLE-04 (Student Grade Update Forbidden)", "FAILED (expected 403)"))
        except urllib.error.HTTPError as e:
            if e.code == 403:
                results.append(("TC-ROLE-04 (Student Grade Update -> 403 Forbidden)", "PASSED"))
            else:
                results.append(("TC-ROLE-04", f"FAILED (expected 403, got {e.code})"))
    except Exception as e:
        results.append(("TC-ROLE-04", f"FAILED: {e}"))

    # 6. TC-AUTH-02 / 03: Invalid Credentials
    print("[6] Testing invalid credentials...")
    try:
        bad_login_data = urllib.parse.urlencode({
            "username": "wronguser",
            "password": "wrongpassword"
        }).encode("utf-8")
        req = urllib.request.Request(f"{BASE_URL}/auth/login", data=bad_login_data)
        # Note: Central Auth redirects with error query param
        cj_temp = http.cookiejar.CookieJar()
        op_temp = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj_temp))
        with op_temp.open(req) as resp:
            final_url = resp.geturl()
            assert "error=" in final_url
            results.append(("TC-AUTH-02/03 (Invalid Credentials Redirect with Error)", "PASSED"))
    except Exception as e:
        results.append(("TC-AUTH-02/03", f"FAILED: {e}"))

    # 7. Teacher Login and Grade Update
    print("[7] Testing teacher login and permission...")
    cj_teacher = http.cookiejar.CookieJar()
    opener_teacher = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj_teacher))
    teacher_login = urllib.parse.urlencode({
        "username": "teacher01",
        "password": "teacher123",
        "return_to": "/"
    }).encode("utf-8")
    try:
        with opener_teacher.open(urllib.request.Request(f"{BASE_URL}/auth/login", data=teacher_login)) as resp:
            pass
        # Teacher update grade
        update_req = urllib.request.Request(
            f"{BASE_URL}/api/grades/update",
            data=json.dumps({"id": 1, "grade": "A"}).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        with opener_teacher.open(update_req) as resp:
            res_data = json.loads(resp.read().decode())
            assert res_data.get("success") is True
            results.append(("TC-ROLE-02 (Teacher Grade Update)", "PASSED"))
    except Exception as e:
        results.append(("TC-ROLE-02", f"FAILED: {e}"))

    # 8. Admin Login and Academic Calendar Management
    print("[8] Testing admin login and calendar management...")
    cj_admin = http.cookiejar.CookieJar()
    opener_admin = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj_admin))
    admin_login = urllib.parse.urlencode({
        "username": "admin",
        "password": "admin1234",
        "return_to": "/"
    }).encode("utf-8")
    try:
        with opener_admin.open(urllib.request.Request(f"{BASE_URL}/auth/login", data=admin_login)) as resp:
            pass
        cal_add_req = urllib.request.Request(
            f"{BASE_URL}/api/calendar",
            data=json.dumps({
                "title": "กิจกรรมทดสอบระบบ SSO Automated Test",
                "description": "ทดสอบการเพิ่มกิจกรรมโดย Admin",
                "start_date": "2026-11-01",
                "end_date": "2026-11-02",
                "category": "Test"
            }).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        with opener_admin.open(cal_add_req) as resp:
            cres = json.loads(resp.read().decode())
            assert cres.get("success") is True
            results.append(("TC-ROLE-03 (Admin Add Calendar Event)", "PASSED"))
    except Exception as e:
        results.append(("TC-ROLE-03", f"FAILED: {e}"))

    # Summary
    print("\n==========================================")
    print("           TEST RESULTS SUMMARY           ")
    print("==========================================")
    all_passed = True
    for test_name, status in results:
        symbol = "✓" if "PASSED" in status else "✗"
        print(f"{symbol} {test_name}: {status}")
        if "FAILED" in status:
            all_passed = False
    print("==========================================")
    if all_passed:
        print("ALL TESTS PASSED SUCCESSFULLY!")
    else:
        print("SOME TESTS FAILED!")

if __name__ == "__main__":
    run_tests()
