// 加载文章函数
function loadArticles() {
    const articles = JSON.parse(localStorage.getItem('articles') || '[]');
    const blogContainer = document.getElementById('blogContainer');
    
    // 获取当前显示的用户名
    const viewUsername = localStorage.getItem('viewUser');
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    
    // 获取完整用户信息
    let viewUser;
    if (viewUsername === 'admin') {
        viewUser = {
            username: 'admin',
            isAdmin: true
        };
    } else {
        viewUser = registeredUsers[viewUsername] || {};
        if (!viewUser.username) {
            console.error('视图用户信息不存在');
            return;
        }
    }
    
    // 清空容器
    blogContainer.innerHTML = '';
    
    // 过滤viewUser的文章
    let userArticles = articles.filter(article => article.author === viewUser.username);
    
    // 根据当前排序方式排序文章
    const currentSort = window.currentSort || 'latest';
    
    if (currentSort === 'latest') {
        // 按最新排序（按日期降序）
        userArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (currentSort === 'hottest') {
        // 按最热排序（按热度降序）
        userArticles.sort((a, b) => {
            const getHeatScore = (article) => {
                const views = article.views || 0;
                const likes = article.likes || 0;
                const comments = article.comments ? article.comments.length : 0;
                return views + (likes + comments) * 5;
            };
            return getHeatScore(b) - getHeatScore(a);
        });
    }
    
    // 更新文章数量
    document.querySelector('.stat-item .count').textContent = userArticles.length;
    
    if (userArticles.length === 0) {
        blogContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-file-alt" style="font-size: 48px; color: #ddd; margin-bottom: 20px;"></i>
                <p style="color: #999; font-size: 18px;">还没有发布任何文章</p>
                <button class="btn" style="margin-top: 20px;" onclick="window.location.href='createArticle.html'">
                    <i class="fas fa-plus"></i> 创建第一篇文章
                </button>
            </div>
        `;
        return;
    }
    
    // 生成文章卡片
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    userArticles.forEach(article => {
        const blogCard = createBlogCard(article, users);
        blogContainer.appendChild(blogCard);
    });
}

// 加载所有文章函数
function loadAllArticles() {
    const articles = JSON.parse(localStorage.getItem('articles') || '[]');
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const blogContainer = document.getElementById('blogContainer');
    
    // 清空容器
    blogContainer.innerHTML = '';
    
    // 获取所有文章（不过滤特定用户）
    let allArticles = [...articles];
    
    // 应用搜索过滤
    if (globalSearchTerm) {
        allArticles = allArticles.filter(article => {
            const title = article.title.toLowerCase();
            const content = article.content.toLowerCase();
            const author = article.author.toLowerCase();
            const tags = article.tags ? article.tags.join(' ').toLowerCase() : '';
            
            return title.includes(globalSearchTerm) || 
                   content.includes(globalSearchTerm) || 
                   author.includes(globalSearchTerm) ||
                   tags.includes(globalSearchTerm);
        });
    }
    
    // 根据当前排序方式排序文章
    const currentSort = window.currentSort || 'latest';
    
    if (currentSort === 'latest') {
        // 按最新排序（按日期降序）
        allArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (currentSort === 'hottest') {
        // 按最热排序（按热度降序）
        allArticles.sort((a, b) => {
            const getHeatScore = (article) => {
                const views = article.views || 0;
                const likes = article.likes || 0;
                const comments = article.comments ? article.comments.length : 0;
                return views + (likes + comments) * 5;
            };
            return getHeatScore(b) - getHeatScore(a);
        });
    }
    
    if (allArticles.length === 0) {
        const noResultsMessage = globalSearchTerm ? 
            `没有找到包含"${globalSearchTerm}"的文章` : 
            '还没有任何文章';
            
        blogContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-search" style="font-size: 48px; color: #ddd; margin-bottom: 20px;"></i>
                <p style="color: #999; font-size: 18px;">${noResultsMessage}</p>
                ${!globalSearchTerm ? `
                    <button class="btn" style="margin-top: 20px;" onclick="window.location.href='createArticle.html'">
                        <i class="fas fa-plus"></i> 创建第一篇文章
                    </button>
                ` : ''}
            </div>
        `;
        return;
    }
    
    // 生成文章卡片
    allArticles.forEach(article => {
        const blogCard = createBlogCard(article, users);
        blogContainer.appendChild(blogCard);
    });
}

function loadFollowingArticles() {
    const articles = JSON.parse(localStorage.getItem('articles') || '[]');
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const blogContainer = document.getElementById('blogContainer');
    
    // 获取当前用户名和用户信息
    const currentUsername = localStorage.getItem('currentUser');
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    
    // 获取完整的用户信息
    let currentUser;
    if (currentUsername === 'admin') {
        currentUser = { 
            username: 'admin',
            isAdmin: true
        };
    } else {
        currentUser = registeredUsers[currentUsername] || {};
    }
    
    // 清空容器
    blogContainer.innerHTML = '';
    
    // 获取当前用户关注列表
    const followings = currentUser.following || [];
    if (!Array.isArray(followings) || followings.length === 0) {
        blogContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-user-friends" style="font-size: 48px; color: #ddd; margin-bottom: 20px;"></i>
                <p style="color: #999; font-size: 18px;">你还没有关注任何用户</p>
            </div>
        `;
        return;
    }
    
    // 只显示关注用户的文章
    let allArticles = articles.filter(article => followings.includes(article.author));
    
    // 应用搜索过滤
    if (globalSearchTerm) {
        allArticles = allArticles.filter(article => {
            const title = article.title.toLowerCase();
            const content = article.content.toLowerCase();
            const author = article.author.toLowerCase();
            const tags = article.tags ? article.tags.join(' ').toLowerCase() : '';
            return title.includes(globalSearchTerm) || 
                   content.includes(globalSearchTerm) || 
                   author.includes(globalSearchTerm) ||
                   tags.includes(globalSearchTerm);
        });
    }
    
    // 根据当前排序方式排序文章
    const currentSort = window.currentSort || 'latest';
    if (currentSort === 'latest') {
        allArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (currentSort === 'hottest') {
        allArticles.sort((a, b) => {
            const getHeatScore = (article) => {
                const views = article.views || 0;
                const likes = article.likes || 0;
                const comments = article.comments ? article.comments.length : 0;
                return views + (likes + comments) * 5;
            };
            return getHeatScore(b) - getHeatScore(a);
        });
    }
    
    if (allArticles.length === 0) {
        const noResultsMessage = globalSearchTerm ? 
            `没有找到包含"${globalSearchTerm}"的关注用户文章` : 
            '你关注的用户还没有发布任何文章';
        blogContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-search" style="font-size: 48px; color: #ddd; margin-bottom: 20px;"></i>
                <p style="color: #999; font-size: 18px;">${noResultsMessage}</p>
            </div>
        `;
        return;
    }
    
    // 生成文章卡片
    allArticles.forEach(article => {
        const blogCard = createBlogCard(article, users);
        blogContainer.appendChild(blogCard);
    });
}

// 加载收藏的文章
function loadFavoriteArticles() {
    const currentUsername = localStorage.getItem('currentUser');
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    
    // 获取当前用户
    let currentUser;
    if (currentUsername === 'admin') {
        currentUser = { 
            username: 'admin',
            isAdmin: true,
            favorites: []
        };
    } else {
        currentUser = registeredUsers[currentUsername] || {};
        // 确保有favorites属性
        if (!currentUser.favorites) {
            currentUser.favorites = [];
        }
    }
    
    // 获取所有文章
    const allArticles = JSON.parse(localStorage.getItem('articles') || '[]');
    
    // 筛选用户收藏的文章
    const favoriteArticles = allArticles.filter(article => 
        currentUser.favorites && currentUser.favorites.includes(article.id)
    );
    
    // 根据当前排序和搜索条件过滤文章
    let filteredArticles = favoriteArticles;
    
    // 应用搜索过滤
    if (globalSearchTerm) {
        filteredArticles = filteredArticles.filter(article => {
            return (
                article.title.toLowerCase().includes(globalSearchTerm) || 
                article.content.toLowerCase().includes(globalSearchTerm) || 
                article.author.toLowerCase().includes(globalSearchTerm) ||
                (article.tags && article.tags.some(tag => tag.toLowerCase().includes(globalSearchTerm)))
            );
        });
    }
    
    // 应用排序
    filteredArticles.sort((a, b) => {
        if (globalCurrentSort === 'latest') {
            return new Date(b.date) - new Date(a.date);
        } else if (globalCurrentSort === 'hottest') {
            const bPopularity = (b.likes || 0) * 2 + (b.views || 0) / 2;
            const aPopularity = (a.likes || 0) * 2 + (a.views || 0) / 2;
            return bPopularity - aPopularity;
        }
        return 0;
    });
    
    const blogContainer = document.getElementById('blogContainer');
    const noFavoritesMessage = document.getElementById('noFavoritesMessage');
    
    if (filteredArticles.length === 0) {
        blogContainer.innerHTML = '';
        noFavoritesMessage.style.display = 'flex';
        return;
    }
    
    noFavoritesMessage.style.display = 'none';
    blogContainer.innerHTML = '';
    
    // 获取所有用户信息用于显示作者头像
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    
    filteredArticles.forEach(article => {
        const blogCard = createBlogCard(article, users);
        blogContainer.appendChild(blogCard);
    });
}

function createBlogCard(article, users) {
    const card = document.createElement('div');
    card.className = 'blog-card';
    
    // 格式化日期
    const date = new Date(article.date);
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    // 生成摘要（取前100个字符）
    const excerpt = article.content.substring(0, 100) + (article.content.length > 100 ? '...' : '');
    
    // 选择图标
    const icons = ['fa-code', 'fa-laptop-code', 'fa-mobile-alt', 'fa-database', 'fa-server'];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    
    // 获取作者头像
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    const author = registeredUsers[article.author.toLowerCase()] || {};
    const authorAvatar = author.avatar || '../images/default_avatar.jpg';
    
    // 计算评论数量 - 从文章对象的comments数组中统计
    const commentCount = article.comments ? article.comments.length : 0;
    
    card.innerHTML = `
        <div class="blog-img" ${article.coverImage ? `style="background-image: url('${article.coverImage}'); background-size: cover; background-position: center;"` : ''}>
            ${!article.coverImage ? `<i class="fas ${randomIcon}"></i>` : ''}
        </div>
        <div class="blog-content">
            <div class="blog-meta" style="display: flex; align-items: center;">
                <div class="author-avatar" style="width: 28px; height: 28px; border-radius: 50%; overflow: hidden; margin-right: 10px;">
                    <img src="${authorAvatar}" alt="${article.author}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <span style="font-weight: 500; margin-right: 10px; cursor: pointer;" onclick="viewUserProfile('${article.author}')">${article.author}</span>
                <span><i class="far fa-calendar"></i> ${formattedDate}</span>
            </div>
            <h3 class="blog-title">${article.title}</h3>
            <p class="blog-excerpt">${excerpt}</p>
            ${article.tags && article.tags.length > 0 ? `
                <div style="margin-bottom: 15px;">
                    ${article.tags.map(tag => `<span style="display: inline-block; background: #e3f2fd; color: #1976d2; padding: 4px 12px; border-radius: 15px; font-size: 12px; margin-right: 8px;">${tag}</span>`).join('')}
                </div>
            ` : ''}
            <div class="blog-footer">
                <a href="#" class="read-more" onclick="viewArticle('${article.id}'); return false;">
                    阅读全文 <i class="fas fa-arrow-right"></i>
                </a>
                <div class="blog-actions">
                    <div class="action-btn">
                        <i class="far fa-eye"></i>
                        <span style="margin-left: 8px;">${article.views || 0}</span>
                    </div>
                    <div class="action-btn">
                        <i class="${article.likes > 0 ? 'fas' : 'far'} fa-heart"></i>
                        <span style="margin-left: 8px;">${article.likes || 0}</span>
                    </div>
                    <div class="action-btn">
                        <i class="far fa-comment"></i>
                        <span style="margin-left: 8px;">${commentCount}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// 查看文章详情
function viewArticle(articleId) {
    const articles = JSON.parse(localStorage.getItem('articles') || '[]');
    // 找到对应的文章
    const article = articles.find(a => a.id === articleId);
    if (article) {
        // 增加阅读数
        article.views = (article.views || 0) + 1;
        // 更新localStorage中的文章数据
        const updatedArticles = articles.map(a => a.id === articleId ? article : a);
        localStorage.setItem('articles', JSON.stringify(updatedArticles));
        // 只存储文章ID而不是整个文章对象
        localStorage.setItem('currentArticle', articleId);
        // 设置viewUser为currentUser
        localStorage.setItem('viewUser', localStorage.getItem('currentUser'));
        // 跳转到文章详情页
        window.location.href = 'viewArticle.html';
    } else {
        alert('文章不存在');
    }
}