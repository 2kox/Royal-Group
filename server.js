onst express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const mysql = require('mysql');
const path = require('path');

// إعداد Cloudinary
cloudinary.config({
    cloud_name: 'YOUR_CLOUD_NAME',
    api_key: 'YOUR_API_KEY',
    api_secret: 'YOUR_API_SECRET'
});

// إعداد Express
const app = express();
const port = 3000;

// إعداد قاعدة البيانات MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'yourpassword',
    database: 'image_db'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database!');
});

// إعداد multer لتخزين الملفات مؤقتًا
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// رفع الصورة إلى Cloudinary
app.post('/upload', upload.single('image'), (req, res) => {
    cloudinary.uploader.upload_stream((error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Error uploading image.');
        }
        
        // تخزين الرابط في قاعدة البيانات
        const sql = 'INSERT INTO images (url) VALUES (?)';
        db.query(sql, [result.secure_url], (err, result) => {
            if (err) throw err;
            res.send('Image uploaded and URL saved successfully!');
        });
    }).end(req.file.buffer);
});

// عرض الصور المخزنة من قاعدة البيانات
app.get('/gallery', (req, res) => {
    const sql = 'SELECT * FROM images';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

app.listen(port, () => {
    console.log(Server running at http://localhost:${port});
});
