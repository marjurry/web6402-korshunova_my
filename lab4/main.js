/**
 * Класс для хранения и обработки данных пользователя
 */
class User {
    /**
     * Конструктор класса User
     * @param {string} login - Логин пользователя
     * @param {string} password - Пароль
     * @param {string} userType - Тип пользователя
     * @param {boolean} remember - Запомнить пользователя
     * @param {boolean} agreement - Согласие на обработку данных
     */
    constructor(login, password, userType, remember, agreement) {
        this.login = login;
        this.password = this.maskPassword(password);
        this.userType = userType;
        this.remember = remember;
        this.agreement = agreement;
        this.loginTime = new Date().toLocaleString('ru-RU');
        this.sessionId = this.generateSessionId();
    }

    /**
     * Маскирует пароль для безопасности
     * @param {string} password - Исходный пароль
     * @returns {string} - Замаскированный пароль
     */
    maskPassword(password) {
        return '*'.repeat(password.length);
    }

    /**
     * Генерирует уникальный ID сессии
     * @returns {string} - Уникальный ID
     */
    generateSessionId() {
        return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
    }

    /**
     * Метод форматированного вывода данных пользователя на консоль
     */
    printToConsole() {
        console.log('=== ДАННЫЕ ПОЛЬЗОВАТЕЛЯ ===');
        console.log(`Логин: ${this.login}`);
        console.log(`Пароль: ${this.password}`);
        console.log(`Тип пользователя: ${this.getUserTypeText()}`);
        console.log(`Запомнить: ${this.remember ? 'Да' : 'Нет'}`);
        console.log(`Согласие на обработку: ${this.agreement ? 'Да' : 'Нет'}`);
        console.log(`Время входа: ${this.loginTime}`);
        console.log(`ID сессии: ${this.sessionId}`);
        console.log('============================');
    }

    /**
     * Возвращает текстовое представление типа пользователя
     * @returns {string}
     */
    getUserTypeText() {
        const types = {
            'student': 'Студент',
            'teacher': 'Преподаватель',
            'staff': 'Сотрудник'
        };
        return types[this.userType] || this.userType;
    }

    /**
     * Возвращает объект с данными для отображения
     * @returns {object}
     */
    getUserData() {
        return {
            login: this.login,
            password: this.password,
            userType: this.getUserTypeText(),
            remember: this.remember ? 'Да' : 'Нет',
            agreement: this.agreement ? 'Да' : 'Нет',
            loginTime: this.loginTime,
            sessionId: this.sessionId
        };
    }

    /**
     * Возвращает отформатированную строку с данными пользователя
     * @returns {string}
     */
    toString() {
        const data = this.getUserData();
        return JSON.stringify(data, null, 2);
    }
}

/**
 * Основной скрипт для работы сайта
 */

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeDate();
    initializeAuthForm();
    initializeNavigation();
});

/**
 * Инициализация текущей даты
 */
