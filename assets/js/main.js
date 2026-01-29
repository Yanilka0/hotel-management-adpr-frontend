/**
 * Main Application Logic
 * Handles Data Persistence (localStorage) and Layout Rendering
 */

const STORAGE_KEY = 'reservations';

// --- Data Management Functionality ---

const getReservations = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
};

const saveReservations = (reservations) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
};

const addReservation = (data) => {
    const reservations = getReservations();
    const newReservation = {
        ...data,
        id: crypto.randomUUID(),
        status: 'Confirmed',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    reservations.unshift(newReservation);
    saveReservations(reservations);
    return newReservation;
};

const updateReservation = (id, updatedData) => {
    const reservations = getReservations();
    const index = reservations.findIndex(r => r.id === id);
    if (index !== -1) {
        reservations[index] = { ...reservations[index], ...updatedData };
        saveReservations(reservations);
        return true;
    }
    return false;
};

const deleteReservation = (id) => {
    const reservations = getReservations();
    const newReservations = reservations.filter(r => r.id !== id);
    saveReservations(newReservations);
};

const getReservationById = (id) => {
    const reservations = getReservations();
    return reservations.find(r => r.id === id);
};


// --- UI & Layout Functionality ---

const renderLayout = () => {
    const layoutContainer = document.getElementById('layout-container');
    if (!layoutContainer) return;

    // Determine active path for highlighting
    const path = window.location.pathname.split('/').pop() || 'home.html';

    // Inject Header and Navigation
    layoutContainer.innerHTML = `
        <header class="header-main">
            <div class="brand">
                <div class="brand-icon">🏨</div>
                <h1 class="brand-text">Boutique Hotel Management</h1>
            </div>
            <div style="position: relative;">
                <button class="user-menu-btn" onclick="toggleUserMenu()">TM</button>
                <div id="user-menu" style="display: none; position: absolute; right: 0; top: 100%; margin-top: 0.5rem; width: 12rem; background: white; border-radius: 0.5rem; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border: 1px solid var(--border-color); overflow: hidden; z-index: 50;">
                    <div style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--border-color); background-color: #f9fafb;">
                        <p style="font-weight: 500; color: var(--text-dark); font-size: 0.875rem;">Team Member</p>
                        <p style="color: var(--text-light); font-size: 0.75rem;">staff@hotel.com</p>
                    </div>
                    <button onclick="handleLogout()" style="width: 100%; text-align: left; padding: 0.5rem 1rem; color: var(--danger); background: none; border: none; cursor: pointer; font-size: 0.875rem;">Logout</button>
                </div>
            </div>
        </header>

        <nav class="nav-main">
            <ul class="nav-list">
                <li><a href="home.html" class="nav-link ${path === 'home.html' ? 'active' : ''}">Dashboard</a></li>
                <li><a href="create-booking.html" class="nav-link ${path === 'create-booking.html' ? 'active' : ''}">New Booking</a></li>
                <li><a href="reservations.html" class="nav-link ${path === 'reservations.html' ? 'active' : ''}">Reservations</a></li>
                <li><a href="#" class="nav-link">Settings</a></li>
            </ul>
        </nav>
    `;
};

// --- Helper Functions ---

const toggleUserMenu = () => {
    const menu = document.getElementById('user-menu');
    if (menu) {
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    }
};

const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'index.html';
    }
};

// Close menus when clicking outside
document.addEventListener('click', (e) => {
    const menu = document.getElementById('user-menu');
    const btn = document.querySelector('.user-menu-btn');
    if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
        menu.style.display = 'none';
    }
});

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    renderLayout();
});
