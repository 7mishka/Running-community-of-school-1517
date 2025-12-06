document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        

        if (checkCredentials(email, password)) {
            const user = getUserData(email);
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            
            alert('Вход выполнен успешно!')
            window.location.href = 'index.html';
        } else {
            alert('Неверный email или пароль!');
        }
    });
    
    function checkCredentials(email, password) {

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        return users.some(user => 
            user.email === email && user.password === password
        );
    }
    
    function getUserData(email) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        return users.find(user => user.email === email);
    }
});
