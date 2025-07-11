// Base de données locale pour stocker les inscriptions
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
                    description: "Dîner prestigieux réunissant les autorités",
                    price: 25000
                }
            ],
            settings: {
                registrationFee: 5000,
                galaFee: 25000,
                adminPassword: ADMIN_PASSWORD
            }
        };
        localStorage.setItem(DB_NAME, JSON.stringify(db));
    }
}

// Obtenir la base de données
function getDatabase() {
    return JSON.parse(localStorage.getItem(DB_NAME));
}

// Sauvegarder la base de données
function saveDatabase(db) {
    localStorage.setItem(DB_NAME, JSON.stringify(db));
}

// Compte à rebours
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

// Gestion du système de paiement
function setupPaymentSystem() {
    const db = getDatabase();
    const galaCheckbox = document.getElementById('activity6');
    
    // Mettre à jour les frais lorsque la case de la soirée de gala est cochée
    galaCheckbox.addEventListener('change', function() {
        const galaFee = this.checked ? db.settings.galaFee : 0;
        document.getElementById('gala-fee').textContent = galaFee.toLocaleString() + ' FCFA';
        
        const totalFee = db.settings.registrationFee + galaFee;
        document.getElementById('total-fee').textContent = totalFee.toLocaleString() + ' FCFA';
    });
    
    // Gestion des méthodes de paiement
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', function() {
            // Masquer toutes les méthodes de paiement
            document.querySelectorAll('.payment-method').forEach(method => {
                method.classList.remove('active');
            });
            
            // Afficher la méthode sélectionnée
            if (this.value === 'mobile') {
                document.getElementById('mobile-payment').classList.add('active');
            } else if (this.value === 'card') {
                document.getElementById('card-payment').classList.add('active');
            } else if (this.value === 'bank') {
                document.getElementById('bank-payment').classList.add('active');
            }
        });
    });
}

// Simuler le traitement du paiement
function processPayment(formData) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                transactionId: `TX-${Math.floor(10000000 + Math.random() * 90000000)}`,
                timestamp: new Date().toISOString()
            });
        }, 2000);
    });
}

// Gestion du formulaire d'inscription
function setupRegistrationForm() {
    const form = document.getElementById('registrationForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const db = getDatabase();
        const galaSelected = document.getElementById('activity6').checked;
        
        // Récupérer les activités sélectionnées
        const selectedActivities = [];
        document.querySelectorAll('input[name="events"]:checked').forEach(activity => {
            selectedActivities.push(activity.value);
        });
        
        if (selectedActivities.length === 0) {
            alert('Veuillez sélectionner au moins une activité');
            return;
        }
        
        // Créer l'objet d'inscription
        const registration = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            nationality: document.getElementById('nationality').value,
            occupation: document.getElementById('occupation').value,
            organization: document.getElementById('organization').value || '',
            events: selectedActivities,
            paymentMethod: document.querySelector('input[name="payment"]:checked').value,
            amount: db.settings.registrationFee + (galaSelected ? db.settings.galaFee : 0),
            galaSelected: galaSelected,
            paymentStatus: 'pending',
            timestamp: new Date().toISOString()
        };
        
        // Afficher l'état de chargement
        const submitBtn = document.querySelector('.submit-button');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Traitement du paiement...';
        
        try {
            // Simuler le paiement
            const paymentResult = await processPayment(registration);
            
            if (paymentResult.success) {
                // Mettre à jour les détails de la transaction
                registration.transactionId = paymentResult.transactionId;
                registration.paymentStatus = 'paid';
                registration.paymentDate = paymentResult.timestamp;
                
                // Ajouter l'inscription à la base de données
                const db = getDatabase();
                registration.id = Date.now();
                db.registrations.push(registration);
                saveDatabase(db);
                
                // Afficher la confirmation
                document.getElementById('transactionId').textContent = registration.transactionId;
                document.getElementById('paymentAmount').textContent = registration.amount.toLocaleString() + ' FCFA';
                document.getElementById('paymentMethod').textContent = 
                    registration.paymentMethod === 'mobile' ? 'Mobile Money' : 
                    registration.paymentMethod === 'card' ? 'Carte bancaire' : 'Virement bancaire';
                
                document.getElementById('confirmationModal').style.display = 'flex';
                
                // Réinitialiser le formulaire
                this.reset();
                
                // Réinitialiser les frais
                document.getElementById('gala-fee').textContent = '0 FCFA';
                document.getElementById('total-fee').textContent = db.settings.registrationFee.toLocaleString() + ' FCFA';
            } else {
                alert('Le paiement a échoué. Veuillez réessayer.');
            }
        } catch (error) {
            console.error('Erreur de paiement:', error);
            alert('Une erreur est survenue lors du traitement du paiement.');
        } finally {
            // Réinitialiser le bouton
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-lock"></i> Payer et s\'inscrire';
        }
    });
}

// Gestion du panneau d'administration
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
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
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
    const db = getDatabase();
    const registrations = db.registrations;
    const tableBody = document.getElementById('registrationsTableBody');
    tableBody.innerHTML = '';
    
    if (registrations.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">Aucune inscription trouvée</td>
            </tr>
        `;
        return;
    }
    
    registrations.forEach((reg, index) => {
        const row = document.createElement('tr');
        
        // Formater le statut de paiement
        const paymentStatus = reg.paymentStatus === 'paid' ? 
            '<span class="payment-status paid">Payé</span>' : 
            '<span class="payment-status pending">En attente</span>';
        
        row.innerHTML = `
            <td>${reg.fullName}</td>
            <td>${reg.email}</td>
            <td>${reg.phone}</td>
            <td>
                <div class="activities-tags">
                    ${reg.events.map(event => `<span class="activity-tag">${event}</span>`).join('')}
                </div>
            </td>
            <td>${paymentStatus}</td>
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
        const db = getDatabase();
        db.registrations.splice(index, 1);
        saveDatabase(db);
        loadRegistrations();
    }
}

function exportToCSV() {
    const db = getDatabase();
    const registrations = db.registrations;
    
    if (registrations.length === 0) {
        alert('Aucune donnée à exporter');
        return;
    }
    
    const headers = ['Nom', 'Email', 'Téléphone', 'Nationalité', 'Profession', 'Organisation', 'Activités', 'Méthode de paiement', 'Montant', 'Statut', 'Date'];
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
            reg.paymentMethod === 'mobile' ? 'Mobile Money' : 
            reg.paymentMethod === 'card' ? 'Carte bancaire' : 'Virement bancaire',
            reg.amount,
            reg.paymentStatus === 'paid' ? 'Payé' : 'En attente',
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

// Recherche dans les inscriptions
function setupSearch() {
    document.getElementById('searchRegistrations').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = document.querySelectorAll('#registrationsTableBody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
}

// Navigation fluide
function setupSmoothScrolling() {
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
}

// Menu mobile
function setupMobileMenu() {
    document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
        const navLinks = document.querySelector('.nav-links');
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    });
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initDatabase();
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    setupPaymentSystem();
    setupRegistrationForm();
    setupSearch();
    setupSmoothScrolling();
    setupMobileMenu();
    
    // Initialiser les frais
    const db = getDatabase();
    document.getElementById('gala-fee').textContent = '0 FCFA';
    document.getElementById('total-fee').textContent = db.settings.registrationFee.toLocaleString() + ' FCFA';
});