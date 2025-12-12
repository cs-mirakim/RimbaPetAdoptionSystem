// includes/sidebar.js
// Script untuk handle semua logic sidebar - load sekali je untuk semua page

// Menu definitions untuk setiap role
const menus = {
    adopter: [
        {label: 'Dashboard', href: 'dashboard_adopter.html'},
        {label: 'Monitor Applications', href: 'monitor_application.html'},
        {label: 'Monitor Lost Animal', href: 'monitor_lost.html'},
        {label: 'Monitor Feedback', href: 'feedback_list.html'},
        {label: 'Pet List', href: 'pet_list.html'},
        {label: 'Shelter List', href: 'shelter_list.html'},
        {label: 'Lost Animal List', href: 'lost_animal.html'}
    ],
    shelter: [
        {label: 'Dashboard', href: 'dashboard_shelter.html'},
        {label: 'Manage Pets', href: 'manage_pets.html'},
        {label: 'Manage Requests', href: 'manage_request.html'}
    ],
    admin: [
        {label: 'Dashboard', href: 'dashboard_admin.html'},
        {label: 'Manage Banner', href: 'manage_banner.html'},
        {label: 'Review Registrations', href: 'review_registrations.html'}
    ]
};

// Function untuk initialize sidebar - akan dipanggil selepas HTML loaded
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const menuContainer = document.getElementById('sidebar-menu');
    const logoutLink = document.getElementById('sidebar-logout');
    const closeBtn = document.getElementById('sidebarClose');

    if (!sidebar || !overlay || !menuContainer) {
        console.error('Sidebar elements not found');
        return;
    }

    // Render menu untuk role tertentu
    function renderMenu(role) {
        menuContainer.innerHTML = '';
        const items = menus[role] || [];

        items.forEach((item, idx) => {
            let el;
            if (item.href) {
                // Anchor navigation untuk adopter pages
                el = document.createElement('a');
                el.href = item.href;
                el.setAttribute('role', 'menuitem');
                el.className = 'w-full block text-left px-3 py-2 rounded hover:bg-[#24483E] transition-colors';
                el.textContent = item.label;
            } else {
                // Fallback button yang call action
                el = document.createElement('button');
                el.type = 'button';
                el.className = 'w-full text-left px-3 py-2 rounded hover:bg-[#24483E] transition-colors';
                el.textContent = item.label;
                el.addEventListener('click', () => {
                    try {
                        item.action();
                    } catch (e) {
                        console.log(e);
                    }
                    closeSidebar();
                });
            }

            menuContainer.appendChild(el);

            // Divider line
            if (idx < items.length - 1) {
                const hr = document.createElement('div');
                hr.className = 'border-t border-slate-500/30 my-1';
                menuContainer.appendChild(hr);
            }
        });
    }

    // Open sidebar
    function openSidebar() {
        sidebar.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
        sidebar.setAttribute('aria-hidden', 'false');
        overlay.setAttribute('aria-hidden', 'false');
    }

    // Close sidebar
    function closeSidebar() {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
        sidebar.setAttribute('aria-hidden', 'true');
        overlay.setAttribute('aria-hidden', 'true');
    }

    // Event delegation untuk header toggle button
    document.addEventListener('click', function (e) {
        const target = e.target;

        // Toggle sidebar bila click header button
        if (target.closest && target.closest('#sidebarBtn')) {
            if (sidebar.classList.contains('-translate-x-full'))
                openSidebar();
            else
                closeSidebar();
        }

        // Close bila click overlay
        if (target.closest && target.closest('#sidebar-overlay')) {
            closeSidebar();
        }
    });

    // Close button dalam sidebar
    if (closeBtn)
        closeBtn.addEventListener('click', closeSidebar);

    // Escape key tutup sidebar
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape')
            closeSidebar();
    });

    // Radio change untuk tukar menu content
    document.addEventListener('change', (e) => {
        const r = e.target;
        if (r.name === 'sidebar_role') {
            renderMenu(r.value);
        }
    });

    // Logout link
    if (logoutLink) {
        logoutLink.addEventListener('click', (ev) => {
            closeSidebar();
        });
    }

    // Initial render (default checked radio)
    const initial = document.querySelector('input[name="sidebar_role"]:checked');
    renderMenu(initial ? initial.value : 'admin');

    // Overlay click juga tutup
    overlay.addEventListener('click', closeSidebar);
}

// Auto-load header, sidebar, footer untuk semua page
document.addEventListener('DOMContentLoaded', function () {
    const headerPath = "includes/header.html";
    const sidebarPath = "includes/sidebar.html";
    const footerPath = "includes/footer.html";

    Promise.all([
        fetch(headerPath).then(r => r.ok ? r.text() : Promise.reject('header load failed')),
        fetch(sidebarPath).then(r => r.ok ? r.text() : Promise.reject('sidebar load failed')),
        fetch(footerPath).then(r => r.ok ? r.text() : Promise.reject('footer load failed'))
    ]).then(([headerHTML, sidebarHTML, footerHTML]) => {
        // Inject header
        const headerContainer = document.getElementById("header");
        if (headerContainer) {
            headerContainer.innerHTML = headerHTML;
        }

        // Inject footer
        const footerContainer = document.getElementById("footer");
        if (footerContainer) {
            footerContainer.innerHTML = footerHTML;
        }

        // Extract sidebar HTML (buang script tags kalau ada)
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = sidebarHTML;
        const sidebarElements = tempDiv.querySelector('aside');
        const overlayElement = tempDiv.querySelector('#sidebar-overlay');

        // Append sidebar elements ke body
        if (overlayElement)
            document.body.appendChild(overlayElement);
        if (sidebarElements)
            document.body.appendChild(sidebarElements);

        // SEKARANG initialize sidebar selepas DOM ready
        initSidebar();
    }).catch(err => {
        console.error('Error loading includes:', err);
    });
});
