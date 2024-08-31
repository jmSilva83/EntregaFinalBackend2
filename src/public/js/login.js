const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const data = new FormData(loginForm);
    const obj = {};
    data.forEach((value, key) => (obj[key] = value));

    try {
        const response = await fetch('/api/sessions/login', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            window.location.href = '/profile';
        } else {
            const result = await response.json();
            console.log(result.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
    }
});
