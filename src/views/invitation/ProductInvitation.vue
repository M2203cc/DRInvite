<template>
  <div class="product-invitation">
    <!-- 搜索区域 -->
    <div class="search-area">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="商品名称">
          <el-input 
            v-model="searchForm.name" 
            placeholder="请输入商品名称"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 操作按钮和表格 -->
    <div class="table-container">
      <div class="operation-buttons">
        <el-button type="primary" @click="loadProducts">
          <el-icon><Refresh /></el-icon>刷新列表
        </el-button>
      </div>

      <!-- 商品列表 -->
      <el-table :data="productData" style="width: 100%" border>
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="productName" label="商品名称" min-width="180" />
        <el-table-column prop="price" label="售价" width="120">
          <template #default="{ row }">
            ¥{{ row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="commissionRate" label="佣金率" width="120">
          <template #default="{ row }">
            {{ row.commissionRate }}%
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="danger" link @click="handleDelete(row)">
              <el-icon><Delete /></el-icon>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Delete, Refresh } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 搜索表单
const searchForm = reactive({
  name: ''
})

// 商品数据
const productData = ref([])

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString()
}

// 加载商品数据
const loadProducts = () => {
  const products = JSON.parse(localStorage.getItem('products') || '[]')
  productData.value = products
}

// 搜索方法
const handleSearch = () => {
  const allProducts = JSON.parse(localStorage.getItem('products') || '[]')
  productData.value = allProducts.filter(product => {
    const nameMatch = !searchForm.name || 
      product.productName.toLowerCase().includes(searchForm.name.toLowerCase())
    return nameMatch
  })
}

// 重置搜索
const resetSearch = () => {
  searchForm.name = ''
  loadProducts()
}

// 删除商品
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该商品吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const products = JSON.parse(localStorage.getItem('products') || '[]')
    const updatedProducts = products.filter(item => item.id !== row.id)
    localStorage.setItem('products', JSON.stringify(updatedProducts))
    loadProducts()
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 在组件挂载时加载数据
onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.product-invitation {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-area,
.table-container {
  background: white;
  padding: 20px;
  border-radius: 4px;
  border: 1px solid #ebeef5;
}

.operation-buttons {
  margin-bottom: 16px;
  display: flex;
  gap: 10px;
}

:deep(.el-input-number .el-input__wrapper) {
  padding-left: 11px;
  padding-right: 11px;
}
</style>