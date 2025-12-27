// Enhanced production-ready functionality

// Global data with enhanced structure
let maintenanceData = [
    {id: 1, subject: "Test activity", employee: "Mitchell Admin", technician: "Aka Foster", category: "computer", company: "My company", status: "active", priority: "medium", createdDate: new Date().toISOString()},
    {id: 2, subject: "System Issue", employee: "System Admin", technician: "Graceful", category: "Hardware", company: "My company", status: "pending", priority: "high", createdDate: new Date().toISOString()}
];

let equipmentData = [
    {id: 1, name: "Samsung Monitor 15\"", employee: "Tejas Modi", department: "Admin", serial: "MT/125/22798837", technician: "Mitchell Admin", category: "Monitors", company: "My Company (San Francisco)", status: "active"},
    {id: 2, name: "Acer Laptop", employee: "Bhavik P", department: "Technician", serial: "MT/122/11112222", technician: "Marc Demo", category: "Computers", company: "My Company (San Francisco)", status: "active"}
];

let teamData = [
    {id: 1, name: "Internal Maintenance", members: "Anas Makari", company: "My Company (San Francisco)", lead: "Anas Makari", department: "Maintenance", email: "maintenance@company.com"},
    {id: 2, name: "Metrology", members: "Marc Demo", company: "My Company (San Francisco)", lead: "Marc Demo", department: "Quality", email: "quality@company.com"},
    {id: 3, name: "Subcontractor", members: "Maggie Davidson", company: "My Company (San Francisco)", lead: "Maggie Davidson", department: "Operations", email: "ops@company.com"}
];

let workCenterData = [
    {id: 1, name: "Assembly 1", code: "ASM001", tag: "Production", alternatives: "Assembly 2", costPerHour: 1.00, efficiency: 100.00, oeeTarget: 34.59, location: "Building A"},
    {id: 2, name: "Drill 1", code: "DRL001", tag: "Machining", alternatives: "Drill 2", costPerHour: 1.00, efficiency: 100.00, oeeTarget: 90.00, location: "Building B"}
];

let calendarEvents = [
    {day: 3, time: 5, title: "Maintenance Task", id: 1, type: "maintenance", assignee: "Aka Foster"}
];

// Enhanced authentication
function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        showNotification("Please fill all fields", "error");
        return;
    }

    showLoading(true);
    
    // Simulate API call
    setTimeout(() => {
        document.getElementById("authSection").style.display = "none";
        document.getElementById("dashboardSection").style.display = "block";
        
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);
        localStorage.setItem("loginTime", new Date().toISOString());
        
        initializeDashboard();
        loadStoredData();
        showNotification("Login successful!", "success");
        showLoading(false);
    }, 1000);
}

function signup() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const confirm = document.getElementById("confirmPassword").value;

    if (!name || !email || !password || !confirm) {
        showNotification("All fields are required", "error");
        return;
    }

    if (password !== confirm) {
        showNotification("Passwords do not match", "error");
        return;
    }

    if (password.length < 8) {
        showNotification("Password must be at least 8 characters", "error");
        return;
    }

    showLoading(true);
    
    setTimeout(() => {
        localStorage.setItem("userName", name);
        localStorage.setItem("userEmail", email);
        showNotification("Signup successful! Please login.", "success");
        clearSignupForm();
        showLoading(false);
    }, 800);
}

