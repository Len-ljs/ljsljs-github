const express = require('express');
const router = express.Router();
const db = require('../db');

// 示例：获取所有发票数据的接口
router.get('/invoices', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM invoices ORDER BY createdAt DESC');
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('数据库查询错误：', err);
    res.status(500).json({ success: false, msg: '查询失败' });
  }
});

// 关键：必须导出 router
module.exports = router;