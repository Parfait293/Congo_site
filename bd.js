// Base de données locale (simulée avec localStorage)
const DB_NAME = "congo_independence_db";
const ADMIN_USERNAME = "";
const ADMIN_PASSWORD = "";

// Initialiser la base de données
function initDatabase() {
    if (!localStorage.getItem(DB_NAME)) {
        const db = {
            registrations: [],
            events: [
                {
                    id: 1,
                    title: "Culte d'Action de Grâces",
                    date: "2025-08-12",
                    time: "19:00",
                    location: "Place Bicentenaire",
                    description: "Moment spirituel pour rendre grâce à Dieu pour l'indépendance"
                },
                {
                    id: 2,
                    title: "Festival Culturel Congolais",
                    date: "2025-08-13",
                    time: "10:00",
                    location: "Place Bicentenaire",
                    description: "Mise en valeur de la culture congolaise"
                },
                {
                    id: 3,
                    title: "Journée de Salubrité",
                    date: "2025-08-14",
                    time: "08:00",
                    location: "Cotonou",
                    description: "Action citoyenne pour promouvoir l'hygiène et la propreté"
                },
                {
                    id: 4,
                    title: "Prix d'Excellence et de Solidarité",
                    date: "2025-08-15",
                    time: "14:00",
                    location: "Place Bicentenaire",
                    description: "Soutien à l'entrepreneuriat et reconnaissance de l'excellence"
                },
                {
                    id: 5,
                    title: "Rencontres Sportives",
                    date: "2025-08-15",
                    time: "10:00",
                    location: "Place Bicentenaire",
                    description: "Compétitions sportives pour promouvoir la santé"
                },
                {
                    id: 6,
                    title: "Soirée de Gala Officielle",
                    date: "2025-08-15",
                    time: "19:00",
                    location: "MAJESTIC de Cadjèhoun",
                    description: "Dîner prestigieux réunissant les autorités"
                }
            ],
            settings: {
                adminPassword: ADMIN_PASSWORD
            }
        };
        localStorage.setItem(DB_NAME, JSON.stringify(db));
    }
    updateStats();
}

// Obtenir la base de données
function getDatabase() {
    return JSON.parse(localStorage.getItem(DB_NAME));
}

// Sauvegarder la base de données
function saveDatabase(db) {
    localStorage.setItem(DB_NAME, JSON.stringify(db));
    updateStats();
}

// Ajouter une inscription
function addRegistration(registration) {
    const db = getDatabase();
    registration.id = Date.now();
    registration.timestamp = new Date().toISOString();
    db.registrations.push(registration);
    saveDatabase(db);
    return true;
}

// Obtenir toutes les inscriptions
function getRegistrations() {
    const db = getDatabase();
    return db.registrations;
}

// Supprimer une inscription
function deleteRegistration(id) {
    const db = getDatabase();
    db.registrations = db.registrations.filter(reg => reg.id !== id);
    saveDatabase(db);
}

// Supprimer toutes les inscriptions
function clearRegistrations() {
    if (confirm("Êtes-vous sûr de vouloir supprimer TOUTES les inscriptions ?")) {
        const db = getDatabase();
        db.registrations = [];
        saveDatabase(db);
        alert("Toutes les inscriptions ont été supprimées.");
        loadRegistrations();
    }
}

// Mettre à jour les statistiques
function updateStats() {
    const registrations = getRegistrations();
    document.getElementById('totalRegistrations').textContent = registrations.length;
    document.getElementById('adminTotalRegistrations').textContent = registrations.length;
    
    // Statistiques récentes (7 derniers jours)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentRegs = registrations.filter(reg => {
        return new Date(reg.timestamp) > oneWeekAgo;
    });
    document.getElementById('adminRecentRegistrations').textContent = recentRegs.length;
    
    // Activité la plus populaire
    if (registrations.length > 0) {
        const activityCount = {};
        registrations.forEach(reg => {
            reg.events.forEach(event => {
                activityCount[event] = (activityCount[event] || 0) + 1;
            });
        });
        
        let popularActivity = "";
        let maxCount = 0;
        for (const activity in activityCount) {
            if (activityCount[activity] > maxCount) {
                maxCount = activityCount[activity];
                popularActivity = activity;
            }
        }
        document.getElementById('adminPopularActivity').textContent = popularActivity;
        
        // Moyenne d'activités par participant
        const totalActivities = registrations.reduce((sum, reg) => sum + reg.events.length, 0);
        const avgActivities = (totalActivities / registrations.length).toFixed(1);
        document.getElementById('adminAvgActivities').textContent = avgActivities;
    }
}

// Afficher les inscriptions dans le tableau
function loadRegistrations() {
    const registrations = getRegistrations();
    const tableBody = document.getElementById('registrationsTable');
    const noDataMessage = document.getElementById('noDataMessage');
    
    if (registrations.length === 0) {
        tableBody.innerHTML = '';
        noDataMessage.style.display = 'block';
        return;
    }
    
    noDataMessage.style.display = 'none';
    let tableHTML = '';
    
    registrations.forEach(reg => {
        tableHTML += `
            <tr>
                <td>${reg.fullName}</td>
                <td>${reg.email}</td>
                <td>${reg.phone}</td>
                <td>
                    <div class="activity-tags">
                        ${reg.events.map(event => `
                            <span>${event}</span>
                        `).join('')}
                    </div>
                </td>
                <td>${new Date(reg.timestamp).toLocaleDateString()}</td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = tableHTML;
}

// Exporter les inscriptions au format CSV
function exportToCSV() {
    const registrations = getRegistrations();
    
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

// Télécharger une sauvegarde de la base de données
function downloadBackup() {
    const db = getDatabase();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "congo_db_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// Gestion du panneau d'administration
function openAdminPanel() {
    document.getElementById('adminPanel').style.display = 'flex';
}

function closeAdminPanel() {
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('adminDashboard').style.display = 'none';
    document.getElementById('adminUsername').value = '';
    document.getElementById('adminPassword').value = '';
}

function loginAdmin() {
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
        updateStats();
    } else {
        alert('Identifiants incorrects');
    }
}

function logoutAdmin() {
    closeAdminPanel();
}

// Compte à rebours
function updateCountdown() {
    const targetDate = new Date('2025-08-12');
    const now = new Date();
    const diff = targetDate - now;
    
    if (diff <= 0) {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    
    // Mettre à jour les jours restants dans le tableau de bord
    document.getElementById('daysLeft').textContent = days;
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initDatabase();
    loadRegistrations();
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // Recherche dans les inscriptions
    document.getElementById('searchInput').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = document.querySelectorAll('#registrationsTable tr');
        let visibleCount = 0;
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });
        
        const noDataMessage = document.getElementById('noDataMessage');
        if (visibleCount === 0 && getRegistrations().length > 0) {
            noDataMessage.style.display = 'block';
        } else {
            noDataMessage.style.display = 'none';
        }
    });
});