function initializeDate() {
    const dateElement = document.getElementById('current-date');
    const weekElement = document.getElementById('current-week');
    
    if (dateElement) {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'numeric', 
            day: 'numeric' 
        };
        dateElement.textContent = now.toLocaleDateString('ru-RU', options);
    }
    
    if (weekElement) {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay() + 1);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        const formatDate = (date) => date.toLocaleDateString('ru-RU');
        weekElement.textContent = `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
    }
}

/**
 * Инициализация формы авторизации
 */
function initializeAuthForm() {
    const authForm = document.getElementById('authForm');
    
    if (authForm) {
        authForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleAuthFormSubmit(this);
        });
        
        // Добавляем валидацию в реальном времени
        const inputs = authForm.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    }
}

/**
 * Обработка отправки формы авторизации
 * @param {HTMLFormElement} form - Форма авторизации
 */
function handleAuthFormSubmit(form) {
    if (!validateForm(form)) {
        showNotification('Пожалуйста, исправьте ошибки в форме', 'error');
        return;
    }
    
    const formData = new FormData(form);
    const userData = {
        login: formData.get('login'),
        password: formData.get('password'),
        userType: formData.get('userType'),
        remember: formData.get('remember') === 'on',
        agreement: formData.get('agreement') === 'on'
    };
    
    // Создаем объект пользователя
    const user = new User(
        userData.login,
        userData.password,
        userData.userType,
        userData.remember,
        userData.agreement
    );
    
    // Выводим данные в консоль
    user.printToConsole();
    
    // Показываем данные на странице
    displayUserData(user);
    
    // Показываем уведомление
    showNotification('Вход выполнен успешно! Данные выведены в консоль.', 'success');
    
    // Симуляция перенаправления (в реальном проекте здесь был бы AJAX запрос)
    setTimeout(() => {
        // window.location.href = 'index.html';
    }, 2000);
}

/**
 * Валидация формы
 * @param {HTMLFormElement} form - Форма для валидации
 * @returns {boolean} - Результат валидации
 */
function validateForm(form) {
    let isValid = true;
    const fields = form.querySelectorAll('input[required], select[required]');
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Валидация отдельного поля
 * @param {HTMLElement} field - Поле для валидации
 * @returns {boolean} - Результат валидации
 */
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Очищаем предыдущие сообщения об ошибках
    clearFieldError(field);
    
    // Проверка обязательных полей
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Это поле обязательно для заполнения';
    }
    
    // Дополнительные проверки для конкретных полей
    if (field.id === 'login' && value && !/^[0-9-]+$/.test(value)) {
        isValid = false;
        errorMessage = 'Логин должен содержать только цифры и дефисы';
    }
    
    if (field.id === 'password' && value && value.length < 6) {
        isValid = false;
        errorMessage = 'Пароль должен содержать минимум 6 символов';
    }
    
    if (field.id === 'userType' && !value) {
        isValid = false;
        errorMessage = 'Выберите тип пользователя';
    }
    
    if (field.type === 'checkbox' && field.required && !field.checked) {
        isValid = false;
        errorMessage = 'Это соглашение обязательно';
    }
    
    // Показываем сообщение об ошибке
    if (!isValid && errorMessage) {
        showFieldError(field, errorMessage);
    } else {
        markFieldAsValid(field);
    }
    
    return isValid;
}

/**
 * Показывает ошибку для поля
 * @param {HTMLElement} field - Поле
 * @param {string} message - Сообщение об ошибке
 */
function showFieldError(field, message) {
    field.style.borderColor = 'var(--accent-color)';
    
    let errorElement = field.parentNode.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.style.color = 'var(--accent-color)';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.marginTop = '0.25rem';
}

/**
 * Очищает ошибку поля
 * @param {HTMLElement} field - Поле
 */
function clearFieldError(field) {
    field.style.borderColor = '';
    
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

/**
 * Помечает поле как валидное
 * @param {HTMLElement} field - Поле
 */
function markFieldAsValid(field) {
    field.style.borderColor = 'var(--success-color)';
}

/**
 * Отображает данные пользователя на странице
 * @param {User} user - Объект пользователя
 */
function displayUserData(user) {
    const container = document.getElementById('userData');
    const output = document.getElementById('userDataOutput');
    
    if (container && output) {
        output.textContent = user.toString();
        container.style.display = 'block';
        
        // Плавная прокрутка к данным
        container.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/**
 * Показывает уведомление
 * @param {string} message - Текст сообщения
 * @param {string} type - Тип сообщения (success, error, warning)
 */
function showNotification(message, type = 'info') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Стили для уведомления
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '6px',
        color: 'white',
        fontWeight: 'bold',
        zIndex: '1000',
        maxWidth: '300px',
        boxShadow: 'var(--shadow-hover)',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease'
    });
    
    // Цвета в зависимости от типа
    const colors = {
        success: 'var(--success-color)',
        error: 'var(--accent-color)',
        warning: 'var(--warning-color)',
        info: 'var(--secondary-color)'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Добавляем на страницу
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Автоматическое скрытие
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

/**
 * Инициализация навигации
 */
function initializeNavigation() {
    // Добавляем активный класс к текущей странице
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Вспомогательная функция для анимаций
 */
function animateOnScroll() {
    const elements = document.querySelectorAll('.animated-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Инициализация анимаций при загрузке
window.addEventListener('load', animateOnScroll);