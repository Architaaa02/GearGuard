// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        alert('Please login first!');
        window.location.href = 'index.html';
        return;
    }
    
    // Set user name
    const userName = localStorage.getItem('userName') || 'User';
    document.getElementById('userName').textContent = `Welcome, ${userName}!`;
    
    // Initialize dashboard
    loadDashboardData();
    updateStats();
    
    // Set up form handlers
    setupFormHandlers();
});

function setupFormHandlers() {
    // Equipment form handler
    document.getElementById('equipmentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addEquipment();
    });
    
    // Maintenance form handler
    document.getElementById('maintenanceForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addMaintenance();
    });
}

function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.add('hidden'));
    
    // Show selected section
    document.getElementById(sectionName).classList.remove('hidden');
    
    // Update active nav link
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => link.classList.remove('active'));
    event.target.classList.add('active');
    
    // Load section-specific data
    if (sectionName === 'equipment') {
        loadEquipmentList();
    } else if (sectionName === 'maintenance') {
        loadMaintenanceList();
        updateMaintenanceEquipmentSelect();
    }
}

function loadDashboardData() {
    // Initialize data if not exists
    if (!localStorage.getItem('equipment')) {
        localStorage.setItem('equipment', JSON.stringify([]));
    }
    if (!localStorage.getItem('maintenance')) {
        localStorage.setItem('maintenance', JSON.stringify([]));
    }
    if (!localStorage.getItem('activity')) {
        localStorage.setItem('activity', JSON.stringify([]));
    }
}

function updateStats() {
    const equipment = JSON.parse(localStorage.getItem('equipment') || '[]');
    const maintenance = JSON.parse(localStorage.getItem('maintenance') || '[]');
    
    const totalEquipment = equipment.length;
    const pendingMaintenance = maintenance.filter(m => m.status === 'pending').length;
    const completedThisMonth = maintenance.filter(m => {
        const taskDate = new Date(m.date);
        const now = new Date();
        return m.status === 'completed' && 
               taskDate.getMonth() === now.getMonth() && 
               taskDate.getFullYear() === now.getFullYear();
    }).length;
    const overdueTasks = maintenance.filter(m => {
        const taskDate = new Date(m.date);
        const now = new Date();
        return m.status === 'pending' && taskDate < now;
    }).length;
    
    document.getElementById('totalEquipment').textContent = totalEquipment;
    document.getElementById('pendingMaintenance').textContent = pendingMaintenance;
    document.getElementById('completedMaintenance').textContent = completedThisMonth;
    document.getElementById('overdueTasks').textContent = overdueTasks;
    
    updateActivityList();
}

function updateActivityList() {
    const activity = JSON.parse(localStorage.getItem('activity') || '[]');
    const activityList = document.getElementById('activityList');
    
    if (activity.length === 0) {
        activityList.innerHTML = '<li>No recent activity</li>';
        return;
    }
    
    const recentActivity = activity.slice(-5).reverse();
    activityList.innerHTML = recentActivity.map(item => 
        `<li>${item.message} - ${new Date(item.timestamp).toLocaleDateString()}</li>`
    ).join('');
}

