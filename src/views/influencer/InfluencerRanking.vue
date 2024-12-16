<template>
  <div class="ranking-list">
    <!-- 搜索区域 -->
    <div class="search-area">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :shortcuts="dateShortcuts"
            style="width: 360px"
          />
        </el-form-item>
        <el-form-item label="平台">
          <el-select v-model="searchForm.platform" placeholder="请选择平台" style="width: 160px">
            <el-option label="全部" value="" />
            <el-option label="抖音" value="1" />
            <el-option label="快手" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-select v-model="searchForm.sortBy" placeholder="请选择排序方式" style="width: 160px">
            <el-option label="粉丝数" value="fans" />
            <el-option label="点赞数" value="likes" />
            <el-option label="评论数" value="comments" />
            <el-option label="转发数" value="shares" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 排行榜展示 -->
    <div class="ranking-container">
      <!-- 前三名展示 -->
      <div class="top-three">
        <div v-for="(item, index) in topThree" :key="item.id" class="rank-card" :class="`rank-${index + 1}`">
          <div class="rank-number">{{ index + 1 }}</div>
          <el-avatar :src="item.avatar" :size="80" />
          <div class="info">
            <div class="name">{{ item.name }}</div>
            <div class="platform">{{ item.platform }}</div>
            <div class="fans">粉丝数：{{ formatNumber(item.fansCount) }}</div>
          </div>
          <div class="stats">
            <div class="stat-item">
              <div class="label">点赞</div>
              <div class="value">{{ formatNumber(item.likes) }}</div>
            </div>
            <div class="stat-item">
              <div class="label">评论</div>
              <div class="value">{{ formatNumber(item.comments) }}</div>
            </div>
            <div class="stat-item">
              <div class="label">转发</div>
              <div class="value">{{ formatNumber(item.shares) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 其他排名列表 -->
      <div class="rank-list">
        <el-table
          :data="tableData"
          style="width: 100%"
          border
          v-loading="loading"
        >
          <el-table-column type="index" label="排名" width="80">
            <template #default="{ $index }">
              {{ $index + 4 }}
            </template>
          </el-table-column>
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
          <el-table-column prop="fansCount" label="粉丝数" width="120">
            <template #default="{ row }">
              {{ formatNumber(row.fansCount) }}
            </template>
          </el-table-column>
          <el-table-column label="互动数据" width="300">
            <template #default="{ row }">
              <div class="interaction-data">
                <span>点赞：{{ formatNumber(row.likes) }}</span>
                <span>评论：{{ formatNumber(row.comments) }}</span>
                <span>转发：{{ formatNumber(row.shares) }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="growth" label="增长率" width="100">
            <template #default="{ row }">
              <span :class="{ 'text-success': row.growth > 0, 'text-danger': row.growth < 0 }">
                {{ row.growth > 0 ? '+' : '' }}{{ row.growth }}%
              </span>
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
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

// 日期快捷选项
const dateShortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: '最近一月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  }
]

// 搜索表单
const searchForm = reactive({
  dateRange: [
    new Date(new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7)), // 一周前
    new Date() // 当前时间
  ],
  platform: '',  // 默认全部
  sortBy: 'fans'  // 默认按粉丝数排序（因为没有"全部"选项，保持默认粉丝数排序）
})

// 前三名数据
const topThree = ref([
  {
    id: 1,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
    name: '生活达人C',
    platform: '抖音',
    fansCount: 3000000,
    likes: 1500000,
    comments: 100000,
    shares: 50000
  },
  {
    id: 2,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lily',
    name: '时尚达人A',
    platform: '抖音',
    fansCount: 2500000,
    likes: 1200000,
    comments: 80000,
    shares: 30000
  },
  {
    id: 3,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
    name: '美妆博主B',
    platform: '快手',
    fansCount: 1800000,
    likes: 900000,
    comments: 60000,
    shares: 40000
  }
])

// 分页相关数据
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)  // 初始化为0

// 表格数据
const loading = ref(false)
const tableData = ref([
  {
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    name: '测试达人1',
    platform: '抖音',
    fansCount: 1000000,
    likes: 500000,
    comments: 50000,
    shares: 25000,
    growth: 5.2
  },
  {
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
    name: '科技达人D',
    platform: '快手',
    fansCount: 800000,
    likes: 400000,
    comments: 30000,
    shares: 15000,
    growth: 3.8
  }
])

// 格式化数字
const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num.toString()
}

// 搜索方法
const handleSearch = () => {
  // 实现搜索逻辑
  // 重新计算总数
  total.value = topThree.value.length + tableData.value.length
}

const resetSearch = () => {
  // 重置为默认值
  searchForm.dateRange = [
    new Date(new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7)),
    new Date()
  ]
  searchForm.platform = ''  // 重置为全部
  searchForm.sortBy = 'fans'  // 重置为默认排序
  // 重置后重新计算总数
  total.value = topThree.value.length + tableData.value.length
}

// 处理分页大小变化
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1  // 重置当前页码
  // 这里可以重新加载数据
}

// 处理页码变化
const handleCurrentChange = (val) => {
  currentPage.value = val
  // 这里可以重新加载数据
}

// 初始化时设置总数
onMounted(() => {
  // 计算总数 = 前三名 + 表格数据
  total.value = topThree.value.length + tableData.value.length
})
</script>

<style scoped>
.ranking-list {
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

.ranking-container {
  flex: 1;
  padding: 20px;
  overflow: auto;
}

.top-three {
  display: flex;
  justify-content: space-around;
  margin-bottom: 40px;
  padding: 20px;
}

.rank-card {
  position: relative;
  width: 280px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  text-align: center;
}

.rank-1 {
  transform: scale(1.1);
  border: 2px solid #FFD700;
}

.rank-2 {
  border: 2px solid #C0C0C0;
}

.rank-3 {
  border: 2px solid #CD7F32;
}

.rank-number {
  position: absolute;
  top: -10px;
  left: -10px;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  background: #1890ff;
  color: white;
  border-radius: 50%;
  font-weight: bold;
}

.info {
  margin: 15px 0;
}

.info .name {
  font-size: 18px;
  font-weight: bold;
}

.info .platform {
  color: #666;
  margin: 5px 0;
}

.stats {
  display: flex;
  justify-content: space-around;
  margin-top: 15px;
}

.stat-item {
  text-align: center;
}

.stat-item .label {
  color: #666;
  font-size: 12px;
}

.stat-item .value {
  font-weight: bold;
  color: #1890ff;
}

.rank-list {
  background: white;
  padding: 20px;
  border-radius: 8px;
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

.interaction-data {
  display: flex;
  gap: 15px;
}

.text-success {
  color: #67C23A;
}

.text-danger {
  color: #F56C6C;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-form--inline .el-form-item) {
  margin-right: 20px;
}

:deep(.el-select .el-input__wrapper),
:deep(.el-date-editor .el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
}

:deep(.el-select .el-input__wrapper:hover),
:deep(.el-date-editor .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #409eff inset;
}
</style> 