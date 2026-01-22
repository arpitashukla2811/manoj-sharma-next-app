const fs = require('fs');
const path = require('path');

const galleryDir = path.join(__dirname, 'public', 'images', 'gallery');

if (!fs.existsSync(galleryDir)) {
    console.error('Gallery directory not found!');
    process.exit(1);
}

const files = fs.readdirSync(galleryDir).filter(file => {
    return file.startsWith('WhatsApp Image') && (file.endsWith('.jpeg') || file.endsWith('.jpg'));
});

console.log(`Found ${files.length} images to rename.`);

files.forEach((file, index) => {
    const oldPath = path.join(galleryDir, file);
    const extension = path.extname(file);
    const newName = `gallery-${index + 1}${extension}`;
    const newPath = path.join(galleryDir, newName);

    fs.renameSync(oldPath, newPath);
    console.log(`Renamed: ${file} -> ${newName}`);
});

console.log('Renaming complete.');