function addActivity(message) {
    const activity = JSON.parse(localStorage.getItem('activity') || '[]');
    activity.push({
        message: message,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('activity', JSON.stringify(activity));
}

function showAddEquipmentModal() {
    document.getElementById('equipmentModal').style.display = 'block';
}

function showAddMaintenanceModal() {
    updateMaintenanceEquipmentSelect();
    document.getElementById('maintenanceModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    // Clear form
    const form = document.querySelector(`#${modalId} form`);
    if (form) form.reset();
}

function addEquipment() {
    const name = document.getElementById('equipmentName').value;
    const type = document.getElementById('equipmentType').value;
    const location = document.getElementById('equipmentLocation').value;
    const description = document.getElementById('equipmentDescription').value;
    
    const equipment = JSON.parse(localStorage.getItem('equipment') || '[]');
    const newEquipment = {
        id: Date.now(),
        name: name,
        type: type,
        location: location,
        description: description,
        addedAt: new Date().toISOString()
    };
    
    equipment.push(newEquipment);
    localStorage.setItem('equipment', JSON.stringify(equipment));
    
    addActivity(`Added new equipment: ${name}`);
    updateStats();
    loadEquipmentList();
    closeModal('equipmentModal');
}

function loadEquipmentList() {
    const equipment = JSON.parse(localStorage.getItem('equipment') || '[]');
    const equipmentList = document.getElementById('equipmentList');
    
    if (equipment.length === 0) {
        equipmentList.innerHTML = '<p>No equipment added yet.</p>';
        return;
    }
    
    equipmentList.innerHTML = equipment.map(item => `
        <div class="equipment-item">
            <h4>${item.name}</h4>
            <p><strong>Type:</strong> ${item.type}</p>
            <p><strong>Location:</strong> ${item.location}</p>
            <p><strong>Description:</strong> ${item.description}</p>
            <p><strong>Added:</strong> ${new Date(item.addedAt).toLocaleDateString()}</p>
            <button onclick="deleteEquipment(${item.id})" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-top: 10px;">Delete</button>
        </div>
    `).join('');
}

function deleteEquipment(id) {
    if (confirm('Are you sure you want to delete this equipment?')) {
        let equipment = JSON.parse(localStorage.getItem('equipment') || '[]');
        const equipmentName = equipment.find(e => e.id === id)?.name;
        equipment = equipment.filter(e => e.id !== id);
        localStorage.setItem('equipment', JSON.stringify(equipment));
        
        // Also remove related maintenance tasks
        let maintenance = JSON.parse(localStorage.getItem('maintenance') || '[]');
        maintenance = maintenance.filter(m => m.equipmentId !== id);
        localStorage.setItem('maintenance', JSON.stringify(maintenance));
        
        addActivity(`Deleted equipment: ${equipmentName}`);
        updateStats();
        loadEquipmentList();
    }
}

function updateMaintenanceEquipmentSelect() {
    const equipment = JSON.parse(localStorage.getItem('equipment') || '[]');
    const select = document.getElementById('maintenanceEquipment');
    
    select.innerHTML = '<option value="">Select Equipment</option>';
    equipment.forEach(item => {
        select.innerHTML += `<option value="${item.id}">${item.name}</option>`;
    });
}

function addMaintenance() {
    const equipmentId = document.getElementById('maintenanceEquipment').value;
    const task = document.getElementById('maintenanceTask').value;
    const date = document.getElementById('maintenanceDate').value;
    const priority = document.getElementById('maintenancePriority').value;
    const notes = document.getElementById('maintenanceNotes').value;
    
    if (!equipmentId) {
        alert('Please select equipment');
        return;
    }
    
    const equipment = JSON.parse(localStorage.getItem('equipment') || '[]');
    const selectedEquipment = equipment.find(e => e.id == equipmentId);
    
    const maintenance = JSON.parse(localStorage.getItem('maintenance') || '[]');
    const newMaintenance = {
        id: Date.now(),
        equipmentId: parseInt(equipmentId),
        equipmentName: selectedEquipment.name,
        task: task,
        date: date,
        priority: priority,
        notes: notes,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    maintenance.push(newMaintenance);
    localStorage.setItem('maintenance', JSON.stringify(maintenance));
    
    addActivity(`Scheduled maintenance: ${task} for ${selectedEquipment.name}`);
    updateStats();
    loadMaintenanceList();
    closeModal('maintenanceModal');
}

function loadMaintenanceList() {
    const maintenance = JSON.parse(localStorage.getItem('maintenance') || '[]');
    const maintenanceList = document.getElementById('maintenanceList');
    
    if (maintenance.length === 0) {
        maintenanceList.innerHTML = '<p>No maintenance tasks scheduled.</p>';
        return;
    }
    
    maintenanceList.innerHTML = maintenance.map(item => `
        <div class="maintenance-item priority-${item.priority}">
            <h4>${item.task}</h4>
            <p><strong>Equipment:</strong> ${item.equipmentName}</p>
            <p><strong>Date:</strong> ${new Date(item.date).toLocaleDateString()}</p>
            <p><strong>Priority:</strong> ${item.priority.toUpperCase()}</p>
            <p><strong>Status:</strong> ${item.status.toUpperCase()}</p>
            <p><strong>Notes:</strong> ${item.notes}</p>
            <div style="margin-top: 10px;">
                ${item.status === 'pending' ? `<button onclick="completeMaintenance(${item.id})" style="background: #27ae60; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-right: 10px;">Complete</button>` : ''}
                <button onclick="deleteMaintenance(${item.id})" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Delete</button>
            </div>
        </div>
    `).join('');
}

function completeMaintenance(id) {
    let maintenance = JSON.parse(localStorage.getItem('maintenance') || '[]');
    const task = maintenance.find(m => m.id === id);
    if (task) {
        task.status = 'completed';
        task.completedAt = new Date().toISOString();
        localStorage.setItem('maintenance', JSON.stringify(maintenance));
        
        addActivity(`Completed maintenance: ${task.task} for ${task.equipmentName}`);
        updateStats();
        loadMaintenanceList();
    }
}

function deleteMaintenance(id) {
    if (confirm('Are you sure you want to delete this maintenance task?')) {
        let maintenance = JSON.parse(localStorage.getItem('maintenance') || '[]');
        const task = maintenance.find(m => m.id === id);
        maintenance = maintenance.filter(m => m.id !== id);
        localStorage.setItem('maintenance', JSON.stringify(maintenance));
        
        addActivity(`Deleted maintenance task: ${task.task}`);
        updateStats();
        loadMaintenanceList();
    }
}

function generateReport() {
    const reportType = document.getElementById('reportType').value;
    const reportContent = document.getElementById('reportContent');
    
    const equipment = JSON.parse(localStorage.getItem('equipment') || '[]');
    const maintenance = JSON.parse(localStorage.getItem('maintenance') || '[]');
    
    let reportHTML = '';
    
    switch (reportType) {
        case 'monthly':
            const now = new Date();
            const thisMonth = maintenance.filter(m => {
                const taskDate = new Date(m.date);
                return taskDate.getMonth() === now.getMonth() && 
                       taskDate.getFullYear() === now.getFullYear();
            });
            
            reportHTML = `
                <h3>Monthly Report - ${now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                <p><strong>Total Tasks This Month:</strong> ${thisMonth.length}</p>
                <p><strong>Completed Tasks:</strong> ${thisMonth.filter(m => m.status === 'completed').length}</p>
                <p><strong>Pending Tasks:</strong> ${thisMonth.filter(m => m.status === 'pending').length}</p>
                <h4>Task Details:</h4>
                <ul>
                    ${thisMonth.map(m => `<li>${m.task} - ${m.equipmentName} (${m.status})</li>`).join('')}
                </ul>
            `;
            break;
            
        case 'equipment':
            reportHTML = `
                <h3>Equipment Report</h3>
                <p><strong>Total Equipment:</strong> ${equipment.length}</p>
                <h4>Equipment List:</h4>
                <ul>
                    ${equipment.map(e => `<li>${e.name} - ${e.type} (${e.location})</li>`).join('')}
                </ul>
            `;
            break;
            
        case 'maintenance':
            const completed = maintenance.filter(m => m.status === 'completed').length;
            const pending = maintenance.filter(m => m.status === 'pending').length;
            
            reportHTML = `
                <h3>Maintenance Report</h3>
                <p><strong>Total Maintenance Tasks:</strong> ${maintenance.length}</p>
                <p><strong>Completed:</strong> ${completed}</p>
                <p><strong>Pending:</strong> ${pending}</p>
                <p><strong>Completion Rate:</strong> ${maintenance.length > 0 ? Math.round((completed / maintenance.length) * 100) : 0}%</p>
                <h4>Recent Tasks:</h4>
                <ul>
                    ${maintenance.slice(-10).map(m => `<li>${m.task} - ${m.equipmentName} (${m.status})</li>`).join('')}
                </ul>
            `;
            break;
    }
    
    reportContent.innerHTML = reportHTML;
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        window.location.href = 'index.html';
    }
}

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}