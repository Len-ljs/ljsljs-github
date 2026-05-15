const express = require('express');
const cors = require('cors');
const uploadRouter = require('./routes/upload');
const dbRouter = require('./routes/db');

// 全局捕获未处理的异常
process.on('uncaughtException', (err) => {
  console.error('❌ 未捕获的异常：', err);
});

const app = express();
app.use(cors());
app.use(express.json());

// 接口路由
app.use('/api', uploadRouter);
app.use('/api', dbRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log('✅ 后端服务已启动：http://localhost:3000');
});
