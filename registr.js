document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registrationForm');
    const registerButton = document.getElementById('registerButton')
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby1uNfoh_K_zl-8BpJQ6mXcx7tknFbqtiys5wdDcnO36PFavSS7xD04QOdB1uStU_i_/exec'
    const CONFIG = {
        SHEET_ID: '1FIHHF7z2DmoGozJVGK4zolO4Og0eTkMQiR4nOEKuTwI',
        API_KEY: 'AQ.Ab8RN6Ip_f0vr-dvuSJ4i2BJY3F1OkP6bkTeQ0GMkujlBALHVQ',
        SHEET_NAME: 'Sheet1'
    }
    registrationForm.addEventListener('submit', async function(e) {
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


        try {
                const response = await fetch(SCRIPT_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showMessage(` ! Ваш ID: ${result.id}`, 'success');
                    
                    document.getElementById('registrationForm').reset();
                    
                } else {
                    throw new Error(result.error || 'Ошибка сервера');
                }
                
            } catch (error) {
                console.error('Ошибка:', error);
                showMessage(`Ошибка: ${error.message}`, 'error');
            }



    });
    
     function showMessage(text, type) {
            const messageEl = document.getElementById('message');
            messageEl.textContent = text;
            messageEl.className = `message ${type}`;
            messageEl.style.display = 'block';
            
            if (type !== 'success') {
                setTimeout(() => {
                    messageEl.style.display = 'none';
                }, 5000);
            }
        }



    async function saveToGoogleSheets(data) {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SHEET_ID}/values/${CONFIG.SHEET_NAME}!A:I:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS&key=${CONFIG.API_KEY}`;
        
        const values = [
            [
                data.id,
                data.name,
                data.email,
                data.grade,
                data.schoolBuilding,
                data.age,
                data.gender,
                data.password,
                data.timestamp,
            ]
        ];

        const requestBody = {
            values: values
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Ошибка записи в таблицу');
        }

        return true;
    }

});
