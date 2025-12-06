document.addEventListener('DOMContentLoaded', () => {
    const user = sessionStorage.getItem('currentUser');
    const welcome = document.getElementById('userWelcome');
    const welcomeText = document.getElementById('welcomeText');
    const logoutBtn = document.getElementById('logoutBtn');
    const signIn = document.getElementById('sign_in');
    const signUp = document.getElementById('sign_up');
    
    if (user) {
        const userData = JSON.parse(user);
        welcomeText.textContent = `Привет, ${userData.name}!`;
        welcome.style.display = 'block';
        signIn.style.display = 'none';
        signUp.style.display = 'none';
    } else {
        welcome.style.display = 'none';
        signIn.style.display = 'inline-block';
        signUp.style.display = 'inline-block';
    }
    
    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('currentUser');
        window.location.reload();
    });
    
    signUp.addEventListener('click', () => window.location.href = 'registr.html');
    signIn.addEventListener('click', () => window.location.href = 'login.html');
});

document.addEventListener('DOMContentLoaded', () => {
    const months = ['Января','Февраля','Марта','Апреля','Мая','Июня',
                   'Июля','Августа','Сентября','Октября','Ноября','Декабря'];
    const weekDays = ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота']; 
    const schedule = {
        0: ['Sunday','Sunday1'], 1: ['Monday','Monday1'],
        2: ['Tuesday'], 3: ['Wednesday'],
        4: ['Thursday'], 5: ['Friday'], 6: ['Saturday']
    };
    
    let currentDate = new Date();
    const today = new Date();
    const monthYear = document.getElementById('currentMonthYear');
    const calendarDays = document.getElementById('calendarDays');
    
    function render() {
        calendarDays.innerHTML = '';
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        monthYear.textContent = `${months[month]} ${year}`;
        
        const firstDay = new Date(year, month, 1).getDay();
        const start = firstDay === 0 ? 6 : firstDay - 1;
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        
        for (let i = start; i > 0; i--) {
            const day = document.createElement('div');
            day.className = 'calendar-day inactive';
            day.textContent = daysInPrevMonth - i + 1;
            calendarDays.appendChild(day);
        }
        
        for (let d = 1; d <= daysInMonth; d++) {
            const day = document.createElement('div');
            day.className = 'calendar-day';
            day.textContent = d;
            
            if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                day.classList.add('today');
            }
            
            day.onclick = () => {
                const dayOfWeek = new Date(year, month, d).getDay();
                filter(dayOfWeek);
                alert(`${d} ${months[month]} ${year}, ${weekDays[dayOfWeek]}`);
            };
            
            calendarDays.appendChild(day);
        }
        
        const total = start + daysInMonth;
        const remainingDays = total % 7 === 0 ? 0 : 7 - (total % 7);
        
        for (let i = 1; i <= remainingDays; i++) {
            const day = document.createElement('div');
            day.className = 'calendar-day inactive';
            day.textContent = i;
            calendarDays.appendChild(day);
        }
    }
    
    function filter(dayOfWeek) {
        document.querySelectorAll('.joining-button').forEach(btn => {
            btn.style.display = (schedule[dayOfWeek] || []).includes(btn.id) ? 'inline-block' : 'none';
        });
    }
    
    function showAll() {
        document.querySelectorAll('.joining-button').forEach(btn => btn.style.display = 'inline-block');
    }
    
    document.getElementById('prevMonthBtn').onclick = () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        render();
        showAll();
    };
    
    document.getElementById('nextMonthBtn').onclick = () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        render();
        showAll();
    };
    
    const showAllBtn = document.createElement('button');
    showAllBtn.textContent = 'Все тренировки';
    showAllBtn.style.cssText = 'display:block;margin:10px auto;padding:10px;background:#4CAF50;color:white;border:none;border-radius:5px;';
    showAllBtn.onclick = showAll;
    document.getElementById('calendar-container').appendChild(showAllBtn);
    
    render();
});

document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('trainingRegistrations')) {
        localStorage.setItem('trainingRegistrations', JSON.stringify({}));
    }
    
    const regs = JSON.parse(localStorage.getItem('trainingRegistrations') || '{}');
    Object.keys(regs).forEach(id => updateDisplay(id, regs[id]));
    
    document.querySelectorAll('.joining-button').forEach(btn => {
        btn.onclick = function() {
            const id = this.id;
            const user = JSON.parse(sessionStorage.getItem('currentUser') || 'null');
            
            if (!user) {
                alert('Войдите в систему');
                window.location.href = 'login.html';
                return;
            }
            
            const regs = JSON.parse(localStorage.getItem('trainingRegistrations') || '{}');
            regs[id]?.some(u => u.id === user.id) ? cancel(id) : register(id);
        };
    });
});

function register(id) {
    const user = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!user) return;
    
    const regs = JSON.parse(localStorage.getItem('trainingRegistrations') || '{}');
    if (!regs[id]) regs[id] = [];
    
    if (regs[id].some(u => u.id === user.id)) {
        alert('Уже записаны');
        return;
    }
    
    regs[id].push({id: user.id, name: user.name, email: user.email});
    localStorage.setItem('trainingRegistrations', JSON.stringify(regs));
    updateDisplay(id, regs[id]);
    alert('Записались');
}

function cancel(id) {
    const user = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!user) return;
    
    const regs = JSON.parse(localStorage.getItem('trainingRegistrations') || '{}');
    if (regs[id]) {
        regs[id] = regs[id].filter(u => u.id !== user.id);
        localStorage.setItem('trainingRegistrations', JSON.stringify(regs));
        updateDisplay(id, regs[id]);
        alert('Отменили');
    }
}

function updateDisplay(id, users) {
    const btn = document.getElementById(id);
    if (!btn) return;
    
    const user = JSON.parse(sessionStorage.getItem('currentUser') || 'null');
    const isReg = user && users?.some(u => u.id === user.id);
    
    btn.innerHTML = isReg ? '<h3>Отменить</h3>' : '<h3>Записаться</h3>';
    btn.classList.toggle('registered', isReg);
    
    let info = btn.parentNode.querySelector('.registration-info');
    if (!info) {
        info = document.createElement('div');
        info.className = 'registration-info';
        btn.parentNode.appendChild(info);
    }
    
    if (users?.length) {
        const names = users.map(u => user && u.id === user.id ? `<strong>${u.name} (вы)</strong>` : u.name).join(', ');
        info.innerHTML = `<div>Записалось: ${users.length}</div><div>${names}</div>`;
    } else {
        info.innerHTML = '<div> </div>';
    }
}