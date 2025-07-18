// 图片加载错误处理
function getImagePath(imagePath, characterName) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(imagePath);
        img.onerror = () => resolve(getPlaceholderImage(characterName));
        img.src = imagePath;
    });
}

// 生成占位符图片
function getPlaceholderImage(characterName) {
    const colors = [
        '#667eea', '#ff6b6b', '#ffd93d', '#6bcf7f', '#4a90e2',
        '#bd10e0', '#f5a623', '#9013fe', '#50e3c2', '#f8e71c',
        '#7ed321', '#d0021b', '#8b572a', '#417505', '#9b9b9b'
    ];
    const colorIndex = characterName.length % colors.length;
    const color = colors[colorIndex].replace('#', '');
    const encodedName = encodeURIComponent(characterName);
    
    return `https://via.placeholder.com/200x200/${color}/ffffff?text=${encodedName}`;
}

let currentQuote = null;
let favorites = JSON.parse(localStorage.getItem('demonSlayerFavorites')) || [];

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    updateDate();
    showDailyQuote();
    displayFavorites();
    
    // 绑定事件
    document.getElementById('newQuoteBtn').addEventListener('click', getRandomQuoteHandler);
    document.getElementById('favoriteBtn').addEventListener('click', toggleFavorite);
});

// 更新日期显示
function updateDate() {
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
    };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('zh-CN', options);
}

// 显示每日金句（基于日期的固定金句）
async function showDailyQuote() {
    currentQuote = getDailyQuote();
    await displayQuote(currentQuote);
}

// 获取随机金句处理器
async function getRandomQuoteHandler() {
    currentQuote = getRandomQuote();
    await displayQuote(currentQuote);
    addQuoteAnimation();
}

// 显示金句
async function displayQuote(quote) {
    const imagePath = await getImagePath(quote.image, quote.character);
    
    document.getElementById('characterImage').src = imagePath;
    document.getElementById('characterImage').alt = quote.character;
    document.getElementById('characterName').textContent = quote.character;
    document.getElementById('dailyQuote').textContent = quote.quote;
    
    // 更新收藏按钮状态
    updateFavoriteButton();
}

// 切换收藏状态
function toggleFavorite() {
    if (!currentQuote) return;
    
    const existingIndex = favorites.findIndex(fav => 
        fav.character === currentQuote.character && fav.quote === currentQuote.quote
    );
    
    if (existingIndex > -1) {
        // 取消收藏
        favorites.splice(existingIndex, 1);
    } else {
        // 添加收藏
        favorites.push({
            character: currentQuote.character,
            quote: currentQuote.quote,
            date: new Date().toLocaleDateString('zh-CN')
        });
    }
    
    // 保存到本地存储
    localStorage.setItem('demonSlayerFavorites', JSON.stringify(favorites));
    
    // 更新显示
    updateFavoriteButton();
    displayFavorites();
}

// 更新收藏按钮状态
function updateFavoriteButton() {
    const favoriteBtn = document.getElementById('favoriteBtn');
    const isFavorited = favorites.some(fav => 
        fav.character === currentQuote.character && fav.quote === currentQuote.quote
    );
    
    if (isFavorited) {
        favoriteBtn.textContent = '💖 已收藏';
        favoriteBtn.classList.add('active');
    } else {
        favoriteBtn.textContent = '❤️ 收藏';
        favoriteBtn.classList.remove('active');
    }
}

// 显示收藏列表
function displayFavorites() {
    const favoritesList = document.getElementById('favoritesList');
    
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<div class="empty-favorites">还没有收藏任何金句哦～</div>';
        return;
    }
    
    favoritesList.innerHTML = favorites.map(favorite => `
        <div class="favorite-item">
            <div class="character">${favorite.character}</div>
            <div class="quote">"${favorite.quote}"</div>
            <div style="font-size: 0.8rem; color: #999; margin-top: 5px;">收藏于: ${favorite.date}</div>
        </div>
    `).join('');
}

// 添加动画效果
function addQuoteAnimation() {
    const quoteCard = document.querySelector('.quote-card');
    const characterCard = document.querySelector('.character-card');
    
    // 添加切换动画
    quoteCard.style.transform = 'scale(0.95)';
    quoteCard.style.opacity = '0.7';
    characterCard.style.transform = 'scale(0.95)';
    characterCard.style.opacity = '0.7';
    
    setTimeout(() => {
        quoteCard.style.transform = 'scale(1)';
        quoteCard.style.opacity = '1';
        characterCard.style.transform = 'scale(1)';
        characterCard.style.opacity = '1';
    }, 200);
}