// Notification system
function showNotification(message, type = 'info') {
    const container = document.getElementById('notifications');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <strong>${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
        <p>${message}</p>
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Loading overlay
function showLoading(show) {
    document.getElementById('loadingOverlay').style.display = show ? 'flex' : 'none';
}

// Enhanced navigation
function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    event.target.classList.add('active');
    
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    
    const forms = document.querySelectorAll('.form-container');
    forms.forEach(form => form.style.display = 'none');
    
    switch(tabName) {
        case 'maintenance':
        case 'dashboard':
            document.getElementById('maintenanceContent').classList.add('active');
            refreshMaintenanceTable();
            break;
        case 'calendar':
            document.getElementById('calendarContent').classList.add('active');
            refreshCalendar();
            break;
        case 'equipment':
            document.getElementById('equipmentContent').classList.add('active');
            refreshEquipmentTable();
            break;
        case 'reporting':
            document.getElementById('workCenterContent').classList.add('active');
            refreshWorkCenterTable();
            break;
    }
    
    updateDashboardCards();
}

// Team management
function showTeamForm() {
    document.getElementById('teamsContent').classList.remove('active');
    document.getElementById('teamForm').style.display = 'block';
    clearTeamForm();
}

function submitTeam() {
    const name = document.getElementById('teamName').value;
    const members = document.getElementById('teamMembers').value;
    const company = document.getElementById('teamCompany').value;
    const lead = document.getElementById('teamLead').value;
    const department = document.getElementById('teamDepartment').value;
    const email = document.getElementById('teamEmail').value;
    
    if (!name || !members) {
        showNotification('Please fill required fields', 'error');
        return;
    }
    
    const newTeam = {
        id: Date.now(),
        name, members, company, lead, department, email
    };
    
    teamData.push(newTeam);
    saveDataToStorage();
    refreshTeamsTable();
    
    showNotification('Team created successfully!', 'success');
    backToTeamsList();
}

function backToTeamsList() {
    document.getElementById('teamForm').style.display = 'none';
    document.getElementById('teamsContent').classList.add('active');
}

function clearTeamForm() {
    document.getElementById('teamName').value = '';
    document.getElementById('teamMembers').value = '';
    document.getElementById('teamLead').value = '';
    document.getElementById('teamEmail').value = '';
}

function refreshTeamsTable() {
    const tbody = document.querySelector('#teamsContent tbody');
    tbody.innerHTML = '';
    
    teamData.forEach(team => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${team.name}</td>
            <td>${team.members}</td>
            <td>${team.company}</td>
            <td><button class="btn-edit" onclick="editTeam(${team.id})">Edit</button></td>
        `;
    });
}

// Work Center management
function showWorkCenterForm() {
    document.getElementById('workCenterContent').classList.remove('active');
    document.getElementById('workCenterForm').style.display = 'block';
    clearWorkCenterForm();
}

function submitWorkCenter() {
    const name = document.getElementById('workCenterName').value;
    const code = document.getElementById('workCenterCode').value;
    const tag = document.getElementById('workCenterTag').value;
    const alternatives = document.getElementById('alternativeWorkcenters').value;
    const costPerHour = parseFloat(document.getElementById('costPerHour').value) || 0;
    const efficiency = parseFloat(document.getElementById('capacityEfficiency').value) || 0;
    const oeeTarget = parseFloat(document.getElementById('oeeTarget').value) || 0;
    const location = document.getElementById('workCenterLocation').value;
    
    if (!name || !code) {
        showNotification('Please fill required fields', 'error');
        return;
    }
    
    const newWorkCenter = {
        id: Date.now(),
        name, code, tag, alternatives, costPerHour, efficiency, oeeTarget, location
    };
    
    workCenterData.push(newWorkCenter);
    saveDataToStorage();
    refreshWorkCenterTable();
    
    showNotification('Work Center created successfully!', 'success');
    backToWorkCenterList();
}

function backToWorkCenterList() {
    document.getElementById('workCenterForm').style.display = 'none';
    document.getElementById('workCenterContent').classList.add('active');
}

function clearWorkCenterForm() {
    document.getElementById('workCenterName').value = '';
    document.getElementById('workCenterCode').value = '';
    document.getElementById('workCenterTag').value = '';
    document.getElementById('alternativeWorkcenters').value = '';
    document.getElementById('costPerHour').value = '';
    document.getElementById('capacityEfficiency').value = '';
    document.getElementById('oeeTarget').value = '';
    document.getElementById('workCenterLocation').value = '';
}

function refreshWorkCenterTable() {
    const tbody = document.querySelector('#workCenterContent tbody');
    tbody.innerHTML = '';
    
    workCenterData.forEach(wc => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${wc.name}</td>
            <td>${wc.code}</td>
            <td>${wc.tag}</td>
            <td>${wc.alternatives}</td>
            <td>$${wc.costPerHour.toFixed(2)}</td>
            <td>${wc.efficiency.toFixed(2)}%</td>
            <td>${wc.oeeTarget.toFixed(2)}%</td>
            <td><button class="btn-edit" onclick="editWorkCenter(${wc.id})">Edit</button></td>
        `;
    });
}

// Enhanced form submissions
function submitMaintenanceRequest() {
    const subject = document.getElementById('subject').value;
    
    if (!subject.trim()) {
        showNotification('Please enter a subject', 'error');
        return;
    }
    
    showLoading(true);
    
    setTimeout(() => {
        const newRequest = {
            id: Date.now(),
            subject: subject,
            employee: localStorage.getItem('userName') || 'Current User',
            technician: 'Auto Assigned',
            category: 'General',
            company: 'My company',
            status: 'pending',
            priority: 'medium',
            createdDate: new Date().toISOString()
        };
        
        maintenanceData.push(newRequest);
        saveDataToStorage();
        refreshMaintenanceTable();
        
        showNotification('Maintenance request submitted successfully!', 'success');
        backToMaintenanceList();
        showLoading(false);
    }, 500);
}

