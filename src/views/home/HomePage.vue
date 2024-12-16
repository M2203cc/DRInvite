<template>
  <div class="home-page">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <h2>欢迎使用跨境电商达人邀约管理系统</h2>
      <p>当前时间：{{ currentTime }}</p>
    </div>

    <!-- 数据概览 -->
    <div class="data-overview">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="data-card">
            <template #header>
              <div class="card-header">
                <span>达人总数</span>
                <el-icon><User /></el-icon>
              </div>
            </template>
            <div class="card-value">{{ statistics.influencerCount }}</div>
            <div class="card-trend">
              较上月 <span class="up">+{{ statistics.influencerGrowth }}%</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="data-card">
            <template #header>
              <div class="card-header">
                <span>本月邀约数</span>
                <el-icon><Message /></el-icon>
              </div>
            </template>
            <div class="card-value">{{ statistics.invitationCount }}</div>
            <div class="card-trend">
              较上月 <span class="up">+{{ statistics.invitationGrowth }}%</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="data-card">
            <template #header>
              <div class="card-header">
                <span>合作达人数</span>
                <el-icon><UserFilled /></el-icon>
              </div>
            </template>
            <div class="card-value">{{ statistics.cooperationCount }}</div>
            <div class="card-trend">
              较上月 <span class="up">+{{ statistics.cooperationGrowth }}%</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="data-card">
            <template #header>
              <div class="card-header">
                <span>私信回复率</span>
                <el-icon><ChatDotRound /></el-icon>
              </div>
            </template>
            <div class="card-value">{{ statistics.replyRate }}%</div>
            <div class="card-trend">
              较上月 <span class="down">-{{ statistics.replyRateChange }}%</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <div class="card-header">
                <span>达人平台分布</span>
              </div>
            </template>
            <div class="chart-container" ref="platformChartRef"></div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <div class="card-header">
                <span>邀约趋势</span>
              </div>
            </template>
            <div class="chart-container" ref="trendChartRef"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 最近活动 -->
    <div class="recent-activities">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>最近活动</span>
          </div>
        </template>
        <div class="activity-list">
          <div v-for="(activity, index) in activities" :key="index" class="activity-item">
            <el-tag :type="activity.type" size="small">{{ activity.tag }}</el-tag>
            <span class="activity-content">{{ activity.content }}</span>
            <span class="activity-time">{{ activity.time }}</span>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { User, Message, UserFilled, ChatDotRound } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const currentTime = ref(new Date().toLocaleString())
const platformChartRef = ref(null)
const trendChartRef = ref(null)
let platformChart = null
let trendChart = null

// 统计数据
const statistics = ref({
  influencerCount: 1234,
  influencerGrowth: 15,
  invitationCount: 856,
  invitationGrowth: 23,
  cooperationCount: 432,
  cooperationGrowth: 18,
  replyRate: 85,
  replyRateChange: 2
})

// 最近活动数据
const activities = ref([
  {
    type: 'success',
    tag: '邀约成功',
    content: '成功邀约达人"美妆达人A"进行商品推广',
    time: '10分钟前'
  },
  {
    type: 'warning',
    tag: '新增达人',
    content: '新增达人"时尚博主B"到数据库',
    time: '30分钟前'
  },
  {
    type: 'info',
    tag: '私信回复',
    content: '达人"生活达人C"回复了您的私信',
    time: '1小时前'
  },
  {
    type: 'danger',
    tag: '黑名单',
    content: '将达人"问题达人D"加入黑名单',
    time: '2小时前'
  }
])

// 更新时间
const updateTime = () => {
  currentTime.value = new Date().toLocaleString()
}

// 初始化平台分布图表
const initPlatformChart = () => {
  platformChart = echarts.init(platformChartRef.value)
  platformChart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center'
    },
    series: [
      {
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false
        },
        data: [
          { value: 735, name: '抖音' },
          { value: 580, name: '快手' },
          { value: 484, name: '小红书' },
          { value: 300, name: 'B站' }
        ]
      }
    ]
  })
}

// 初始化邀约趋势图表
const initTrendChart = () => {
  trendChart = echarts.init(trendChartRef.value)
  trendChart.setOption({
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line',
        smooth: true
      }
    ]
  })
}

// 监听窗口大小变化
const handleResize = () => {
  platformChart?.resize()
  trendChart?.resize()
}

onMounted(() => {
  // 每秒更新时间
  setInterval(updateTime, 1000)
  
  // 初始化图表
  initPlatformChart()
  initTrendChart()
  
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.home-page {
  padding: 20px;
  height: 100%;
  overflow: auto;
}

.welcome-section {
  margin-bottom: 30px;
  padding: 0 10px;
}

.welcome-section h2 {
  margin: 0;
  color: #303133;
}

.welcome-section p {
  margin: 10px 0;
  color: #909399;
}

.data-overview {
  margin-bottom: 30px;
}

.data-card {
  min-height: 160px;
  transition: all 0.3s;
  margin-bottom: 10px;
}

.data-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  padding: 15px;
  border-bottom: 1px solid #ebeef5;
}

.card-value {
  font-size: 28px;
  font-weight: bold;
  margin: 20px 0;
  color: #303133;
  text-align: center;
}

.card-trend {
  color: #909399;
  font-size: 14px;
  text-align: center;
  padding-bottom: 15px;
}

.up {
  color: #67C23A;
  font-weight: bold;
}

.down {
  color: #F56C6C;
  font-weight: bold;
}

.charts-section {
  margin-bottom: 30px;
}

.chart-card {
  margin-bottom: 20px;
}

.chart-container {
  height: 300px;
  padding: 20px;
}

.activity-list {
  padding: 0 20px;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #ebeef5;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-content {
  flex: 1;
  margin: 0 15px;
}

.activity-time {
  color: #909399;
  font-size: 13px;
}
</style> 