// 通知类型文本映射
const notificationTypeMap = {
    post_published: '关注',
    comment_on_post: '评论',
    like_on_post: '点赞',
    new_follower: '粉丝'
};

// 统一添加通知的函数
function addNotification(type, fromUser, targetUser, articleId) {
    // 获取用户数据
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    const user = registeredUsers[targetUser];
    
    if (!user) return;
    
    // 初始化notices数组（如果不存在）
    if (!user.notices) {
        user.notices = [];
    }
    
    // 获取发送通知用户的头像
    const fromUserData = registeredUsers[fromUser.toLowerCase()];
    const fromUserAvatar = fromUserData && fromUserData.avatar ? fromUserData.avatar : '../images/default_avatar.jpg';
    
    // 根据通知类型生成标题和内容
    let content = '';
    let title = '';
    
    switch(type) {
        case 'post_published':
            title = '关注动态';
            content = `<strong>${fromUser}</strong> 发布了新文章，快去看看吧`;
            break;
        case 'comment_on_post':
            title = '新评论';
            content = `<strong>${fromUser}</strong> 评论了你的文章`;
            break;
        case 'like_on_post':
            title = '新点赞';
            content = `<strong>${fromUser}</strong> 点赞了你的文章`;
            break;
        case 'new_follower':
            title = '新粉丝';
            content = `<strong>${fromUser}</strong> 关注了你`;
            break;
        default:
            title = '新通知';
            content = `来自 <strong>${fromUser}</strong> 的新通知`;
    }
    
    const newNotification = {
        id: Date.now() + '_' + Math.floor(Math.random()*10000),
        type: type,
        from: fromUser,
        fromAvatar: fromUserAvatar,
        to: targetUser,
        title: title,
        content: content,
        articleId: articleId || '',
        date: new Date().toISOString(),
        time: new Date().toLocaleString(),
        isRead: false
    };
    
    // 将新通知添加到通知列表的最前面
    user.notices.unshift(newNotification);
    
    // 保存回localStorage
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
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