function submitEquipment() {
    const name = document.querySelector('#equipmentForm input[type="text"]').value;
    
    if (!name.trim()) {
        showNotification('Please enter equipment name', 'error');
        return;
    }
    
    showLoading(true);
    
    setTimeout(() => {
        const newEquipment = {
            id: Date.now(),
            name: name,
            employee: localStorage.getItem('userName') || 'Current User',
            department: 'Admin',
            serial: `MT/${Math.floor(Math.random() * 1000)}/${Date.now().toString().slice(-6)}`,
            technician: 'Auto Assigned',
            category: 'General',
            company: 'My Company (San Francisco)',
            status: 'active'
        };
        
        equipmentData.push(newEquipment);
        saveDataToStorage();
        refreshEquipmentTable();
        
        showNotification('Equipment added successfully!', 'success');
        backToEquipmentList();
        showLoading(false);
    }, 500);
}

// Enhanced table refresh functions
function refreshMaintenanceTable() {
    const tbody = document.querySelector('#maintenanceContent tbody');
    tbody.innerHTML = '';
    
    maintenanceData.forEach(item => {
        const row = tbody.insertRow();
        const statusClass = item.status === 'active' ? 'status-active' : item.status === 'pending' ? 'status-pending' : 'status-inactive';
        
        row.innerHTML = `
            <td><span class="status-indicator ${statusClass}"></span>${item.subject}</td>
            <td>${item.employee}</td>
            <td>${item.technician}</td>
            <td>${item.category}</td>
            <td>${item.company}</td>
        `;
        row.onclick = () => editMaintenanceItem(item);
        row.title = `Created: ${new Date(item.createdDate).toLocaleDateString()}`;
    });
}

function refreshEquipmentTable() {
    const tbody = document.querySelector('#equipmentContent tbody');
    tbody.innerHTML = '';
    
    equipmentData.forEach(item => {
        const row = tbody.insertRow();
        const statusClass = item.status === 'active' ? 'status-active' : 'status-inactive';
        
        row.innerHTML = `
            <td><span class="status-indicator ${statusClass}"></span>${item.name}</td>
            <td>${item.employee}</td>
            <td>${item.department}</td>
            <td>${item.serial}</td>
            <td>${item.technician}</td>
            <td>${item.category}</td>
            <td>${item.company}</td>
        `;
        row.onclick = () => editEquipmentItem(item);
    });
}

// Enhanced data persistence
function saveDataToStorage() {
    try {
        localStorage.setItem('maintenanceData', JSON.stringify(maintenanceData));
        localStorage.setItem('equipmentData', JSON.stringify(equipmentData));
        localStorage.setItem('teamData', JSON.stringify(teamData));
        localStorage.setItem('workCenterData', JSON.stringify(workCenterData));
        localStorage.setItem('calendarEvents', JSON.stringify(calendarEvents));
        localStorage.setItem('lastSaved', new Date().toISOString());
    } catch (error) {
        showNotification('Error saving data', 'error');
    }
}

function loadStoredData() {
    try {
        const stored = {
            maintenance: localStorage.getItem('maintenanceData'),
            equipment: localStorage.getItem('equipmentData'),
            teams: localStorage.getItem('teamData'),
            workCenters: localStorage.getItem('workCenterData'),
            events: localStorage.getItem('calendarEvents')
        };
        
        if (stored.maintenance) maintenanceData = JSON.parse(stored.maintenance);
        if (stored.equipment) equipmentData = JSON.parse(stored.equipment);
        if (stored.teams) teamData = JSON.parse(stored.teams);
        if (stored.workCenters) workCenterData = JSON.parse(stored.workCenters);
        if (stored.events) calendarEvents = JSON.parse(stored.events);
        
        refreshAllTables();
    } catch (error) {
        showNotification('Error loading data', 'error');
    }
}

function refreshAllTables() {
    refreshMaintenanceTable();
    refreshEquipmentTable();
    refreshTeamsTable();
    refreshWorkCenterTable();
    refreshCalendar();
}

// Enhanced dashboard initialization
function initializeDashboard() {
    updateDashboardCards();
    setCurrentDates();
    addEventListeners();
    addLogoutButton();
    startAutoSave();
    checkSessionTimeout();
}

