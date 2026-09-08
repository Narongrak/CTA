// Grade Academic Portal Frontend Client Logic
// Adheres strictly to docs/SPEC.md & docs/BRIEF.md

let currentUser = null;
let cachedGradesData = null;
let cachedCalendarData = [];
let cachedTeacherGrades = [];

// Initialize on document ready
document.addEventListener('DOMContentLoaded', () => {
  initApp();
  setupSilentRefresh();
});

async function initApp() {
  try {
    const res = await fetch('/api/me');
    if (res.status === 401) {
      // Unauthenticated -> redirect to Central Auth (TC-WEB-01)
      window.location.href = `/auth/?returnTo=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    const data = await res.json();
    currentUser = data.user;
    renderUserInfo(currentUser);

    // Render appropriate view based on Role (docs/SPEC.md Section 6.2 & TC-ROLE-01/02/03)
    if (currentUser.role === 'student') {
      setupStudentView();
    } else if (currentUser.role === 'teacher') {
      setupTeacherView();
    } else if (currentUser.role === 'admin') {
      setupAdminView();
    }

    // Pre-load calendar for all roles
    loadCalendar();

  } catch (err) {
    console.error('App initialization error:', err);
    showToast('เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้งาน', 'error');
  }
}

// User Profile Rendering
function renderUserInfo(user) {
  const nameEl = document.getElementById('userDisplayName');
  const roleEl = document.getElementById('userRoleBadge');
  const avatarEl = document.getElementById('userAvatar');

  const displayName = user.name || user.username;
  nameEl.textContent = displayName;
  avatarEl.textContent = displayName.charAt(0).toUpperCase();

  roleEl.textContent = user.role.toUpperCase();
  roleEl.className = `user-role-badge badge-${user.role}`;
}

// Navigation & Tab Switching
function switchView(viewName) {
  // Update nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  
  // Hide all sections
  document.querySelectorAll('.view-section').forEach(sec => sec.classList.add('hidden'));

  if (viewName === 'grades') {
    document.getElementById('tabGradesBtn').classList.add('active');
    if (currentUser.role === 'student') {
      document.getElementById('studentView').classList.remove('hidden');
    } else if (currentUser.role === 'teacher') {
      document.getElementById('teacherView').classList.remove('hidden');
    } else if (currentUser.role === 'admin') {
      document.getElementById('adminView').classList.remove('hidden');
    }
  } else if (viewName === 'calendar') {
    document.getElementById('tabCalendarBtn').classList.add('active');
    document.getElementById('calendarView').classList.remove('hidden');
  } else if (viewName === 'audit') {
    const auditBtn = document.getElementById('tabAuditBtn');
    if (auditBtn) auditBtn.classList.add('active');
    document.getElementById('auditView').classList.remove('hidden');
    loadAuditLogs();
  }
}

// ==========================================================================
// STUDENT VIEW LOGIC (TC-ROLE-01)
// ==========================================================================
function setupStudentView() {
  document.getElementById('studentView').classList.remove('hidden');
  document.getElementById('teacherView').classList.add('hidden');
  document.getElementById('adminView').classList.add('hidden');
  document.getElementById('gradesNavText').textContent = 'ผลการเรียน';

  // Fill Profile Hero Info
  document.getElementById('studentHeroName').textContent = currentUser.name || currentUser.username;
  document.getElementById('studentHeroId').textContent = currentUser.student_id || currentUser.username;
  document.getElementById('studentHeroFaculty').textContent = currentUser.faculty || 'วิศวกรรมศาสตร์';
  document.getElementById('studentHeroMajor').textContent = currentUser.major || 'วิศวกรรมคอมพิวเตอร์';

  loadStudentGrades();
}

async function loadStudentGrades() {
  try {
    const res = await fetch('/api/grades');
    if (!res.ok) throw new Error('Cannot fetch grades');

    const data = await res.json();
    cachedGradesData = data;

    // Stat cards
    document.getElementById('cumulativeGpa').textContent = data.cumulativeGpa;
    document.getElementById('totalCredits').textContent = data.totalCredits;

    const gpaNum = parseFloat(data.cumulativeGpa);
    const standingEl = document.getElementById('gpaStanding');
    if (gpaNum >= 3.60) {
      standingEl.textContent = 'เกียรตินิยมอันดับหนึ่ง (1st Class Honours)';
    } else if (gpaNum >= 3.25) {
      standingEl.textContent = 'เกียรตินิยมอันดับสอง (2nd Class Honours)';
    } else {
      standingEl.textContent = 'สถานะภาพปกติ (Good Standing)';
    }

    if (data.semesters && data.semesters.length > 0) {
      const latest = data.semesters[data.semesters.length - 1];
      document.getElementById('latestSemester').textContent = latest.semester;
      document.getElementById('latestGpa').textContent = latest.semesterGpa;
    }

    // Render semester tabs
    renderSemesterTabs(data.semesters);

    // Render tables
    renderGradeTables(data.semesters);

  } catch (err) {
    console.error('Load grades error:', err);
    showToast('ไม่สามารถดึงข้อมูลเกรดได้', 'error');
  }
}

function renderSemesterTabs(semesters) {
  const container = document.getElementById('semesterTabs');
  container.innerHTML = `<button class="filter-chip active" onclick="filterSemester('ALL')">ทุกภาคการศึกษา</button>`;

  semesters.forEach(sem => {
    container.innerHTML += `<button class="filter-chip" onclick="filterSemester('${sem.semester}')">ภาคเรียนที่ ${sem.semester}</button>`;
  });
}

function filterSemester(targetSemester) {
  // Update chips active state
  const chips = document.querySelectorAll('#semesterTabs .filter-chip');
  chips.forEach(chip => {
    chip.classList.toggle('active', chip.textContent.includes(targetSemester) || (targetSemester === 'ALL' && chip.textContent.includes('ทุก')));
  });

  if (!cachedGradesData) return;

  if (targetSemester === 'ALL') {
    renderGradeTables(cachedGradesData.semesters);
  } else {
    const filtered = cachedGradesData.semesters.filter(s => s.semester === targetSemester);
    renderGradeTables(filtered);
  }
}

function renderGradeTables(semesters) {
  const container = document.getElementById('gradesTableContainer');
  container.innerHTML = '';

  if (!semesters || semesters.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding: 40px; color:#9ca3af;">ไม่มีข้อมูลผลการเรียน</div>';
    return;
  }

  semesters.forEach(sem => {
    const block = document.createElement('div');
    block.className = 'semester-block';

    let tableRows = '';
    sem.courses.forEach(course => {
      const gradeClass = getGradeBadgeClass(course.grade);
      tableRows += `
        <tr>
          <td><strong>${course.code}</strong></td>
          <td>${course.subject_name}</td>
          <td>${course.credits}</td>
          <td><span class="grade-badge ${gradeClass}">${course.grade}</span></td>
          <td>${course.point !== undefined ? course.point.toFixed(1) : '-'}</td>
        </tr>
      `;
    });

    block.innerHTML = `
      <div class="semester-header">
        <div class="semester-title">ภาคการศึกษาที่ ${sem.semester}</div>
        <div class="semester-summary-badges">
          <span class="summary-pill">หน่วยกิต: <strong>${sem.credits}</strong></span>
          <span class="summary-pill">GPA ภาค: <strong>${sem.semesterGpa}</strong></span>
        </div>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>รหัสวิชา</th>
              <th>ชื่อรายวิชา</th>
              <th>หน่วยกิต</th>
              <th>ระดับคะแนน (เกรด)</th>
              <th>ค่าระดับคะแนน</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
    `;

    container.appendChild(block);
  });
}

function getGradeBadgeClass(grade) {
  if (!grade) return '';
  const g = grade.trim();
  if (g === 'A') return 'grade-A';
  if (g === 'B+') return 'grade-B-plus';
  if (g === 'B') return 'grade-B';
  if (g === 'C+') return 'grade-C-plus';
  if (g === 'C') return 'grade-C';
  if (g === 'D+') return 'grade-D-plus';
  if (g === 'D') return 'grade-D';
  if (g === 'F') return 'grade-F';
  return 'grade-B';
}

// ==========================================================================
// TEACHER VIEW LOGIC (TC-ROLE-02)
// ==========================================================================
function setupTeacherView() {
  document.getElementById('studentView').classList.add('hidden');
  document.getElementById('teacherView').classList.remove('hidden');
  document.getElementById('adminView').classList.add('hidden');
  document.getElementById('gradesNavText').textContent = 'จัดการเกรด';

  document.getElementById('teacherHeroName').textContent = currentUser.name || currentUser.username;
  loadTeacherGrades();
}

async function loadTeacherGrades() {
  try {
    const res = await fetch('/api/grades');
    if (!res.ok) throw new Error('Cannot fetch teacher grades');

    const data = await res.json();
    cachedTeacherGrades = data.grades || [];

    // Populate course dropdown
    const courseSelector = document.getElementById('courseSelector');
    courseSelector.innerHTML = '<option value="ALL">ทุกลายวิชา (All Courses)</option>';

    const uniqueCourses = [...new Set(cachedTeacherGrades.map(g => `${g.code} - ${g.subject_name}`))];
    uniqueCourses.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.split(' - ')[0];
      opt.textContent = c;
      courseSelector.appendChild(opt);
    });

    renderTeacherGradesTable(cachedTeacherGrades);

  } catch (err) {
    console.error('Teacher grades error:', err);
    showToast('ไม่สามารถดึงข้อมูลเกรดของนักศึกษาได้', 'error');
  }
}

function filterTeacherGrades() {
  const selectedCode = document.getElementById('courseSelector').value;
  if (selectedCode === 'ALL') {
    renderTeacherGradesTable(cachedTeacherGrades);
  } else {
    const filtered = cachedTeacherGrades.filter(g => g.code === selectedCode);
    renderTeacherGradesTable(filtered);
  }
}

function renderTeacherGradesTable(records) {
  const tbody = document.getElementById('teacherGradesBody');
  tbody.innerHTML = '';

  if (!records || records.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 24px;">ไม่พบข้อมูลนักศึกษา</td></tr>';
    return;
  }

  const validGrades = ['A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'];

  records.forEach(r => {
    const tr = document.createElement('tr');
    tr.id = `row-grade-${r.id}`;

    let optionsHtml = validGrades.map(g => `
      <option value="${g}" ${g === r.grade ? 'selected' : ''}>${g}</option>
    `).join('');

    tr.innerHTML = `
      <td><strong>${r.code}</strong></td>
      <td>${r.subject_name}</td>
      <td>${r.student_id}</td>
      <td>${r.student_name}</td>
      <td>${r.semester}</td>
      <td><span class="grade-badge ${getGradeBadgeClass(r.grade)}" id="badge-grade-${r.id}">${r.grade}</span></td>
      <td>
        <select id="select-grade-${r.id}" class="dropdown-filter" style="padding: 4px 8px;">
          ${optionsHtml}
        </select>
      </td>
      <td>
        <button class="btn-primary" style="padding: 5px 12px; font-size: 12px;" onclick="saveGradeChange(${r.id})">
          บันทึก
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function saveGradeChange(recordId) {
  const selectEl = document.getElementById(`select-grade-${recordId}`);
  const newGrade = selectEl.value;

  try {
    const res = await fetch('/api/grades/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: recordId, grade: newGrade })
    });

    const result = await res.json();
    if (!res.ok) {
      showToast(result.error || 'เกิดข้อผิดพลาดในการบันทึก', 'error');
      return;
    }

    // Update UI badge
    const badgeEl = document.getElementById(`badge-grade-${recordId}`);
    badgeEl.textContent = newGrade;
    badgeEl.className = `grade-badge ${getGradeBadgeClass(newGrade)}`;

    showToast(`อัปเดตเกรดเป็น ${newGrade} สำเร็จ`, 'success');

  } catch (err) {
    showToast('ไม่สามารถเชื่อมต่อเพื่อบันทึกเกรดได้', 'error');
  }
}

// ==========================================================================
// ADMIN VIEW LOGIC (TC-ROLE-03)
// ==========================================================================
function setupAdminView() {
  document.getElementById('studentView').classList.add('hidden');
  document.getElementById('teacherView').classList.add('hidden');
  document.getElementById('adminView').classList.remove('hidden');
  document.getElementById('tabAuditBtn').classList.remove('hidden');
  document.getElementById('gradesNavText').textContent = 'จัดการระบบ';

  document.getElementById('adminHeroName').textContent = currentUser.name || currentUser.username;
  loadAdminCalendar();
}

async function loadAdminCalendar() {
  try {
    const res = await fetch('/api/calendar');
    const data = await res.json();
    const tbody = document.getElementById('adminCalendarTableBody');
    tbody.innerHTML = '';

    (data.events || []).forEach(evt => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>#${evt.id}</td>
        <td><strong>${evt.title}</strong><div style="font-size:12px; color:#9ca3af;">${evt.description || ''}</div></td>
        <td><span class="event-category-tag cat-${evt.category || 'General'}">${evt.category || 'General'}</span></td>
        <td>${evt.start_date}</td>
        <td>${evt.end_date}</td>
        <td>
          <button class="btn-danger" onclick="deleteCalendarEvent(${evt.id})">ลบ</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Admin calendar error:', err);
  }
}

function openAddEventModal() {
  document.getElementById('calendarModal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('calendarModal').classList.add('hidden');
}

async function handleCreateEvent(e) {
  e.preventDefault();
  const title = document.getElementById('eventTitle').value.trim();
  const category = document.getElementById('eventCategory').value;
  const start_date = document.getElementById('eventStartDate').value;
  const end_date = document.getElementById('eventEndDate').value;
  const description = document.getElementById('eventDescription').value.trim();

  try {
    const res = await fetch('/api/calendar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category, start_date, end_date, description })
    });

    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || 'เกิดข้อผิดพลาด', 'error');
      return;
    }

    showToast('เพิ่มกิจกรรมปฏิทินการศึกษาเรียบร้อย', 'success');
    closeModal();
    document.getElementById('addEventForm').reset();
    loadAdminCalendar();
    loadCalendar();
  } catch (err) {
    showToast('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์', 'error');
  }
}

async function deleteCalendarEvent(id) {
  if (!confirm('ยืนยันการลบกิจกรรมนี้ออกจากปฏิทินการศึกษา?')) return;

  try {
    const res = await fetch(`/api/calendar/${id}`, { method: 'DELETE' });
    if (res.ok) {
      showToast('ลบกิจกรรมสำเร็จ', 'success');
      loadAdminCalendar();
      loadCalendar();
    } else {
      showToast('ไม่สามารถลบกิจกรรมได้', 'error');
    }
  } catch (err) {
    showToast('เกิดข้อผิดพลาดในการส่งคำขอ', 'error');
  }
}

async function loadAuditLogs() {
  try {
    const res = await fetch('/api/admin/audit-logs');
    if (!res.ok) throw new Error('Cannot fetch logs');

    const data = await res.json();
    const tbody = document.getElementById('auditLogsTableBody');
    tbody.innerHTML = '';

    (data.logs || []).forEach(log => {
      const tr = document.createElement('tr');
      const timeFormatted = new Date(log.created_at).toLocaleString('th-TH');
      tr.innerHTML = `
        <td style="color:#9ca3af; font-size:12px;">${timeFormatted}</td>
        <td><strong style="color:#60a5fa;">${log.username}</strong></td>
        <td>${log.action}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Audit logs error:', err);
  }
}

// ==========================================================================
// CALENDAR VIEW LOGIC (All authenticated users)
// ==========================================================================
async function loadCalendar() {
  try {
    const res = await fetch('/api/calendar');
    const data = await res.json();
    cachedCalendarData = data.events || [];
    renderCalendarTimeline(cachedCalendarData);
  } catch (err) {
    console.error('Load calendar error:', err);
  }
}

function filterCalendar(category) {
  const chips = document.querySelectorAll('#calendarCategories .filter-chip');
  chips.forEach(c => {
    c.classList.toggle('active', c.getAttribute('onclick').includes(category));
  });

  if (category === 'ALL') {
    renderCalendarTimeline(cachedCalendarData);
  } else {
    const filtered = cachedCalendarData.filter(e => (e.category || 'General') === category);
    renderCalendarTimeline(filtered);
  }
}

function renderCalendarTimeline(events) {
  const timeline = document.getElementById('calendarTimeline');
  timeline.innerHTML = '';

  if (!events || events.length === 0) {
    timeline.innerHTML = '<div style="text-align:center; padding: 30px; color:#9ca3af;">ไม่มีกำหนดการในหมวดหมู่นี้</div>';
    return;
  }

  const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

  events.forEach(evt => {
    const dateObj = new Date(evt.start_date);
    const day = dateObj.getDate() || '01';
    const month = thaiMonths[dateObj.getMonth()] || '';

    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `
      <div class="event-date-badge">
        <div class="event-date-month">${month}</div>
        <div class="event-date-day">${day}</div>
      </div>
      <div class="event-details">
        <div class="event-header">
          <h4 class="event-title">${evt.title}</h4>
          <span class="event-category-tag cat-${evt.category || 'General'}">${evt.category || 'General'}</span>
        </div>
        <p class="event-desc">${evt.description || 'ไม่มีรายละเอียดเพิ่มเติม'}</p>
        <div style="font-size:11px; color:#6b7280; margin-top:4px;">
          ช่วงเวลา: ${evt.start_date} ถึง ${evt.end_date}
        </div>
      </div>
    `;
    timeline.appendChild(card);
  });
}

// ==========================================================================
// SILENT REFRESH / REMEMBER ME MECHANISM (TC-JWT-03)
// ==========================================================================
function setupSilentRefresh() {
  // Silent refresh every 10 minutes to maintain persistent session seamlessly
  setInterval(async () => {
    try {
      const res = await fetch('/auth/refresh');
      if (res.ok) {
        console.log('Session refreshed seamlessly via Refresh Token');
      }
    } catch (err) {
      console.warn('Silent refresh network check skipped');
    }
  }, 10 * 60 * 1000);
}

// ==========================================================================
// LOGOUT (TC-WEB-03)
// ==========================================================================
function handleLogout() {
  if (confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
    window.location.href = '/auth/logout';
  }
}

// ==========================================================================
// TOAST NOTIFICATIONS
// ==========================================================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
