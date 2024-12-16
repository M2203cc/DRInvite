<template>
  <div class="chat-system">
    <!-- 搜索区域 -->
    <div class="search-area">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="类型">
          <el-select v-model="searchForm.type" placeholder="全部" style="width: 160px">
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
          <el-input v-model="searchForm.account" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="账号备注">
          <el-input v-model="searchForm.remark" placeholder="请输入账号备注" />
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
      <el-button type="success" @click="handleSync">
        <el-icon><Connection /></el-icon>同步信息
      </el-button>
    </div>

    <!-- 表格区域 -->
    <div class="table-container">
      <el-table :data="tableData" style="width: 100%" border v-loading="loading">
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="remark" label="账号备注" align="center" />
        <el-table-column prop="shopName" label="店铺名称" align="center" />
        <el-table-column prop="region" label="地区" align="center" />
        <el-table-column prop="unreadCount" label="未读消息" width="100" align="center">
          <template #default="{ row }">
            <el-badge 
              :value="row.unreadCount" 
              :max="9"
              type="danger" 
              v-if="row.unreadCount > 0"
              class="message-badge"
            >
              <span class="view-text">查看</span>
           </el-badge>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column prop="pendingSamples" label="样品申请待审核" width="120" align="center">
          <template #default="{ row }">
            <el-tag type="warning" size="small" v-if="row.pendingSamples > 0">
              {{ row.pendingSamples }}个待审核
            </el-tag>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleWebLogin(row)">
              <el-icon><Link /></el-icon>网页登录
            </el-button>
            <el-button type="success" link @click="handleSyncSingle(row)">
              <el-icon><Connection /></el-icon>同步信息
            </el-button>
            <el-button type="info" link @click="handleViewMessages(row)">
              <el-icon><ChatDotRound /></el-icon>达人消息
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Refresh, Connection, Link, ChatDotRound } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 搜索表单
const searchForm = reactive({
  type: '',
  region: [],
  account: '',
  remark: ''
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
    remark: '测试账号A',
    shopName: '官方旗舰店',
    region: '浙江杭州',
    unreadCount: 5,
    pendingSamples: 2
  },
  {
    remark: '测试账号B',
    shopName: '专卖店',
    region: '浙江宁波',
    unreadCount: 0,
    pendingSamples: 0
  }
])

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

// 同步信息
const handleSync = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('同步成功')
  }, 1500)
}

// 网页登录
const handleWebLogin = (row) => {
  ElMessage.success(`正在打开 ${row.shopName} 的登录页面`)
}

// 同步单个账号信息
const handleSyncSingle = (row) => {
  ElMessage.success(`正在同步 ${row.shopName} 的信息`)
}

// 查看达人消息
const handleViewMessages = (row) => {
  ElMessage.success(`查看 ${row.shopName} 的达人消息`)
}
</script>

<style scoped>
.chat-system {
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

.message-badge {
  position: relative;
  display: inline-block;
  height: 20px;
 
  :deep(.el-badge__content) {
    font-size: 10px;
    height: 12px;
    line-height: 12px;
    padding: 0 3px;
    min-width: 12px;
    border: none;
    transform: translateY(-50%) translateX(2px) scale(0.8);
    top: 0;
  }
}

:deep(.el-table .cell) {
  padding: 8px 0;
  line-height: 20px;
  text-align: center;
}

.view-text {
  color: #409EFF;
  font-size: 13px;
  cursor: pointer;
  display: inline-block;
  line-height: 20px;
}

.view-text:hover {
  color: #66b1ff;
}
</style>