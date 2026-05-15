<template>
  <div class="invoice-app">
    <h2>📄 发票智能识别系统</h2>

    <div class="upload-box">
      <el-upload
        drag
        action="http://localhost:3000/api/upload"
        :show-file-list="false"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
      >
        <el-icon class="el-icon-upload"><Upload /></el-icon>
        <div class="el-upload__text">拖拽发票图片到这里，或<em>点击上传</em></div>
        <div class="el-upload__tip">支持 jpg / png / pdf</div>
      </el-upload>
    </div>

    <el-alert
      v-if="resultVisible"
      title="发票识别成功！"
      type="success"
      show-icon
      class="alert"
    />

    <div class="table-box">
      <div class="table-header">
        <h3>历史发票记录</h3>
        <el-button type="primary" @click="exportExcel">导出 Excel</el-button>
      </div>

      <el-table :data="invoiceList" border stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="invoiceCode" label="发票代码" />
        <el-table-column prop="invoiceNumber" label="发票号码" />
        <el-table-column prop="invoiceDate" label="开票日期" />
        <el-table-column prop="totalAmount" label="价税合计" />
        <el-table-column prop="sellerName" label="销售方" />
        <el-table-column prop="buyerName" label="购买方" />
        <el-table-column prop="createdAt" label="识别时间" />
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'
import axios from 'axios'
import * as XLSX from 'xlsx'

const invoiceList = ref([])
const resultVisible = ref(false)

axios.defaults.baseURL = 'http://localhost:3000'

onMounted(() => {
  getInvoiceList()
})

// ✅ 修复：这里必须取 res.data.data
async function getInvoiceList() {
  try {
    const res = await axios.get('/api/invoices')
    invoiceList.value = res.data.data  
  } catch (err) {
    ElMessage.error('获取发票列表失败')
    console.error(err)
  }
}

function handleUploadSuccess(res) {
  ElMessage.success('上传并识别成功！')
  resultVisible.value = true
  getInvoiceList()
}

function handleUploadError() {
  ElMessage.error('上传失败，请检查后端服务')
}

// ✅ 修复：导出字段对应数据库真实字段
function exportExcel() {
  const data = [
    ['ID', '发票代码', '发票号码', '开票日期', '价税合计', '销售方', '购买方', '识别时间'],
    ...invoiceList.value.map(item => [
      item.id,
      item.invoiceCode,
      item.invoiceNumber,
      item.invoiceDate,
      item.totalAmount,
      item.sellerName,
      item.buyerName,
      item.createdAt  
    ])
  ]

  const ws = XLSX.utils.aoa_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '发票记录')
  XLSX.writeFile(wb, '发票识别记录.xlsx')
  ElMessage.success('导出成功！')
}
</script>

<style scoped>
.invoice-app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}
.upload-box {
  margin: 30px 0;
  text-align: center;
}
.table-box {
  margin-top: 40px;
}
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.alert {
  margin: 20px 0;
}
</style>