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
    // 为不同角色定制颜色主题
    const characterColors = {
        '竈门炭治郎': '#2d5a87', // 深蓝色 - 水之呼吸
        '竈门祢豆子': '#ff69b4', // 粉红色 - 可爱
        '我妻善逸': '#ffd700', // 金黄色 - 雷之呼吸
        '嘴平伊之助': '#8b4513', // 棕色 - 野性
        '富冈义勇': '#4682b4', // 钢蓝色 - 水柱
        '胡蝶忍': '#9370db', // 紫色 - 虫柱
        '炼狱杏寿郎': '#ff4500', // 橙红色 - 炎柱
        '宇髄天元': '#ff1493', // 深粉色 - 华丽
        '时透无一郎': '#b0c4de', // 浅钢蓝 - 霞柱
        '甘露寺蜜璃': '#ff69b4', // 热粉色 - 恋柱
        '伊黑小芭内': '#2f4f2f', // 深绿色 - 蛇柱
        '不死川实弥': '#696969', // 暗灰色 - 风柱
        '悲鸣屿行冥': '#8b4513', // 棕色 - 岩柱
        '产屋敷耀哉': '#dda0dd', // 淡紫色 - 优雅
        '鳞滝左近次': '#4682b4', // 钢蓝色 - 前水柱
        '鬼舞辻无惨': '#8b0000', // 暗红色 - 邪恶
        '上弦之壹・黑死牟': '#2f2f2f', // 深灰色
        '上弦之贰・童磨': '#e6e6fa', // 淡紫色
        '上弦之参・猗窩座': '#ff6347', // 番茄红
        '珠世': '#dda0dd', // 淡紫色
        '愈史郎': '#90ee90'  // 浅绿色
    };
    
    // 获取角色专属颜色，如果没有则使用默认颜色
    let color = characterColors[characterName];
    if (!color) {
        const defaultColors = [
            '#667eea', '#ff6b6b', '#ffd93d', '#6bcf7f', '#4a90e2',
            '#bd10e0', '#f5a623', '#9013fe', '#50e3c2', '#f8e71c'
        ];
        const colorIndex = characterName.length % defaultColors.length;
        color = defaultColors[colorIndex];
    }
    
    // 生成本地 SVG 占位头像（渐变背景 + 角色名首字），无需网络
    const shortName = characterName.replace(/^上弦之[壹贰参]・/, '').slice(0, 2);
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
            <defs>
                <radialGradient id="g" cx="35%" cy="30%" r="80%">
                    <stop offset="0%" stop-color="${color}" stop-opacity="0.75"/>
                    <stop offset="100%" stop-color="${color}"/>
                </radialGradient>
            </defs>
            <rect width="200" height="200" fill="url(#g)"/>
            <circle cx="100" cy="100" r="88" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
            <text x="100" y="100" text-anchor="middle" dominant-baseline="central"
                font-family="'Noto Serif SC','Microsoft YaHei',serif" font-size="64"
                fill="#ffffff" style="text-shadow:0 2px 6px rgba(0,0,0,0.4)">${shortName}</text>
        </svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

// Toast 通知（替代 alert）
function showToast(message, duration = 2600) {
    const container = document.getElementById('toastContainer');
    if (!container) {
        alert(message);
        return;
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('toast-out');
        toast.addEventListener('animationend', () => toast.remove(), { once: true });
    }, duration);
}

// 主题漂浮粒子
const themeParticles = {
    default: ['✦', '💜', '✨'],
    flame: ['🔥', '✦', '🧡'],
    water: ['💧', '❄', '✦'],
    sakura: ['🌸', '💮', '🌺'],
    dark: ['⭐', '🌙', '✦']
};

function renderParticles(themeName) {
    const container = document.getElementById('particles');
    if (!container) return;

    container.innerHTML = '';
    const symbols = themeParticles[themeName] || themeParticles.default;
    const count = window.innerWidth < 600 ? 12 : 20;

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('span');
        particle.className = 'particle';
        particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.fontSize = `${0.6 + Math.random() * 1.1}rem`;
        particle.style.animationDuration = `${9 + Math.random() * 14}s`;
        particle.style.animationDelay = `${-Math.random() * 20}s`;
        container.appendChild(particle);
    }
}

