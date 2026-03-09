document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.querySelector('.menu-btn');
    const sidebarMenu = document.getElementById('sidebar-menu');
    const overlay = document.getElementById('sidebar-overlay');

    if (!menuButton || !sidebarMenu || !overlay) {
        return;
    }

    const openMenu = () => {
        sidebarMenu.classList.add('active');
        overlay.classList.add('active');
    };

    const closeMenu = () => {
        sidebarMenu.classList.remove('active');
        overlay.classList.remove('active');
    };

    menuButton.addEventListener('click', () => {
        if (sidebarMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    overlay.addEventListener('click', closeMenu);
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && sidebarMenu.classList.contains('active')) {
            closeMenu();
        }
    });
});
