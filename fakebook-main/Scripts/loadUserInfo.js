function createUserObject(studentId, username, password) {
    return {
        studentId: studentId,
        username: username,
        password: password,
        registrationDate: new Date().toISOString(),
        avatar: "../images/default_avatar.jpg",                  // 默认空头像（可用默认URL）
        bio: "",                     // 默认空简介
        following: [],               // 空关注列表（存储用户名）
        followers: [],                // 空粉丝列表（存储用户名）
        notices: [],                  // 空通知列表（结构：[{time: 时间字符串, content: 通知内容}]）
        favorites: []                // 收藏列表（存储字符串数组）
    };
}

function loadUserInfo() {
    const currentUsername = localStorage.getItem('currentUser');
    const viewUsername = localStorage.getItem('viewUser');

    if (!currentUsername) {
        alert('请先登录系统');
        window.location.href = '../UserModule/login.html';
        return;
    }

    // 获取用户完整信息
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');

    // 处理currentUser
    let currentUser;
    if (currentUsername === 'admin') {
        currentUser = { 
            username: 'admin',
            isAdmin: true
        };
    } else {
        currentUser = registeredUsers[currentUsername] || {};
        if (!currentUser.username) {
            alert('当前用户信息不存在');
            window.location.href = '../UserModule/login.html';
            return;
        }
    }

    // 处理viewUser
    let viewUser;
    if (viewUsername === 'admin') {
        viewUser = { 
            username: 'admin',
            isAdmin: true
        };
    } else {
        viewUser = viewUsername ? registeredUsers[viewUsername] || {} : currentUser;
        if (!viewUser.username && viewUsername) {
            // 如果指定了viewUser但找不到对应信息，默认使用currentUser
            viewUser = currentUser;
            localStorage.setItem('viewUser', currentUsername);
        }
    }

    // 设置导航栏用户信息（使用currentUser）
    const navUsername = document.querySelector('.nav-username');
    const navUserId = document.querySelector('.nav-user-id');
    const navAvatar = document.querySelector('.nav-avatar');

    if (navUsername) {
        navUsername.textContent = currentUser.username;
    }
    if (navUserId) {
        navUserId.textContent = `@${currentUser.username.toLowerCase()}`;
    }

    // 设置导航栏头像（使用currentUser）
    if (navAvatar && currentUser.avatar) {
        navAvatar.innerHTML = '';
        const avatarImg = document.createElement('img');
        avatarImg.src = currentUser.avatar;
        avatarImg.alt = currentUser.username;
        navAvatar.appendChild(avatarImg);
    } else if (navAvatar) {
        // 如果没有头像，显示默认图标
        navAvatar.innerHTML = '<i class="fas fa-user"></i>';
    }

    // 设置右侧侧边栏用户信息（使用viewUser）
    const profileH2 = document.querySelector('.user-profile h2');
    const userIdElement = document.querySelector('.user-id');
    
    if (profileH2) {
        profileH2.textContent = viewUser.username;
    }
    
    if (userIdElement) {
        userIdElement.innerHTML = `@${viewUser.username.toLowerCase()} · ID: ${viewUser.studentId || '2023001'}`;
    }

    // 显示用户简介（使用viewUser）
    const bioElement = document.querySelector('.user-profile .user-bio');
    if (bioElement) {
        bioElement.textContent = viewUser.bio || '这个人很懒，什么也没留下。';
    }

    // 显示用户头像（使用viewUser）
    if (viewUser.avatar) {
        const avatarDiv = document.querySelector('.avatar');
        if (avatarDiv) {
            avatarDiv.innerHTML = '';
            const avatarImg = document.createElement('img');
            avatarImg.src = viewUser.avatar;
            avatarImg.alt = viewUser.username;
            avatarImg.style.width = '100%';
            avatarImg.style.height = '100%';
            avatarImg.style.borderRadius = '50%';
            avatarImg.style.objectFit = 'cover';
            avatarDiv.appendChild(avatarImg);
        }
    }

    // 显示文章数量（使用viewUser的文章）
    const articles = JSON.parse(localStorage.getItem('articles') || '[]');
    const userArticles = articles.filter(article => article.author === viewUser.username);
    const statItems = document.querySelectorAll('.stat-item .count');
    
    if (statItems && statItems.length > 0) {
        statItems[0].textContent = userArticles.length;
    }

    // 显示粉丝数（使用viewUser的粉丝）
    const followersCount = viewUser.followers ? viewUser.followers.length : 0;
    if (statItems && statItems.length > 1) {
        statItems[1].textContent = followersCount;
    }

    // 处理关注按钮逻辑
    const followBtnContainer = document.getElementById('followBtnContainer');
    const followBtn = document.getElementById('followBtn');

    // 只有当viewUser和currentUser不同时才显示关注按钮
    if (viewUser.username !== currentUser.username && followBtnContainer) {
        followBtnContainer.style.display = 'block';
        
        // 检查当前用户是否已关注该用户
        const isFollowing = checkIfFollowing(currentUser, viewUser);
        updateFollowButtonState(followBtn, isFollowing);
        
        // 为关注按钮添加点击事件
        followBtn.addEventListener('click', function() {
            // 获取最新的用户数据
            const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
            const currentUsername = localStorage.getItem('currentUser');
            const viewUsername = localStorage.getItem('viewUser');
            
            let updatedCurrentUser = currentUsername === 'admin' ? 
                { username: 'admin', isAdmin: true } : registeredUsers[currentUsername];
            
            let updatedViewUser = viewUsername === 'admin' ? 
                { username: 'admin', isAdmin: true } : registeredUsers[viewUsername];
            
            toggleFollowStatus(updatedCurrentUser, updatedViewUser);
        });
    }
}

function loadCurrentUser() {
    const currentUsername = localStorage.getItem('currentUser');
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    
    if (currentUsername === 'admin') {
        window.currentUser = { 
            username: 'admin',
            isAdmin: true
        };
    } else {
        window.currentUser = registeredUsers[currentUsername] || {};
    }
    
    return window.currentUser;
}