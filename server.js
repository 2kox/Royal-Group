ECHO is on.
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = 3000;

// تمكين CORS للسماح بالاتصال بين الواجهة الأمامية والخلفية
app.use(cors());
app.use(express.json());

// ملف لتخزين الصور
const IMAGE_FILE = "images.json";

// إذا لم يكن الملف موجودًا، قم بإنشائه فارغًا
if (!fs.existsSync(IMAGE_FILE)) {
    fs.writeFileSync(IMAGE_FILE, JSON.stringify([]));
}

// واجهة API لحفظ روابط الصور
app.post("/save-image", (req, res) => {
    const { url, comment } = req.body;

    // قراءة الصور الحالية
    const images = JSON.parse(fs.readFileSync(IMAGE_FILE, "utf-8"));

    // إضافة الصورة الجديدة
    images.push({ url, comment });

    // حفظ التحديثات في الملف
    fs.writeFileSync(IMAGE_FILE, JSON.stringify(images, null, 2));
    res.status(200).send({ message: "تم حفظ الصورة بنجاح!" });
});

// واجهة API لجلب الصور
app.get("/get-images", (req, res) => {
    const images = JSON.parse(fs.readFileSync(IMAGE_FILE, "utf-8"));
    res.status(200).send(images);
});

// تشغيل الخادم
app.listen(PORT, () => console.log(`الخادم يعمل على http://localhost:${PORT}`));
