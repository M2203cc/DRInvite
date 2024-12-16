<template>
  <div class="influencer-chat">
    <!-- 搜索区域 -->
    <div class="search-area">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="账目类型">
          <el-select 
            v-model="searchForm.accountType" 
            placeholder="全部"
            style="width: 160px"
          >
            <el-option label="全部" value="" />
            <el-option label="个人" value="1" />
            <el-option label="机构" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="地区">
          <el-cascader
            v-model="searchForm.region"
            :options="regionOptions"
            placeholder="请选择地区"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="searchForm.accountId" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="店铺">
          <el-select 
            v-model="searchForm.shop" 
            placeholder="请选择店铺"
            style="width: 160px"
          >
            <el-option label="全部" value="" />
            <el-option label="天猫" value="1" />
            <el-option label="京东" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="属性">
          <el-select 
            v-model="searchForm.property" 
            placeholder="请选择属性"
            style="width: 160px"
          >
            <el-option label="全部" value="" />
            <el-option label="个人" value="1" />
            <el-option label="企业" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="类目">
          <el-cascader
            v-model="searchForm.category"
            :options="categoryOptions"
            placeholder="请选择类目"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="粉丝数">
          <el-select 
            v-model="searchForm.fansCount" 
            placeholder="请选择粉丝数"
            style="width: 160px"
          >
            <el-option label="全部" value="" />
            <el-option label="10万以下" value="1" />
            <el-option label="10-50万" value="2" />
            <el-option label="50-100万" value="3" />
            <el-option label="100万以上" value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="粉丝性别">
          <el-select 
            v-model="searchForm.fansGender" 
            placeholder="请选择性别"
            style="width: 160px"
          >
            <el-option label="全部" value="" />
            <el-option label="男性为主" value="1" />
            <el-option label="女性为主" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
          <el-button type="success" @click="handleAdd">
            <el-icon><Plus /></el-icon>新增达人
          </el-button>
          <el-button type="warning" @click="handleBatchChat">
            <el-icon><ChatDotRound /></el-icon>批量私聊
          </el-button>
          <el-button type="danger" @click="handleBatchDelete">
            <el-icon><Delete /></el-icon>批量删除
          </el-button>
        </el-form-item>
      </el-form>
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
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="account" label="达人账号" width="120" />
        <el-table-column label="达人信息" min-width="200">
          <template #default="{ row }">
            <div class="influencer-info">
              <el-avatar :src="row.avatar" :size="40" />
              <div class="info-detail">
                <div class="name">{{ row.name }}</div>
                <div class="platform">{{ row.platform }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="fansCount" label="粉丝数" width="100">
          <template #default="{ row }">
            {{ formatNumber(row.fansCount) }}
          </template>
        </el-table-column>
        <el-table-column label="达人数据" width="200">
          <template #default="{ row }">
            <div class="data-info">
              <div>点赞：{{ formatNumber(row.likes) }}</div>
              <div>评论：{{ formatNumber(row.comments) }}</div>
              <div>转发：{{ formatNumber(row.shares) }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="participationRate" label="参与率" width="100">
          <template #default="{ row }">
            {{ row.participationRate }}%
          </template>
        </el-table-column>
        <el-table-column prop="contact" label="联系方式" width="120" />
        <el-table-column label="私聊历史" width="100">
          <template #default="{ row }">
            <el-button type="primary" link @click="viewChatHistory(row)">
              查看历史
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="黑名单" width="100">
          <template #default="{ row }">
            <el-switch
              v-model="row.isBlacklist"
              @change="(val) => handleBlacklistChange(row, val)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>编辑
            </el-button>
            <el-button type="success" link @click="handleChat(row)">
              <el-icon><ChatDotRound /></el-icon>私聊
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

    <!-- 私聊历史对话框 -->
    <el-dialog
      title="私聊历史"
      v-model="chatHistoryVisible"
      width="600px"
    >
      <div class="chat-history">
        <!-- 这里添加私聊历史的具体内容 -->
      </div>
    </el-dialog>

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
        <el-form-item label="头像" prop="avatar">
          <div class="avatar-uploader">
            <el-upload
              class="avatar-uploader"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
              :http-request="handleAvatarUpload"
            >
              <img v-if="form.avatar" :src="form.avatar" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
            <div class="avatar-tip">点击上传头像</div>
          </div>
        </el-form-item>
        <el-form-item label="达人名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入达人名称" />
        </el-form-item>
        <el-form-item label="达人账号" prop="account">
          <el-input v-model="form.account" placeholder="请输入达人账号" />
        </el-form-item>
        <el-form-item label="平台" prop="platform">
          <el-select v-model="form.platform" placeholder="请选择平台" style="width: 100%">
            <el-option label="抖音" value="1" />
            <el-option label="快手" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="粉丝数" prop="fansCount">
          <el-input-number v-model="form.fansCount" :min="0" placeholder="请输入粉丝数" />
        </el-form-item>
        <el-form-item label="点赞数" prop="likes">
          <el-input-number v-model="form.likes" :min="0" placeholder="请输入点赞数" />
        </el-form-item>
        <el-form-item label="评论数" prop="comments">
          <el-input-number v-model="form.comments" :min="0" placeholder="请输入评论数" />
        </el-form-item>
        <el-form-item label="转发数" prop="shares">
          <el-input-number v-model="form.shares" :min="0" placeholder="请输入转发数" />
        </el-form-item>
        <el-form-item label="参与率" prop="participationRate">
          <el-input-number 
            v-model="form.participationRate" 
            :min="0" 
            :max="100" 
            :precision="2"
            placeholder="请输入参与率"
          />
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="form.contact" placeholder="请输入联系方式" />
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
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete, ChatDotRound, UploadFilled } from '@element-plus/icons-vue'

// 搜索表单
const searchForm = reactive({
  accountType: '',  // 默认全部
  region: [],  // 默认不选
  accountId: '',  // 默认空
  shop: '',  // 默认全部
  property: '',  // 默认全部
  category: [],  // 默认不选
  fansCount: '',  // 默认全部
  fansGender: ''  // 默认全部
})

// 地区选项（示例数据）
const regionOptions = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [
      { value: 'hangzhou', label: '杭州' },
      { value: 'ningbo', label: '宁波' }
    ]
  }
  // ... 其他地区数据
]

