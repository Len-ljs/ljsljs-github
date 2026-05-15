// test-api.js
const { callDoubaoInvoice } = require('./services/doubao');

// 替换成你项目里一张真实的图片路径，比如：
const testImagePath = './uploads/1778338537362-dzfp_23312000000151195672_20231204165058.png';

async function testAPI() {
  try {
    console.log('开始调用豆包API...');
    const result = await callDoubaoInvoice(testImagePath);
    console.log('✅ API调用成功！返回结果：', result);
  } catch (err) {
    console.error('❌ API调用失败！错误详情：', err.response?.data || err.message);
  }
}

testAPI();