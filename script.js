// Countdown Timer
function updateCountdown() {
    const targetDate = new Date('2025-08-12');
    const now = new Date();
    const diff = targetDate - now;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Registration Form Handling
document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        nationality: document.getElementById('nationality').value,
        occupation: document.getElementById('occupation').value,
        organization: document.getElementById('organization').value,
        events: Array.from(document.querySelectorAll('input[name="events"]:checked')).map(cb => cb.value),
        timestamp: new Date().toISOString()
    };
    
    let registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    registrations.push(formData);
    localStorage.setItem('registrations', JSON.stringify(registrations));
    
    document.getElementById('confirmationModal').style.display = 'flex';
    this.reset();
});

// Admin Panel Functions
function openAdminPanel() {
    document.getElementById('adminPanel').style.display = 'flex';
}

function closeAdminPanel() {
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('adminDashboard').style.display = 'none';
}

function loginAdmin() {
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    if (username === '' && password === '') {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
        loadRegistrations();
    } else {
        alert('Identifiants incorrects');
    }
}

function logoutAdmin() {
    document.getElementById('adminDashboard').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('adminUsername').value = '';
    document.getElementById('adminPassword').value = '';
}

function loadRegistrations() {
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    const tableBody = document.getElementById('registrationsTableBody');
    tableBody.innerHTML = '';
    
    if (registrations.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">Aucune inscription trouvée</td>
            </tr>
        `;
        return;
    }
    
    registrations.forEach((reg, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${reg.fullName}</td>
            <td>${reg.email}</td>
            <td>${reg.phone}</td>
            <td>
                <div class="activities-tags">
                    ${reg.events.map(event => `<span class="activity-tag">${event}</span>`).join('')}
                </div>
            </td>
            <td>
                <button onclick="deleteRegistration(${index})" class="delete-button">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function deleteRegistration(index) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette inscription ?')) {
        let registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
        registrations.splice(index, 1);
        localStorage.setItem('registrations', JSON.stringify(registrations));
        loadRegistrations();
    }
}

function exportToCSV() {
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    
    if (registrations.length === 0) {
        alert('Aucune donnée à exporter');
        return;
    }
    
    const headers = ['Nom', 'Email', 'Téléphone', 'Nationalité', 'Profession', 'Organisation', 'Activités', 'Date'];
    const csvContent = [
        headers.join(','),
        ...registrations.map(reg => [
            `"${reg.fullName}"`,
            `"${reg.email}"`,
            `"${reg.phone}"`,
            `"${reg.nationality}"`,
            `"${reg.occupation}"`,
            `"${reg.organization || ''}"`,
            `"${reg.events.join(', ')}"`,
            new Date(reg.timestamp).toLocaleDateString()
        ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'inscriptions_65e_anniversaire.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function closeConfirmationModal() {
    document.getElementById('confirmationModal').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Search functionality
document.getElementById('searchRegistrations').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const rows = document.querySelectorAll('#registrationsTableBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Mobile menu toggle
document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});