let currentQuote = null;
let favorites = JSON.parse(localStorage.getItem('demonSlayerFavorites')) || [];

// 每日签到数据
let checkInData = JSON.parse(localStorage.getItem('demonSlayerCheckIn')) || {
    lastCheckIn: null,
    streak: 0,
    history: []
};

// 主题切换功能
const themes = [
    { name: 'default', displayName: '默认紫色', emoji: '💜' },
    { name: 'flame', displayName: '炎之呼吸', emoji: '🔥' },
    { name: 'water', displayName: '水之呼吸', emoji: '🌊' },
    { name: 'sakura', displayName: '樱花飞舞', emoji: '🌸' },
    { name: 'dark', displayName: '夜间模式', emoji: '🌙' }
];

let currentThemeIndex = 0;

// 防抖函数 - 避免快速重复点击
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    updateDate();
    showDailyQuote();
    displayFavorites();
    
    // 绑定事件
    document.getElementById('newQuoteBtn').addEventListener('click', getRandomQuoteHandler);
    document.getElementById('favoriteBtn').addEventListener('click', toggleFavorite);
    document.getElementById('themeBtn').addEventListener('click', debounce(switchTheme, 300)); // 添加防抖
    document.getElementById('checkinBtn').addEventListener('click', performCheckIn);
    document.getElementById('exportBtn').addEventListener('click', exportFavorites);
    document.getElementById('importBtn').addEventListener('click', () => document.getElementById('importFile').click());
    document.getElementById('importFile').addEventListener('change', handleImportFile);
    
    // 初始化主题和签到
    initTheme();
    initCheckIn();
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
        favoritesList.innerHTML = '<div class="empty-favorites">还没有收藏任何金句哦～<br>开始收藏你喜欢的名言吧！</div>';
        return;
    }
    
    // 按收藏时间倒序排列（最新的在前面）
    const sortedFavorites = [...favorites].reverse();
    
    favoritesList.innerHTML = sortedFavorites.map((favorite, index) => `
        <div class="favorite-item" style="animation-delay: ${Math.min(index * 0.06, 0.6)}s">
            <div class="favorite-content">
                <div class="character">${favorite.character}</div>
                <div class="quote">"${favorite.quote}"</div>
                <div class="favorite-date">收藏于: ${favorite.date}</div>
            </div>
            <button class="remove-btn" onclick="removeFavorite(${favorites.length - 1 - index})" title="删除收藏">
                🗑️
            </button>
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

// 初始化主题
function initTheme() {
    try {
        const savedTheme = localStorage.getItem('demonSlayerTheme') || 'default';
        const themeIndex = themes.findIndex(theme => theme.name === savedTheme);
        
        // 如果找不到保存的主题或主题无效，使用默认主题
        currentThemeIndex = themeIndex >= 0 ? themeIndex : 0;
        
        // 应用主题
        applyTheme(themes[currentThemeIndex].name);
        updateThemeButton();
        
        // 确保主题设置正确保存
        localStorage.setItem('demonSlayerTheme', themes[currentThemeIndex].name);
    } catch (error) {
        console.error('初始化主题时出错:', error);
        // 出错时使用默认主题
        currentThemeIndex = 0;
        applyTheme(themes[0].name);
        updateThemeButton();
    }
}

// 切换主题
function switchTheme() {
    try {
        // 计算下一个主题索引
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        const newTheme = themes[currentThemeIndex];
        
        // 应用新主题
        applyTheme(newTheme.name);
        updateThemeButton();
        
        // 保存主题设置
        localStorage.setItem('demonSlayerTheme', newTheme.name);
        
        // 添加切换动画
        addThemeAnimation();
    } catch (error) {
        console.error('切换主题时出错:', error);
        // 显示错误提示
        showToast('切换主题时出现问题，请刷新页面重试。');
    }
}

// 应用主题
function applyTheme(themeName) {
    // 移除所有主题类
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    
    // 添加新主题类
    document.body.classList.add(`theme-${themeName}`);

    // 更新漂浮粒子
    renderParticles(themeName);
}

// 更新主题按钮文字
function updateThemeButton() {
    const themeBtn = document.getElementById('themeBtn');
    const currentTheme = themes[currentThemeIndex];
    const nextTheme = themes[(currentThemeIndex + 1) % themes.length];
    
    themeBtn.textContent = `${currentTheme.emoji} ${currentTheme.displayName}`;
    themeBtn.title = `点击切换到：${nextTheme.displayName}`;
}

// 主题切换动画
function addThemeAnimation() {
    // 获取需要添加动画效果的元素
    const container = document.querySelector('.container');
    const quoteSection = document.querySelector('.quote-section');
    const footer = document.querySelector('footer');
    
    // 添加动画效果
    container.style.transform = 'scale(0.98)';
    container.style.opacity = '0.8';
    
    // 为主要内容区域添加过渡效果
    if (quoteSection) {
        quoteSection.style.transition = 'all 0.5s ease';
        quoteSection.style.opacity = '0.8';
        quoteSection.style.transform = 'translateY(5px)';
    }
    
    // 为收藏区域添加过渡效果
    if (footer) {
        footer.style.transition = 'all 0.5s ease';
        footer.style.opacity = '0.8';
        footer.style.transform = 'translateY(5px)';
    }
    
    // 恢复正常状态
    setTimeout(() => {
        container.style.transform = 'scale(1)';
        container.style.opacity = '1';
        
        if (quoteSection) {
            quoteSection.style.opacity = '1';
            quoteSection.style.transform = 'translateY(0)';
        }
        
        if (footer) {
            footer.style.opacity = '1';
            footer.style.transform = 'translateY(0)';
        }
    }, 300);
}

// 每日签到系统
// 初始化签到状态
function initCheckIn() {
    try {
        // 检查是否需要重置签到状态
        const today = new Date().toDateString();
        const lastCheckInDate = checkInData.lastCheckIn ? new Date(checkInData.lastCheckIn).toDateString() : null;
        
        // 如果上次签到不是今天，检查是否需要重置连续天数
        if (lastCheckInDate && lastCheckInDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toDateString();
            
            // 如果上次签到不是昨天，重置连续天数
            if (lastCheckInDate !== yesterdayStr) {
                checkInData.streak = 0;
                localStorage.setItem('demonSlayerCheckIn', JSON.stringify(checkInData));
            }
        }
        
        updateCheckInStatus();
    } catch (error) {
        console.error('初始化签到时出错:', error);
    }
}

// 执行签到
function performCheckIn() {
    try {
        const today = new Date();
        const todayStr = today.toDateString();
        const lastCheckInDate = checkInData.lastCheckIn ? new Date(checkInData.lastCheckIn).toDateString() : null;
        
        // 检查今天是否已经签到
        if (lastCheckInDate === todayStr) {
            showToast('今天已经签到过了！');
            return;
        }
        
        // 更新签到数据
        checkInData.lastCheckIn = todayStr;
        
        // 检查是否是连续签到
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();
        
        if (lastCheckInDate === yesterdayStr) {
            // 连续签到，增加连续天数
            checkInData.streak += 1;
        } else {
            // 不是连续签到，重置为1
            checkInData.streak = 1;
        }
        
        // 保存到本地存储
        localStorage.setItem('demonSlayerCheckIn', JSON.stringify(checkInData));
        
        // 更新显示
        updateCheckInStatus();
        
        // 显示签到成功消息
        showToast(`🎉 签到成功！连续签到 ${checkInData.streak} 天！`);

    } catch (error) {
        console.error('签到时出错:', error);
        showToast('签到失败，请重试。');
    }
}

// 更新签到状态显示
function updateCheckInStatus() {
    const checkinBtn = document.getElementById('checkinBtn');
    const checkinStatus = document.getElementById('checkinStatus');
    
    if (!checkinBtn || !checkinStatus) return;
    
    const today = new Date().toDateString();
    const lastCheckInDate = checkInData.lastCheckIn ? new Date(checkInData.lastCheckIn).toDateString() : null;
    const isCheckedInToday = lastCheckInDate === today;
    
    if (isCheckedInToday) {
        // 今天已签到
        checkinBtn.textContent = '✅ 已签到';
        checkinBtn.classList.add('checked-in');
        checkinBtn.disabled = true;
        
        checkinStatus.innerHTML = `
            <div class="streak-info">
                <span>连续签到 </span>
                <span class="streak-number">${checkInData.streak}</span>
                <span> 天</span>
            </div>
        `;
    } else {
        // 今天未签到
        checkinBtn.textContent = '📅 每日签到';
        checkinBtn.classList.remove('checked-in');
        checkinBtn.disabled = false;
        
        if (checkInData.streak > 0) {
            checkinStatus.innerHTML = `
                <div class="streak-info">
                    <span>当前连续签到 </span>
                    <span class="streak-number">${checkInData.streak}</span>
                    <span> 天</span>
                </div>
            `;
        } else {
            checkinStatus.innerHTML = '<div class="streak-info">开始你的签到之旅吧！</div>';
        }
    }
}

// 收藏夹导入导出功能
// 导出收藏夹
function exportFavorites() {
    try {
        const exportData = {
            version: "1.0",
            exportDate: new Date().toISOString(),
            favorites: favorites
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `鬼灭之刃收藏夹_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.json`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast('📤 收藏夹导出成功！');
    } catch (error) {
        console.error('导出收藏夹时出错:', error);
        showToast('导出失败，请重试。');
    }
}

// 处理导入文件
function handleImportFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importData = JSON.parse(e.target.result);
            
            if (validateImportFile(importData)) {
                mergeFavorites(importData.favorites);
            } else {
                showToast('文件格式不正确，请选择有效的收藏夹文件。');
            }
        } catch (error) {
            console.error('导入收藏夹时出错:', error);
            showToast('文件格式错误，请选择有效的JSON文件。');
        }
    };
    
    reader.readAsText(file);
    // 清空文件输入，允许重复选择同一文件
    event.target.value = '';
}

// 验证导入文件格式
function validateImportFile(data) {
    if (!data || typeof data !== 'object') return false;
    if (!data.favorites || !Array.isArray(data.favorites)) return false;
    
    // 检查每个收藏项的格式
    return data.favorites.every(fav => 
        fav.character && 
        fav.quote && 
        typeof fav.character === 'string' && 
        typeof fav.quote === 'string'
    );
}

// 合并导入的收藏夹
function mergeFavorites(importedFavorites) {
    let addedCount = 0;
    
    importedFavorites.forEach(importedFav => {
        // 检查是否已存在相同的收藏
        const exists = favorites.some(existingFav => 
            existingFav.character === importedFav.character && 
            existingFav.quote === importedFav.quote
        );
        
        if (!exists) {
            // 添加导入日期
            const newFavorite = {
                character: importedFav.character,
                quote: importedFav.quote,
                date: importedFav.date || new Date().toLocaleDateString('zh-CN')
            };
            favorites.push(newFavorite);
            addedCount++;
        }
    });
    
    // 保存到本地存储
    localStorage.setItem('demonSlayerFavorites', JSON.stringify(favorites));
    
    // 更新显示
    displayFavorites();
    
    if (addedCount < importedFavorites.length) {
        showToast(`📥 导入完成！新增 ${addedCount} 条，跳过 ${importedFavorites.length - addedCount} 条重复收藏。`);
    } else {
        showToast(`📥 导入成功！共导入 ${addedCount} 条收藏。`);
    }
}

// 删除收藏
function removeFavorite(index) {
    if (index < 0 || index >= favorites.length) return;
    
    const favorite = favorites[index];
    if (confirm(`确定要删除这条收藏吗？\n\n${favorite.character}: "${favorite.quote}"`)) {
        favorites.splice(index, 1);
        localStorage.setItem('demonSlayerFavorites', JSON.stringify(favorites));
        displayFavorites();
        
        // 如果删除的是当前显示的金句，更新收藏按钮状态
        if (currentQuote && 
            currentQuote.character === favorite.character && 
            currentQuote.quote === favorite.quote) {
            updateFavoriteButton();
        }
    }
}