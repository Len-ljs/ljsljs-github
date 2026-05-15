// services/doubao.js
const axios = require('axios');
const fs = require('fs');
const { doubao } = require('../config');

async function callDoubaoInvoice(imagePath) {
  const base64 = fs.readFileSync(imagePath, 'base64');

  try {
    const res = await axios({
      method: 'post',
      url: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
      headers: {
        'Authorization': `Bearer ${doubao.apiKey}`,
        'Content-Type': 'application/json'
      },
      data: {
        model: doubao.model,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `你是发票识别专家，请从这张发票图片中提取以下信息，**只返回严格的JSON格式**，不要任何解释文字：
{
  "invoiceCode": "发票代码",
  "invoiceNumber": "发票号码",
  "invoiceDate": "开票日期",
  "totalAmount": "价税合计金额",
  "buyerName": "购买方名称",
  "sellerName": "销售方名称"
}`
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64}`
                }
              }
            ]
          }
        ]
      }
    });

    // 处理返回的JSON
    const jsonStr = res.data.choices[0].message.content;
    const cleanJson = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);

  } catch (err) {
    console.error("AI识别错误详情：", err.response?.data || err.message);
    throw new Error("AI识别失败，请检查API Key和模型权限");
  }
}

module.exports = { callDoubaoInvoice };