function updateDashboardCards() {
    const criticalCount = equipmentData.filter(e => e.status === 'inactive').length;
    const pendingCount = maintenanceData.filter(m => m.status === 'pending').length;
    const activeEquipment = equipmentData.filter(e => e.status === 'active').length;
    
    const criticalCard = document.querySelector('.card.red .card-number');
    const pendingCard = document.querySelector('.card.green .card-number');
    const techCard = document.querySelector('.card.blue .card-number');
    
    if (criticalCard) criticalCard.textContent = `${criticalCount} Units`;
    if (pendingCard) pendingCard.textContent = `${pendingCount} Pending`;
    if (techCard) techCard.textContent = `${teamData.length} Teams`;
}

// Auto-save functionality
function startAutoSave() {
    setInterval(() => {
        saveDataToStorage();
    }, 30000); // Save every 30 seconds
}

// Session timeout check
function checkSessionTimeout() {
    const loginTime = localStorage.getItem('loginTime');
    if (loginTime) {
        const sessionDuration = Date.now() - new Date(loginTime).getTime();
        const maxSession = 8 * 60 * 60 * 1000; // 8 hours
        
        if (sessionDuration > maxSession) {
            showNotification('Session expired. Please login again.', 'warning');
            setTimeout(logout, 3000);
        }
    }
}

// Enhanced search with filters
function performSearch() {
    const searchTerm = document.querySelector('.navbar input').value.toLowerCase();
    const activeTable = document.querySelector('.tab-content.active table');
    
    if (activeTable) {
        const rows = activeTable.querySelectorAll('tbody tr');
        let visibleCount = 0;
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const isVisible = text.includes(searchTerm);
            row.style.display = isVisible ? '' : 'none';
            if (isVisible) visibleCount++;
        });
        
        // Show search results count
        if (searchTerm) {
            showNotification(`Found ${visibleCount} results`, 'info');
        }
    }
}

