const express = require('express');
const router = express.Router();
const multer = require('multer');
const { callDoubaoInvoice } = require('../services/doubao');
const db = require('../db');

// 上传配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// 上传 + AI识别 + 存入数据库
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // 1. 获取上传的文件路径
    const filePath = req.file.path;
    console.log('📸 图片已上传：', filePath);

    // 2. 调用豆包AI识别
    const result = await callDoubaoInvoice(filePath);
    console.log('✅ AI识别结果：', result);

    // 3. 插入数据库（完全匹配你的表结构！）
    const { invoiceCode, invoiceNumber, invoiceDate, totalAmount, buyerName, sellerName } = result;

    await db.query(
      `INSERT INTO invoices (
        invoiceCode, 
        invoiceNumber, 
        invoiceDate, 
        totalAmount, 
        buyerName, 
        sellerName
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [invoiceCode, invoiceNumber, invoiceDate, totalAmount, buyerName, sellerName]
    );

    console.log('✅ 数据成功写入数据库！');

    // 4. 返回给前端
    res.json({
      success: true,
      data: result
    });

  } catch (err) {
    console.error('❌ 上传/识别失败：', err);
    if (err.sqlMessage) {
      console.error('❌ MySQL错误：', err.sqlMessage);
    }
    res.status(500).json({
      success: false,
      msg: '识别或入库失败'
    });
  }
});

module.exports = router;