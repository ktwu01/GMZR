// 鬼灭之刃角色图片设置脚本
// Demon Slayer Character Images Setup Script

const requiredImages = [
    { filename: 'tanjiro.jpg', character: '竈门炭治郎', description: 'Tanjiro Kamado - Main protagonist' },
    { filename: 'nezuko.jpg', character: '竈门祢豆子', description: 'Nezuko Kamado - Tanjiro\'s sister' },
    { filename: 'zenitsu.jpg', character: '我妻善逸', description: 'Zenitsu Agatsuma - Thunder Breathing user' },
    { filename: 'inosuke.jpg', character: '嘴平伊之助', description: 'Inosuke Hashibira - Beast Breathing user' },
    { filename: 'giyuu.jpg', character: '富冈义勇', description: 'Giyu Tomioka - Water Hashira' },
    { filename: 'shinobu.jpg', character: '胡蝶忍', description: 'Shinobu Kocho - Insect Hashira' },
    { filename: 'rengoku.jpg', character: '炼狱杏寿郎', description: 'Kyojuro Rengoku - Flame Hashira' },
    { filename: 'tengen.jpg', character: '宇髄天元', description: 'Tengen Uzui - Sound Hashira' },
    { filename: 'muichiro.jpg', character: '时透无一郎', description: 'Muichiro Tokito - Mist Hashira' },
    { filename: 'mitsuri.jpg', character: '甘露寺蜜璃', description: 'Mitsuri Kanroji - Love Hashira' },
    { filename: 'obanai.jpg', character: '伊黑小芭内', description: 'Obanai Iguro - Serpent Hashira' },
    { filename: 'sanemi.jpg', character: '不死川实弥', description: 'Sanemi Shinazugawa - Wind Hashira' },
    { filename: 'gyomei.jpg', character: '悲鸣屿行冥', description: 'Gyomei Himejima - Stone Hashira' },
    { filename: 'kagaya.jpg', character: '产屋敷耀哉', description: 'Kagaya Ubuyashiki - Demon Slayer Corps Leader' },
    { filename: 'urokodaki.jpg', character: '鳞滝左近次', description: 'Sakonji Urokodaki - Former Water Hashira' },
    // Additional characters (optional)
    { filename: 'muzan.jpg', character: '鬼舞辻无惨', description: 'Muzan Kibutsuji - Main antagonist' },
    { filename: 'kokushibo.jpg', character: '上弦之壹・黑死牟', description: 'Kokushibo - Upper Moon One' },
    { filename: 'douma.jpg', character: '上弦之贰・童磨', description: 'Doma - Upper Moon Two' },
    { filename: 'akaza.jpg', character: '上弦之参・猗窩座', description: 'Akaza - Upper Moon Three' },
    { filename: 'tamayo.jpg', character: '珠世', description: 'Tamayo - Demon doctor' },
    { filename: 'yushiro.jpg', character: '愈史郎', description: 'Yushiro - Tamayo\'s assistant' }
];

// 图片来源建议
const imageSources = {
    official: [
        '官方动画截图 (Official anime screenshots)',
        '官方漫画插图 (Official manga illustrations)',
        '官方周边商品图片 (Official merchandise images)'
    ],
    fanArt: [
        'Pixiv (需要注意版权)',
        'DeviantArt (需要注意版权)',
        'Twitter 官方账号'
    ],
    free: [
        'Wikimedia Commons',
        'Unsplash (搜索相关关键词)',
        'Pexels (搜索相关关键词)'
    ]
};

// 检查图片文件是否存在
function checkImages() {
    console.log('🔍 检查图片文件状态...\n');
    
    requiredImages.forEach(img => {
        const imagePath = `images/${img.filename}`;
        // 注意：这个脚本在浏览器中运行时无法直接检查文件系统
        console.log(`📁 ${img.filename} - ${img.character}`);
        console.log(`   描述: ${img.description}`);
        console.log(`   路径: ${imagePath}\n`);
    });
}

// 生成下载清单
function generateDownloadList() {
    console.log('📋 图片下载清单:\n');
    console.log('请将以下图片保存到 GMZR/images/ 文件夹中:\n');
    
    requiredImages.forEach((img, index) => {
        console.log(`${index + 1}. ${img.filename}`);
        console.log(`   角色: ${img.character}`);
        console.log(`   描述: ${img.description}`);
        console.log('   ----------------');
    });
    
    console.log('\n📏 图片规格要求:');
    console.log('- 格式: JPG');
    console.log('- 尺寸: 200x200 像素或更大');
    console.log('- 文件大小: 建议小于 500KB');
    console.log('- 图片质量: 清晰，角色特征明显');
}

// 生成图片搜索关键词
function generateSearchKeywords() {
    console.log('🔍 图片搜索关键词建议:\n');
    
    requiredImages.forEach(img => {
        const englishName = img.description.split(' - ')[0];
        console.log(`${img.character} (${englishName}):`);
        console.log(`  - "${englishName} demon slayer"`);
        console.log(`  - "${englishName} kimetsu no yaiba"`);
        console.log(`  - "${img.character} 鬼灭之刃"`);
        console.log('  ----------------');
    });
}

// 主函数
function main() {
    console.log('🎌 鬼灭之刃角色图片设置助手');
    console.log('================================\n');
    
    checkImages();
    generateDownloadList();
    generateSearchKeywords();
    
    console.log('\n💡 使用建议:');
    console.log('1. 优先使用官方图片素材');
    console.log('2. 确保图片版权合规');
    console.log('3. 保持图片风格一致');
    console.log('4. 定期更新图片质量');
    console.log('\n✨ 如果暂时没有图片，应用会自动生成彩色占位符图片！');
}

// 如果在 Node.js 环境中运行
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { requiredImages, imageSources, main };
}

// 如果在浏览器中运行
if (typeof window !== 'undefined') {
    window.DemonSlayerImageSetup = { requiredImages, imageSources, main };
}

// 自动运行
main();