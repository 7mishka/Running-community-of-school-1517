document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registrationForm');
    const registerButton = document.getElementById('registerButton')
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
    const grade=document.getElementById('classs').value;
    if (grade <8 || grade >11) {
        alert('Невозможна регистрация с таким классом');
        return;
    }
    
    const age=document.getElementById('age').value;
    if (age <13 || age >18 ) {
        alert('Невозможна регистрация с таким возрастом');
        return;
    }
        const formData = {
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            name: document.getElementById('username').value,
            email: document.getElementById('email').value,
            grade:grade,
            schoolBuilding: document.getElementById('corpus').value,
            age: document.getElementById('age').value,
            gender: document.querySelector('input[name="gender"]:checked')?.value,
            password: document.getElementById('password').value,
            timestamp: new Date().toISOString()
        };
            saveUserData(formData);
        
        alert('Регистрация успешна! Данные сохранены');

        registrationForm.reset();

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        
    });
    
    function saveUserData(userData) {

        let users = JSON.parse(localStorage.getItem('users') || '[]');
        

        users.push(userData);

        localStorage.setItem('users', JSON.stringify(users));
        
        let loginUsers = JSON.parse(localStorage.getItem('users') || '[]');
        loginUsers.push({
            email: userData.email,
            username: userData.name.toLowerCase().replace(/\s+/g, ''),
            password: userData.password
        });
        
        console.log('Данные пользователя сохранены:', userData);
        console.log('Все пользователи:', users);
    }
});
