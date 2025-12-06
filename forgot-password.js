document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reset-form');
    const emailInput = document.getElementById('loginEmail');
    const emailError = document.getElementById('loginEmailError');
    const resetBtn = document.getElementById('resetBtn');
    const resultContainer = document.getElementById('password-result-container');
    const passwordInput = document.getElementById('generatedPassword');
    const copyBtn = document.getElementById('copyPasswordBtn');
    
    const spinner = resetBtn.querySelector('.loading-spinner');
    const btnText = resetBtn.querySelector('.btn-text');
    
    spinner.style.display = 'none';
    resultContainer.style.display = 'none';
    
    const generatePassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let password = '';
        for (let i = 0; i < 12; i++) {
            password += chars[Math.floor(Math.random() * chars.length)];
        }
        return password;
    };
    
    const userExists = (email) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        return users.some(user => user.email === email);
    };
    
    const updatePassword = (email, newPass) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const updated = users.map(user => 
            user.email === email ? {...user, password: newPass} : user
        );
        localStorage.setItem('users', JSON.stringify(updated));
    };
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        
        if (!email) {
            emailError.textContent = 'Введите email';
            emailError.style.display = 'block';
            return;
        }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            emailError.textContent = 'Неверный email';
            emailError.style.display = 'block';
            return;
        }
        
        if (!userExists(email)) {
            emailError.textContent = 'Пользователь не найден';
            emailError.style.display = 'block';
            return;
        }
        
        emailError.style.display = 'none';
        btnText.style.display = 'none';
        spinner.style.display = 'block';
        resetBtn.disabled = true;
        
        setTimeout(() => {
            const newPass = generatePassword();
            updatePassword(email, newPass);
            
            passwordInput.value = newPass;
            form.style.display = 'none';
            resultContainer.style.display = 'block';
            
            btnText.style.display = 'block';
            spinner.style.display = 'none';
            resetBtn.disabled = false;
        }, 1000);
    });
    
    copyBtn.addEventListener('click', () => {
        passwordInput.select();
        document.execCommand('copy');
        copyBtn.textContent = 'Скопировано';
        copyBtn.disabled = true;
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    });
    
    emailInput.addEventListener('input', () => {
        emailError.style.display = 'none';
    });
});