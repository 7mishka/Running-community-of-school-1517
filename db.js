const GITHUB_USERNAME = '7mishka';
const REPO_NAME = 'Running-community-of-school-1517'; 
const BRANCH = 'main';
const FILE_PATH = 'Users.json';
const GITHUB_TOKEN = ''; 

const GITHUB_API = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${FILE_PATH}`;

class JSONDatabase {
    constructor() {
        this.users = [];
        this.isLocalMode = false;
        this.init();
    }

    async init() {
        try {
            await this.loadUsers();
        } catch (error) {
            console.warn('Не удалось загрузить данные с GitHub, используем локальное хранилище');
            this.isLocalMode = true;
            this.loadFromLocalStorage();
        }
    }

    async loadUsers() {
        try {
            const response = await fetch(`${GITHUB_API}?ref=${BRANCH}`);
            
            if (!response.ok) {
                throw new Error('Не удалось загрузить данные');
            }
            
            const data = await response.json();
            const content = atob(data.content); 
            const jsonData = JSON.parse(content);
            this.users = jsonData.users || [];
            
            localStorage.setItem('users_cache', JSON.stringify(this.users));
            localStorage.setItem('cache_timestamp', Date.now().toString());
            
            return this.users;
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            throw error;
        }
    }

    // Загрузка из LocalStorage
    loadFromLocalStorage() {
        const cached = localStorage.getItem('users_cache');
        if (cached) {
            this.users = JSON.parse(cached);
        } else {
            this.users = [];
        }
    }

    // Сохранение на GitHub
    async saveUsers() {
        if (this.isLocalMode) {
            this.saveToLocalStorage();
            return true;
        }

        try {
            // Сначала получаем текущий файл, чтобы узнать sha
            const currentFile = await fetch(`${GITHUB_API}?ref=${BRANCH}`);
            const fileData = await currentFile.json();
            const sha = fileData.sha;

            // Подготавливаем данные для сохранения
            const dataToSave = {
                users: this.users
            };
            
            const content = btoa(JSON.stringify(dataToSave, null, 2)); // Кодируем в base64
            const message = `Add new user - ${new Date().toISOString()}`;

            // Отправляем обновление на GitHub
            const response = await fetch(GITHUB_API, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': GITHUB_TOKEN ? `token ${GITHUB_TOKEN}` : ''
                },
                body: JSON.stringify({
                    message: message,
                    content: content,
                    sha: sha,
                    branch: BRANCH
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('GitHub API error:', errorData);
                
                // Если ошибка авторизации, переключаемся в локальный режим
                if (response.status === 401 || response.status === 403) {
                    console.warn('Нет доступа к GitHub API, сохраняем локально');
                    this.isLocalMode = true;
                    this.saveToLocalStorage();
                    return true;
                }
                throw new Error('Не удалось сохранить данные');
            }

            // Обновляем кэш
            localStorage.setItem('users_cache', JSON.stringify(this.users));
            localStorage.setItem('cache_timestamp', Date.now().toString());


            return true;
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            
            // При любой ошибке сохраняем локально
            this.isLocalMode = true;
            this.saveToLocalStorage();
            return true;
        }
    }

    // Локальное сохранение
    saveToLocalStorage() {
        localStorage.setItem('users_cache', JSON.stringify(this.users));
        localStorage.setItem('cache_timestamp', Date.now().toString());
        console.log('Данные сохранены локально');
    }

    // Добавление пользователя
    async addUser(userData) {
        // Проверяем, нет ли пользователя с таким email
        if (this.users.find(u => u.email === userData.email)) {
            throw new Error('Пользователь с таким email уже существует');
        }

        this.users.push(userData);
        return await this.saveUsers();
    }

    // Поиск пользователя по email
    findUserByEmail(email) {
        return this.users.find(user => user.email === email);
    }

    // Проверка логина
    validateLogin(email, password) {
        const user = this.findUserByEmail(email);
        if (!user) return null;
        if (user.password === password) return user;
        return null;
    }

    // Получение всех пользователей
    getAllUsers() {
        return this.users;
    }
}

// Создаем экземпляр базы данных
const database = new JSONDatabase();