// 类目选项（示例数据）
const categoryOptions = [
  {
    value: 'clothing',
    label: '服装',
    children: [
      { value: 'women', label: '女装' },
      { value: 'men', label: '男装' }
    ]
  }
  // ... 其他类目数据
]

// 表格数据
const loading = ref(false)
const tableData = ref([])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 私聊历史对话框
const chatHistoryVisible = ref(false)

// 格式化数字
const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num.toString()
}

// 查看私聊历史
const viewChatHistory = (row) => {
  chatHistoryVisible.value = true
  // 这里添加加载私聊历史的逻辑
}

// 处理黑名单状态变化
const handleBlacklistChange = async (row, value) => {
  try {
    await ElMessage.confirm(
      `确定要${value ? '加入' : '移出'}黑名单吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    // 这里添加更新黑名单状态的逻辑
    ElMessage.success(`${value ? '已加入' : '已移出'}黑名单`)
  } catch {
    row.isBlacklist = !value
  }
}

// 搜索方法
const handleSearch = () => {
  // 实现搜索逻辑
}

const resetSearch = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = ''
  })
}

const handleSizeChange = (val) => {
  pageSize.value = val
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

// 选中的行
const selectedRows = ref([])

// 新增/编辑对话框
const dialogVisible = ref(false)
const dialogTitle = computed(() => isEdit.value ? '编辑达人' : '新增达人')
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref(null)

const form = reactive({
  avatar: '',
  name: '',
  account: '',
  platform: '',
  fansCount: 0,
  likes: 0,
  comments: 0,
  shares: 0,
  participationRate: 0,
  contact: '',
  remark: ''
})

const rules = {
  name: [{ required: true, message: '请输入达人名称', trigger: 'blur' }],
  account: [{ required: true, message: '请输入达人账号', trigger: 'blur' }],
  platform: [{ required: true, message: '请选择平台', trigger: 'change' }],
  fansCount: [{ required: true, message: '请输入粉丝数', trigger: 'blur' }],
  contact: [{ required: true, message: '请输入联系方式', trigger: 'blur' }]
}

// 表格选择
const handleSelectionChange = (rows) => {
  selectedRows.value = rows
}

// 新增达人
const handleAdd = () => {
  isEdit.value = false
  Object.keys(form).forEach(key => form[key] = '')
  dialogVisible.value = true
}

// 编辑达人
const handleEdit = (row) => {
  isEdit.value = true
  Object.assign(form, {
    ...row,
    avatar: row.avatar || ''
  })
  dialogVisible.value = true
}

// 私聊
const handleChat = (row) => {
  // 实现私聊逻辑
  ElMessage.success(`正在与 ${row.name} 私聊`)
}

// 批量私聊
const handleBatchChat = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要私聊的达人')
    return
  }
  // 实现批量私聊逻辑
  ElMessage.success(`正在批量私聊 ${selectedRows.value.length} 个达人`)
}

// 删除达人
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该达人吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    loading.value = true
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 从表格数据中移除
    const index = tableData.value.findIndex(item => item.account === row.account)
    if (index !== -1) {
      tableData.value.splice(index, 1)
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

// 批量删除
const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的达人')
    return
  }
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 个达人吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    loading.value = true
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 批量删除选中的数据
    const selectedAccounts = selectedRows.value.map(row => row.account)
    tableData.value = tableData.value.filter(item => !selectedAccounts.includes(item.account))
    total.value -= selectedRows.value.length
    
    ElMessage.success('批量删除成功')
    selectedRows.value = []  // 清空选中
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除失败:', error)
      ElMessage.error('批量删除失败，请重试')
    }
  } finally {
    loading.value = false
  }
}

// 提交表单（新增/编辑）
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    submitLoading.value = true
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newData = {
      avatar: form.avatar || 'https://example.com/avatar.jpg',
      name: form.name,
      account: form.account,
      platform: form.platform === '1' ? '抖音' : '快手',
      fansCount: form.fansCount,
      likes: form.likes,
      comments: form.comments,
      shares: form.shares,
      participationRate: form.participationRate,
      contact: form.contact,
      remark: form.remark,
      isBlacklist: false
    }
    
    if (isEdit.value) {
      // 编辑模式：更新现有数据
      const index = tableData.value.findIndex(item => item.account === form.account)
      if (index !== -1) {
        tableData.value[index] = { ...newData }
      }
    } else {
      // 新增模式：添加到表格数据中
      tableData.value.unshift(newData)
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

// 初始化表格数据
const initTableData = () => {
  tableData.value = [
    {
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      name: '测试达人1',
      account: 'test001',
      platform: '抖音',
      fansCount: 1000000,
      likes: 500000,
      comments: 50000,
      shares: 10000,
      participationRate: 5.2,
      contact: '13800138000',
      isBlacklist: false
    },
    {
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lily',
      name: '时尚达人A',
      account: 'fashion001',
      platform: '抖音',
      fansCount: 2500000,
      likes: 1200000,
      comments: 80000,
      shares: 30000,
      participationRate: 6.8,
      contact: '13811112222',
      isBlacklist: false
    },
    {
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
      name: '美妆博主B',
      account: 'beauty002',
      platform: '快手',
      fansCount: 1800000,
      likes: 900000,
      comments: 60000,
      shares: 20000,
      participationRate: 4.5,
      contact: '13822223333',
      isBlacklist: false
    },
    {
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
      name: '生活达人C',
      account: 'life003',
      platform: '抖音',
      fansCount: 3000000,
      likes: 1500000,
      comments: 100000,
      shares: 50000,
      participationRate: 7.2,
      contact: '13833334444',
      isBlacklist: false
    },
    {
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
      name: '科技达人D',
      account: 'tech004',
      platform: '快手',
      fansCount: 800000,
      likes: 400000,
      comments: 30000,
      shares: 15000,
      participationRate: 3.8,
      contact: '13844445555',
      isBlacklist: false
    }
  ]
  total.value = tableData.value.length
}

// 组件挂载时初始化数据
onMounted(() => {
  initTableData()
})

// 头像上传前的验证
const beforeAvatarUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('头像只能是 JPG/PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('头像大小不能超过 2MB!')
    return false
  }
  return true
}

// 处理头像上传
const handleAvatarUpload = async (options) => {
  try {
    // 这里应该是调用后端API上传图片
    // 现在我们使用 FileReader 在前端预览
    const reader = new FileReader()
    reader.onload = (e) => {
      form.avatar = e.target.result
    }
    reader.readAsDataURL(options.file)
  } catch (error) {
    console.error('上传失败:', error)
    ElMessage.error('上传失败，请重试')
  }
}
</script>

<style scoped>
.influencer-chat {
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

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.table-container {
  flex: 1;
  background: white;
  padding: 0;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.influencer-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.info-detail {
  display: flex;
  flex-direction: column;
}

.info-detail .name {
  font-weight: bold;
}

.info-detail .platform {
  font-size: 12px;
  color: #666;
}

.data-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
}

.pagination {
  padding: 10px 16px;
  display: flex;
  justify-content: flex-end;
  background: white;
  border-top: 1px solid #ebeef5;
}

.chat-history {
  min-height: 300px;
}

/* 工具栏按钮样式 */
.el-form-item:last-child {
  margin-left: 20px;
}

.el-form-item:last-child .el-form-item__content {
  display: flex;
  gap: 10px;
}

/* 头像上传样式 */
.avatar-uploader {
  text-align: center;
}

.avatar-uploader :deep(.el-upload) {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader :deep(.el-upload:hover) {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
  object-fit: cover;
}

.avatar-tip {
  font-size: 12px;
  color: #666;
  margin-top: 8px;
}
</style> 