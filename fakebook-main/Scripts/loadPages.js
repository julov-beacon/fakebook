function loadPages() {
    // 获取当前用户名
    const currentUsername = localStorage.getItem('currentUser');
    
    if (!currentUsername) {
        console.error('用户未登录，无法设置页面跳转');
        return;
    }

    // 为探索按钮添加跳转功能
    const explorationBtn = document.getElementById('explorationBtn');
    if (explorationBtn) {
        explorationBtn.addEventListener('click', function() {
            localStorage.setItem('viewUser', currentUsername);
            window.location.href = 'exploration.html';
        });
    }

    // 为关注按钮添加跳转功能
    const followingBtn = document.getElementById('followingBtn');
    if (followingBtn) {
        followingBtn.addEventListener('click', function() {
            localStorage.setItem('viewUser', currentUsername);
            window.location.href = 'following.html';
        });
    }

    // 为私信按钮添加跳转功能
    const messageBtn = document.getElementById('messageBtn');
    if (messageBtn) {
        messageBtn.addEventListener('click', function() {
            localStorage.setItem('viewUser', currentUsername);
            window.location.href = 'message.html';
        });
    }

    // 为通知按钮添加跳转功能
    const notificationBtn = document.getElementById('notificationBtn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            localStorage.setItem('viewUser', currentUsername);
            window.location.href = 'notification.html';
        });
    }

    // 为收藏按钮添加跳转功能
    const favoritesBtn = document.getElementById('favoritesBtn');
    if (favoritesBtn) {
        favoritesBtn.addEventListener('click', function() {
            localStorage.setItem('viewUser', currentUsername);
            window.location.href = 'favorites.html';
        });
    }

    // 为编辑资料按钮添加跳转功能
    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            localStorage.setItem('viewUser', currentUsername);
            window.location.href = 'editUserInfo.html';
        });
    }
    
    // 退出登录功能
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('viewUser');
            window.location.href = '../UserModule/login.html';
        });
    }

    // 为新建文章按钮添加跳转功能
    const createArticleBtn = document.getElementById('createArticleBtn');
    if (createArticleBtn) {
        createArticleBtn.addEventListener('click', function() {
            localStorage.setItem('viewUser', currentUsername);
            window.location.href = 'createArticle.html';
        });
    }
    
    // 为主页按钮添加跳转功能
    const homeBtn = document.getElementById('homeBtn');
    if (homeBtn) {
        homeBtn.addEventListener('click', function() {
            goHome();
        });
    }
}

function goHome() {
    const currentUsername = localStorage.getItem('currentUser');
    localStorage.setItem('viewUser', currentUsername);
    window.location.href = 'homepage.html?refresh=' + new Date().getTime();
}