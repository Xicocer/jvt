const multer = require('multer');
const path = require('path');

//Путь сохранения и название файла

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/avatars/');
    },

    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName)
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Можно загружать только изображения!'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits:{ fileSize: 15*1024*1024 },
});

module.exports = upload;