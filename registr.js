// В файле register.js или в <script> на странице регистрации
document.addEventListener('DOMContentLoaded', async function() {
    const registrationForm = document.getElementById('registrationForm');
    const registerButton = document.getElementById('registerButton');
    
    // Инициализируем базу данных
    await database.init();

    registrationForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Блокируем кнопку
        if (registerButton) {
            registerButton.disabled = true;
            registerButton.textContent = 'Регистрация...';
        }
        
        const grade = document.getElementById('classs').value;
        if (grade < 8 || grade > 11) {
            alert('Невозможна регистрация с таким классом');
            resetButton();
            return;
        }
        
        const age = document.getElementById('age').value;
        if (age < 13 || age > 18) {
            alert('Невозможна регистрация с таким возрастом');
            resetButton();
            return;
        }
        
        // Получаем данные формы
        const formData = {
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            name: document.getElementById('username').value.trim(),
            email: document.getElementById('email').value.trim(),
            grade: grade,
            schoolBuilding: document.getElementById('corpus').value,
            age: parseInt(age),
            gender: document.querySelector('input[name="gender"]:checked')?.value,
            password: document.getElementById('password').value,
            timestamp: new Date().toISOString()
        };

        // Валидация
        if (!formData.name || !formData.email || !formData.password) {
            alert('Заполните все обязательные поля');
            resetButton();
            return;
        }

        if (formData.password.length < 6) {
            alert('Пароль должен содержать минимум 6 символов');
            resetButton();
            return;
        }

        try {
            // Добавляем пользователя в базу
            await database.addUser(formData);
            
            // Также сохраняем для входа в localStorage (опционально)
            let loginUsers = JSON.parse(localStorage.getItem('loginUsers') || '[]');
            loginUsers.push({
                email: formData.email,
                username: formData.name.toLowerCase().replace(/\s+/g, ''),
                password: formData.password
            });
            localStorage.setItem('loginUsers', JSON.stringify(loginUsers));
            
            alert('Регистрация успешна! Данные сохранены.');
            console.log('Зарегистрирован пользователь:', formData);
            
            // Сбрасываем форму
            registrationForm.reset();
            
            // Перенаправляем через 2 секунды
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            alert('Ошибка: ' + error.message);
        } finally {
            resetButton();
        }
    });

    function resetButton() {
        if (registerButton) {
            registerButton.disabled = false;
            registerButton.textContent = 'Создать аккаунт';
        }
    }

    function showError(input, message) {
        clearError(input);
        const error = document.createElement('div');
        error.className = 'error-message';
        error.style.color = 'red';
        error.style.fontSize = '12px';
        error.style.marginTop = '5px';
        error.textContent = message;
        input.parentNode.appendChild(error);
    }

    function clearError(input) {
        const error = input.parentNode.querySelector('.error-message');
        if (error) error.remove();
    }
});
