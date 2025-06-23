// 初始化主题
function initializeTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'day';
    updateThemeIcon(currentTheme);
}

// 切换主题
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'day';
    const newTheme = currentTheme === 'day' ? 'night' : 'day';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

// 更新主题图标
function updateThemeIcon(theme) {
    const themeToggle = document.querySelector('.theme-toggle i');
    if (themeToggle) {
        if (theme === 'night') {
            themeToggle.className = 'fas fa-moon';
        } else {
            themeToggle.className = 'fas fa-sun';
        }
    }
}

// 当页面加载完成后，初始化主题并绑定切换事件
document.addEventListener('DOMContentLoaded', function() {
    // 初始化主题
    initializeTheme();
    
    // 设置主题切换功能
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
});