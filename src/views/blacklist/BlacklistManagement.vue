<template>
  <div class="blacklist-management">
    <!-- 搜索区域 -->
    <div class="search-area">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="地区">
          <el-cascader
            v-model="searchForm.region"
            :options="regionOptions"
            placeholder="请选择地区"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="达人用户名">
          <el-input 
            v-model="searchForm.username" 
            placeholder="请输入达人用户名"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <el-button type="primary" @click="handleRefresh">
        <el-icon><Refresh /></el-icon>刷新列表
      </el-button>
      <el-button type="success" @click="handleAdd">
        <el-icon><Plus /></el-icon>添加黑名单
      </el-button>
      <el-button type="danger" @click="handleBatchDelete">
        <el-icon><Delete /></el-icon>批量删除
      </el-button>
    </div>

    <!-- 表格区域 -->
    <div class="table-container">
      <el-table 
        :data="tableData" 
        style="width: 100%" 
        border 
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="region" label="地区" align="center" />
        <el-table-column prop="username" label="达人用户名" align="center" />
        <el-table-column prop="influencerId" label="达人ID" align="center" />
        <el-table-column prop="addTime" label="添加时间" align="center" width="180" />
        <el-table-column label="操作" width="120" align="center">
          <template #default="{ row }">
            <el-button type="danger" link @click="handleDelete(row)">
              <el-icon><Delete /></el-icon>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加黑名单对话框 -->
    <el-dialog
      title="添加黑名单"
      v-model="dialogVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="地区" prop="region">
          <el-cascader
            v-model="form.region"
            :options="regionOptions"
            placeholder="请选择地区"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="达人用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入达人用户名" />
        </el-form-item>
        <el-form-item label="达人ID" prop="influencerId">
          <el-input v-model="form.influencerId" placeholder="请输入达人ID" />
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
import { ref, reactive } from 'vue'
import { Refresh, Plus, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 搜索表单
const searchForm = reactive({
  region: [],
  username: ''
})

// 地区选项
const regionOptions = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [
      { value: 'hangzhou', label: '杭州' },
      { value: 'ningbo', label: '宁波' }
    ]
  }
]

// 表格数据
const loading = ref(false)
const tableData = ref([
  {
    region: '浙江杭州',
    username: '达人A',
    influencerId: 'ID001',
    addTime: '2024-01-15 14:30:00'
  },
  {
    region: '浙江宁波',
    username: '达人B',
    influencerId: 'ID002',
    addTime: '2024-01-16 15:20:00'
  }
])

// 选中的行
const selectedRows = ref([])

// 对话框相关
const dialogVisible = ref(false)
const submitLoading = ref(false)
const formRef = ref(null)

const form = reactive({
  region: [],
  username: '',
  influencerId: ''
})

const rules = {
  region: [{ required: true, message: '请选择地区', trigger: 'change' }],
  username: [{ required: true, message: '请输入达人用户名', trigger: 'blur' }],
  influencerId: [{ required: true, message: '请输入达人ID', trigger: 'blur' }]
}

// 搜索方法
const handleSearch = () => {
  console.log('搜索条件:', searchForm)
}

const resetSearch = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = ''
  })
}

// 刷新列表
const handleRefresh = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('刷新成功')
  }, 1000)
}

// 表格选择
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 添加黑名单
const handleAdd = () => {
  dialogVisible.value = true
  Object.keys(form).forEach(key => form[key] = '')
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    submitLoading.value = true
    
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newData = {
      ...form,
      region: '浙江杭州', // 实际应该根据选择的地区值显示
      addTime: new Date().toLocaleString()
    }
    
    tableData.value.unshift(newData)
    ElMessage.success('添加成功')
    dialogVisible.value = false
  } catch (error) {
    console.error('提交失败:', error)
  } finally {
    submitLoading.value = false
  }
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该黑名单记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    tableData.value = tableData.value.filter(item => item.influencerId !== row.influencerId)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 批量删除
const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的记录')
    return
  }
  
  ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 条记录吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const selectedIds = selectedRows.value.map(item => item.influencerId)
    tableData.value = tableData.value.filter(item => !selectedIds.includes(item.influencerId))
    ElMessage.success('批量删除成功')
  }).catch(() => {})
}
</script>

<style scoped>
.blacklist-management {
  display: flex;
  flex-direction: column;
  background-color: #fff;
  flex: 1;
  padding: 20px;
  gap: 20px;
}

.search-area {
  background: white;
  padding: 16px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.toolbar {
  display: flex;
  gap: 10px;
  padding: 16px;
  background: white;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.table-container {
  flex: 1;
  background: white;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 16px;
}

:deep(.el-table) {
  margin-bottom: 20px;
}
</style> 