// Export functionality
function exportData(format = 'json') {
    const data = {
        maintenance: maintenanceData,
        equipment: equipmentData,
        teams: teamData,
        workCenters: workCenterData,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `maintenance_data_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('Data exported successfully!', 'success');
}

// Print functionality
function printReport() {
    window.print();
}

// Initialize everything
window.onload = function() {
    if (localStorage.getItem("isLoggedIn") === "true") {
        document.getElementById("authSection").style.display = "none";
        document.getElementById("dashboardSection").style.display = "block";
        initializeDashboard();
        loadStoredData();
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey) {
            switch(e.key) {
                case 'n':
                    e.preventDefault();
                    const activeTab = document.querySelector('.tab.active');
                    if (activeTab) {
                        const tabText = activeTab.textContent.toLowerCase();
                        if (tabText.includes('maintenance')) showRequestForm();
                        if (tabText.includes('equipment')) showEquipmentForm();
                    }
                    break;
                case 's':
                    e.preventDefault();
                    saveDataToStorage();
                    showNotification('Data saved!', 'success');
                    break;
                case 'p':
                    e.preventDefault();
                    printReport();
                    break;
            }
        }
    });
};

// Cleanup functions
function clearSignupForm() {
    ['name', 'signupEmail', 'signupPassword', 'confirmPassword'].forEach(id => {
        document.getElementById(id).value = '';
    });
}

function showRequestForm() {
    document.getElementById('maintenanceContent').classList.remove('active');
    document.getElementById('requestForm').style.display = 'block';
    document.getElementById('subject').value = '';
}

function showEquipmentForm() {
    document.getElementById('equipmentContent').classList.remove('active');
    document.getElementById('equipmentForm').style.display = 'block';
}

function backToMaintenanceList() {
    document.getElementById('requestForm').style.display = 'none';
    document.getElementById('maintenanceContent').classList.add('active');
}

function backToEquipmentList() {
    document.getElementById('equipmentForm').style.display = 'none';
    document.getElementById('equipmentContent').classList.add('active');
}

function editMaintenanceItem(item) {
    showRequestForm();
    document.getElementById('subject').value = item.subject;
}

function editEquipmentItem(item) {
    showEquipmentForm();
    document.querySelector('#equipmentForm input[type="text"]').value = item.name;
}

function editTeam(id) {
    const team = teamData.find(t => t.id === id);
    if (team) {
        showTeamForm();
        document.getElementById('teamName').value = team.name;
        document.getElementById('teamMembers').value = team.members;
        document.getElementById('teamLead').value = team.lead;
        document.getElementById('teamEmail').value = team.email;
    }
}

function editWorkCenter(id) {
    const wc = workCenterData.find(w => w.id === id);
    if (wc) {
        showWorkCenterForm();
        document.getElementById('workCenterName').value = wc.name;
        document.getElementById('workCenterCode').value = wc.code;
        document.getElementById('workCenterTag').value = wc.tag;
    }
}

// Calendar functions
let currentWeek = 51;
let currentYear = 2025;
let currentMonth = 'December';

function prevWeek() {
    currentWeek--;
    if (currentWeek < 1) {
        currentWeek = 52;
        currentYear--;
    }
    updateCalendarHeader();
    refreshCalendar();
}

function nextWeek() {
    currentWeek++;
    if (currentWeek > 52) {
        currentWeek = 1;
        currentYear++;
    }
    updateCalendarHeader();
    refreshCalendar();
}

function updateCalendarHeader() {
    const calendarNav = document.querySelector('.calendar-nav span');
    if (calendarNav) {
        calendarNav.textContent = `${currentMonth} ${currentYear} Week ${currentWeek}`;
    }
}

function refreshCalendar() {
    const eventsContainer = document.querySelector('.calendar-events');
    eventsContainer.innerHTML = '';
    
    calendarEvents.forEach(event => {
        const eventEl = document.createElement('div');
        eventEl.className = 'event';
        eventEl.textContent = event.title;
        eventEl.style.top = `${event.time * 40}px`;
        eventEl.style.left = `${event.day * 100}px`;
        eventEl.onclick = () => editCalendarEvent(event);
        eventEl.title = `Assignee: ${event.assignee || 'Unassigned'}`;
        eventsContainer.appendChild(eventEl);
    });
}

function editCalendarEvent(event) {
    const newTitle = prompt('Edit event title:', event.title);
    if (newTitle) {
        event.title = newTitle;
        refreshCalendar();
        saveDataToStorage();
        showNotification('Event updated!', 'success');
    }
}

function setCurrentDates() {
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (!input.value) input.value = today;
    });
}

function addEventListeners() {
    const searchInput = document.querySelector('.navbar input');
    if (searchInput) {
        searchInput.addEventListener('input', performSearch);
    }
}

function switchFormTab(tabName) {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

function logout() {
    showLoading(true);
    
    setTimeout(() => {
        localStorage.clear();
        document.getElementById("authSection").style.display = "flex";
        document.getElementById("dashboardSection").style.display = "none";
        
        document.querySelectorAll('input').forEach(input => {
            if (input.type !== 'button' && input.type !== 'submit') {
                input.value = '';
            }
        });
        
        showLoading(false);
        showNotification('Logged out successfully!', 'info');
    }, 500);
}

function switchCalendarView(view) {
    document.querySelectorAll('.btn-calendar').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    document.querySelectorAll('.calendar-view').forEach(v => v.classList.remove('active'));
    document.getElementById(view + 'View').classList.add('active');
}

function addNewEvent() {
    const title = prompt('Enter event title:');
    if (title) {
        calendarEvents.push({id: Date.now(), title, day: 3, time: 5});
        refreshCalendar();
        saveDataToStorage();
        showNotification('Event added!', 'success');
    }
}

function addLogoutButton() {
    const navbar = document.querySelector('.nav-right');
    if (!document.querySelector('.btn-logout')) {
        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = 'Logout';
        logoutBtn.onclick = logout;
        logoutBtn.className = 'btn-logout';
        navbar.appendChild(logoutBtn);
    }
}

function prevMonth() {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let currentMonth = document.getElementById('monthYear').textContent.split(' ')[0];
    let currentYear = parseInt(document.getElementById('monthYear').textContent.split(' ')[1]);
    
    let monthIndex = monthNames.indexOf(currentMonth);
    monthIndex--;
    if (monthIndex < 0) {
        monthIndex = 11;
        currentYear--;
    }
    
    document.getElementById('monthYear').textContent = `${monthNames[monthIndex]} ${currentYear}`;
}

function nextMonth() {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let currentMonth = document.getElementById('monthYear').textContent.split(' ')[0];
    let currentYear = parseInt(document.getElementById('monthYear').textContent.split(' ')[1]);
    
    let monthIndex = monthNames.indexOf(currentMonth);
    monthIndex++;
    if (monthIndex > 11) {
        monthIndex = 0;
        currentYear++;
    }
    
    document.getElementById('monthYear').textContent = `${monthNames[monthIndex]} ${currentYear}`;
}