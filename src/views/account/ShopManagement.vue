<template>
  <div class="shop-list">
    <!-- 搜索区域 -->
    <div class="search-area">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="类型">
          <el-select 
            v-model="searchForm.type" 
            placeholder="全部"
            style="width: 180px"
          >
            <el-option label="全部" value="" />
            <el-option label="天猫" value="1" />
            <el-option label="京东" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="搜索">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入关键词"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格工具栏 -->
    <div class="table-toolbar">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>新增店铺
      </el-button>
    </div>

    <!-- 表格区域 -->
    <div class="table-container">
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        v-loading="loading"
      >
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column prop="shopName" label="店铺名称" />
        <el-table-column prop="type" label="类型" width="120">
          <template #default="{ row }">
            <span>{{ row.type === '1' ? '天猫' : '京东' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="account" label="账号" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>编辑
            </el-button>
            <el-button type="danger" link @click="handleDelete(row)">
              <el-icon><Delete /></el-icon>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="店铺名称" prop="shopName">
          <el-input v-model="form.shopName" placeholder="请输入店铺名称" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型" style="width: 100%">
            <el-option label="天猫" value="1" />
            <el-option label="京东" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model="form.account" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 搜索表单
const searchForm = reactive({
  type: '',
  keyword: ''
})

// 表格数据
const loading = ref(false)
const tableData = ref([
  {
    shopName: '官方旗舰店',
    type: '1',
    account: 'shop001',
    remark: '主要销售渠道'
  },
  {
    shopName: '京东专卖店',
    type: '2',
    account: 'jd002',
    remark: '京东主要店铺'
  },
  {
    shopName: '天猫品牌店',
    type: '1',
    account: 'tm003',
    remark: '品牌专营店'
  },
  {
    shopName: '京东自营店',
    type: '2',
    account: 'jd004',
    remark: '自营产品店铺'
  },
  {
    shopName: '天猫旗舰店',
    type: '1',
    account: 'tm005',
    remark: '主打新品店铺'
  }
])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 新增/编辑对话框
const dialogVisible = ref(false)
const dialogTitle = computed(() => isEdit.value ? '编辑店铺' : '新增店铺')
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref(null)

const form = reactive({
  shopName: '',
  type: '',
  account: '',
  remark: ''
})

const rules = {
  shopName: [{ required: true, message: '请输入店铺名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }]
}

// 原始数据
const originalData = ref([
  {
    shopName: '官方旗舰店',
    type: '1',
    account: 'shop001',
    remark: '主要销售渠道'
  },
  {
    shopName: '京东专卖店',
    type: '2',
    account: 'jd002',
    remark: '京东主要店铺'
  },
  {
    shopName: '天猫品牌店',
    type: '1',
    account: 'tm003',
    remark: '品牌专营店'
  },
  {
    shopName: '京东自营店',
    type: '2',
    account: 'jd004',
    remark: '自营产品店铺'
  },
  {
    shopName: '天猫旗舰店',
    type: '1',
    account: 'tm005',
    remark: '主打新品店铺'
  }
])

// 获取店铺列表数据
const fetchData = async () => {
  try {
    loading.value = true
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    tableData.value = [...originalData.value]
    total.value = tableData.value.length
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败，请重试')
  } finally {
    loading.value = false
  }
}

// 搜索方法
const handleSearch = async () => {
  try {
    loading.value = true
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const filteredData = originalData.value.filter(item => {
      const typeMatch = !searchForm.type || item.type === searchForm.type
      const keywordMatch = !searchForm.keyword || 
        item.shopName.includes(searchForm.keyword) || 
        item.account.includes(searchForm.keyword)
      return typeMatch && keywordMatch
    })
    
    tableData.value = filteredData
    total.value = filteredData.length
  } catch (error) {
    console.error('搜索失败:', error)
    ElMessage.error('搜索失败，请重试')
  } finally {
    loading.value = false
  }
}

const resetSearch = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = ''
  })
  tableData.value = [...originalData.value]
  total.value = tableData.value.length
}

const handleSizeChange = (val) => {
  pageSize.value = val
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

// 打开新增对话框
const handleAdd = () => {
  isEdit.value = false
  Object.keys(form).forEach(key => form[key] = '')
  dialogVisible.value = true
}

// 打开编辑对话框
const handleEdit = (row) => {
  isEdit.value = true
  Object.assign(form, row)
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    submitLoading.value = true
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (isEdit.value) {
      const index = tableData.value.findIndex(item => item.account === form.account)
      const originalIndex = originalData.value.findIndex(item => item.account === form.account)
      if (index !== -1) {
        const updatedData = { ...form }
        tableData.value[index] = updatedData
        originalData.value[originalIndex] = updatedData
      }
    } else {
      const newData = {
        shopName: form.shopName,
        type: form.type,
        account: form.account,
        remark: form.remark
      }
      tableData.value.unshift(newData)
      originalData.value.unshift(newData)
      total.value++
    }
    
    ElMessage.success(isEdit.value ? '编辑成功' : '新增成功')
    dialogVisible.value = false
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('操作失败，请重试')
  } finally {
    submitLoading.value = false
  }
}

// 删除店铺
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该店铺吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    loading.value = true
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const index = tableData.value.findIndex(item => item.account === row.account)
    const originalIndex = originalData.value.findIndex(item => item.account === row.account)
    if (index !== -1) {
      tableData.value.splice(index, 1)
      originalData.value.splice(originalIndex, 1)
      total.value--
      ElMessage.success('删除成功')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败，请重试')
    }
  } finally {
    loading.value = false
  }
}

// 初始化时获取数据
fetchData()
</script>

<style scoped>
.shop-list {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  flex: 1;
}

.search-area {
  background: white;
  padding: 16px;
  border-bottom: 1px solid #ebeef5;
}

.table-toolbar {
  display: flex;
  gap: 10px;
  padding: 16px;
  background-color: #fff;
  border-bottom: 1px solid #ebeef5;
}

.table-container {
  flex: 1;
  background: white;
  padding: 0;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.pagination {
  padding: 10px 16px;
  display: flex;
  justify-content: flex-end;
  background: white;
  border-top: 1px solid #ebeef5;
}
</style> 
