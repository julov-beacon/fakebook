// 添加通知函数
function addNotification(type, fromUser, toUser) {
    if (toUser === 'admin') return; // 管理员不接收通知
    
    // 获取所有用户
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    
    // 获取目标用户
    const targetUser = registeredUsers[toUser.toLowerCase()];
    if (!targetUser) return;
    
    // 初始化通知数组
    if (!targetUser.notices) targetUser.notices = [];
    
    // 获取发送通知用户的头像
    const fromUserData = registeredUsers[fromUser.toLowerCase()];
    const fromUserAvatar = fromUserData && fromUserData.avatar ? fromUserData.avatar : '../images/default_avatar.jpg';
    
    // 创建通知内容
    let notificationContent = '';
    let notificationTitle = '';
    
    switch(type) {
        case 'new_follower':
            notificationTitle = '新粉丝';
            notificationContent = `<strong>${fromUser}</strong> 关注了你`;
            break;
        case 'new_like':
            notificationTitle = '新点赞';
            notificationContent = `<strong>${fromUser}</strong> 点赞了你的文章`;
            break;
        case 'new_comment':
            notificationTitle = '新评论';
            notificationContent = `<strong>${fromUser}</strong> 评论了你的文章`;
            break;
        default:
            notificationTitle = '新通知';
            notificationContent = `来自 <strong>${fromUser}</strong> 的新通知`;
    }
    
    // 创建新通知
    const notification = {
        id: Date.now().toString(),
        type: type,
        from: fromUser,
        fromAvatar: fromUserAvatar,
        to: toUser,
        title: notificationTitle,
        content: notificationContent,
        date: new Date().toISOString(),
        isRead: false
    };
    
    // 添加到通知列表
    targetUser.notices.push(notification);
    
    // 保存回localStorage
    registeredUsers[toUser.toLowerCase()] = targetUser;
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    
    // 更新通知角标
    updateNotificationBadge();
}

// 更新通知角标
function updateNotificationBadge() {
    const badge = document.getElementById('notificationBadge');
    if (!badge) return;
    
    // 获取当前用户名
    const currentUsername = localStorage.getItem('currentUser');
    if (!currentUsername) return;

    // 获取用户数据
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    const currentUser = registeredUsers[currentUsername];
    
    if (!currentUser || !currentUser.notices) {
        badge.classList.add('hidden');
        return;
    }
    
    const unreadCount = currentUser.notices.filter(item => !item.isRead).length;
    
    if (unreadCount > 0) {
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}