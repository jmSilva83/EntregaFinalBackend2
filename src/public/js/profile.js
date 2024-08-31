const logout = document.getElementById('logoutButton');

logout.addEventListener('click', async (evt) => {
    evt.preventDefault();

    try {
        const response = await fetch('/api/sessions/logout', {
            method: 'GET',
        });

        if (response.ok) {
            window.location.href = '/';
        } else {
            const result = await response.json();
            alert(result.message || 'Logout failed');
        }
    } catch (error) {
        console.error('Logout error:', error);
        alert('Logout error');
    }
});
