const searchInput = document.getElementById('search-input');
const searchIcon = document.querySelector('.search-icon');

if (searchIcon && searchInput) {
    searchIcon.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
}

function handleSearch() {
    if (!searchInput) return;
    const query = searchInput.value.trim();
    if (query) {
        window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
    }
}
