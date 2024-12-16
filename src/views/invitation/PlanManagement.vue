<template>
  <div class="plan-management">
    <!-- 搜索区域 -->
    <div class="search-area">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="计划状态">
          <el-select v-model="searchForm.status" placeholder="全部状态" style="width: 160px">
            <el-option label="全部" value="" />
            <el-option label="未开始" value="未开始" />
            <el-option label="进行中" value="进行中" />
            <el-option label="已完成" value="已完成" />
            <el-option label="已取消" value="已取消" />
          </el-select>
        </el-form-item>
        <el-form-item label="计划名称">
          <el-input 
            v-model="searchForm.name" 
            placeholder="请输入计划名称"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 计划 -->
    <div class="table-container">
      <div class="operation-buttons">
        <el-button type="primary" @click="loadPlans">
          <el-icon><Refresh /></el-icon>刷新列表
        </el-button>
        <el-button type="warning" @click="handleCancelInvitation">
          <el-icon><Close /></el-icon>取消邀约
        </el-button>
        <el-button type="danger" @click="handleRemoveUnaccepted">
          <el-icon><Delete /></el-icon>删除未接受达人
        </el-button>
      </div>
      <el-table :data="planData" style="width: 100%" border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="name" label="计划名称" min-width="120" />
        <el-table-column label="计划内容" min-width="280">
          <template #default="{ row }">
            <div class="plan-content">
              <span>上次修改：{{ formatDate(row.updateTime || row.id) }}</span>
              <el-divider direction="vertical" />
              <span>{{ row.products?.length || 0 }}件商品</span>
              <el-divider direction="vertical" />
              <span>
                {{ hasInvited(row) ? 
                  `已邀请${row.influencers?.length || 0}位达人` : 
                  '还未邀请达人' 
                }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="已接受达人" align="center" width="120">
          <template #default="{ row }">
            {{ hasInvited(row) ? 
              `${getAcceptedCount(row)}/${row.influencers?.length || 0}` :
              '-'
            }}
          </template>
        </el-table-column>
        <el-table-column label="已推广达人" align="center" width="120">
          <template #default="{ row }">
            {{ hasInvited(row) ? 
              `${getPromotedCount(row)}/${row.influencers?.length || 0}` :
              '-'
            }}
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.endTime) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getPlanStatusType(row)">
              {{ getPlanStatus(row) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleViewDetails(row)">
              <el-icon><View /></el-icon>详情
            </el-button>
            <el-button type="danger" link @click="handleDelete(row)">
              <el-icon><Delete /></el-icon>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 详情对话框 -->
    <el-dialog
      title="计划详情"
      v-model="detailsVisible"
      width="800px"
    >
      <div class="plan-details">
        <div class="detail-section">
          <h3>基本信息</h3>
          <div class="info-item">
            <span class="label">计划名称：</span>
            <span>{{ currentPlan?.name }}</span>
          </div>
          <div class="info-item">
            <span class="label">结束时间：</span>
            <span>{{ formatDate(currentPlan?.endTime) }}</span>
          </div>
          <div class="info-item">
            <span class="label">状态：</span>
            <span>
              <el-tag :type="getPlanStatusType(currentPlan)">
                {{ getPlanStatus(currentPlan) }}
              </el-tag>
            </span>
          </div>
        </div>

        <el-divider />

        <div class="detail-section">
          <h3>商品信息</h3>
          <el-table :data="currentPlan?.products || []" border>
            <el-table-column type="index" label="序号" width="80" align="center" />
            <el-table-column prop="productName" label="商品名称" />
            <el-table-column prop="price" label="售价">
              <template #default="{ row }">
                ¥{{ row.price }}
              </template>
            </el-table-column>
            <el-table-column prop="commissionRate" label="佣金率">
              <template #default="{ row }">
                {{ row.commissionRate }}%
              </template>
            </el-table-column>
          </el-table>
        </div>

        <el-divider />

        <div class="detail-section">
          <div class="section-header">
            <h3>达人信息</h3>
            <el-button 
              type="primary" 
              @click="handleBatchInvite" 
              :disabled="!currentPlan?.influencers?.length"
            >
              <el-icon><Message /></el-icon>一键邀请达人
            </el-button>
          </div>
          <el-table :data="currentPlan?.influencers || []" border>
            <el-table-column type="index" label="序号" width="80" align="center" />
            <el-table-column prop="name" label="达人名称" />
            <el-table-column label="接受状态" width="100" align="center">
              <template #default="{ row }">
                <el-tag :type="row.acceptStatus ? 'success': 'info'">
                  {{ row.acceptStatus ? '已接受' : '未接受' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="推广状态" width="100" align="center">
              <template #default="{ row }">
                <el-tag :type="row.promoteStatus ? 'success' : 'info'">
                  {{ row.promoteStatus ? '已推广' : '未推广' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="fansCount" label="粉丝数">
              <template #default="{ row }">
                {{ formatNumber(row.fansCount) }}
              </template>
            </el-table-column>
            <el-table-column label="邀请状态" width="100" align="center">
              <template #default="{ row }">
                <el-tag :type="getInviteStatusType(row)">
                  {{ getInviteStatus(row) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" align="center">
              <template #default="{ row }">
                <el-button 
                  type="primary" 
                  link 
                  :disabled="row.inviteStatus && !row.cancelled"
                  @click="handleInviteSingle(row)"
                >
                  邀请
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { View, Delete, Message, Refresh, Close, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 搜索表单
const searchForm = reactive({
  name: '',
  status: ''
})

// 计划数据
const planData = ref([])

// 当前查看的计划
const currentPlan = ref(null)
const detailsVisible = ref(false)

// 选中的计划
const selectedPlans = ref([])

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString()
}

// 格式化数字
const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num.toString()
}

// 搜索方法
const handleSearch = () => {
  const allPlans = JSON.parse(localStorage.getItem('plans') || '[]')
  planData.value = allPlans.filter(plan => {
    const nameMatch = !searchForm.name || 
      plan.name.toLowerCase().includes(searchForm.name.toLowerCase())
    const statusMatch = !searchForm.status || 
      getPlanStatus(plan) === searchForm.status
    return nameMatch && statusMatch
  })
}

const resetSearch = () => {
  searchForm.name = ''
  loadPlans()
}

// 查看详情
const handleViewDetails = (row) => {
  currentPlan.value = row
  detailsVisible.value = true
}

// 删除计划
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该计划吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    planData.value = planData.value.filter(item => item.id !== row.id)
    localStorage.setItem('plans', JSON.stringify(planData.value))
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 加载计划数据
const loadPlans = () => {
  const plans = JSON.parse(localStorage.getItem('plans') || '[]')
  // 如果没有数据，添加一些测试数据
  if (plans.length === 0) {
    const testPlans = [
      {
        id: Date.now(),
        name: '测试计划1',
        products: [],
        influencers: [],
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天后
        updateTime: new Date()
      }
    ]
    localStorage.setItem('plans', JSON.stringify(testPlans))
    planData.value = testPlans
  } else {
    planData.value = plans
  }
}

// 一键邀请达人
const handleBatchInvite = () => {
  if (!currentPlan.value?.influencers?.length) {
    ElMessage.warning('暂无达人可邀请')
    return
  }

  ElMessageBox.confirm(
    `确定要邀请该计划中的 ${currentPlan.value.influencers.length} 位达人吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(() => {
    // 更新所有达人的邀请状态和随机的接受/推广状态
    currentPlan.value.influencers.forEach(influencer => {
      // 重置所有状态
      influencer.cancelled = false
      influencer.inviteStatus = true
      // 随机设置接受状态
      influencer.acceptStatus = Math.random() > 0.5
      // 如果接受了，随机设置推广状态
      if (influencer.acceptStatus) {
        influencer.promoteStatus = Math.random() > 0.5
      } else {
        influencer.promoteStatus = false
      }
    })

    // 更新本地存储中的计划数据
    const plans = JSON.parse(localStorage.getItem('plans') || '[]')
    const planIndex = plans.findIndex(p => p.id === currentPlan.value.id)
    if (planIndex !== -1) {
      plans[planIndex] = currentPlan.value
      localStorage.setItem('plans', JSON.stringify(plans))
    }

    ElMessage.success('邀请发送成功')
  }).catch(() => {})
}

// 邀请单个达人
const handleInviteSingle = (influencer) => {
  ElMessageBox.confirm(
    `确定要邀请达人"${influencer.name}"吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(() => {
    // 重置所有状态
    influencer.cancelled = false
    influencer.inviteStatus = true
    // 随机设置接受状态
    influencer.acceptStatus = Math.random() > 0.5
    // 如果接受了，随机设置推广状态
    if (influencer.acceptStatus) {
      influencer.promoteStatus = Math.random() > 0.5
    } else {
      influencer.promoteStatus = false
    }

    // 更新本地存储中的计划数据
    const plans = JSON.parse(localStorage.getItem('plans') || '[]')
    const planIndex = plans.findIndex(p => p.id === currentPlan.value.id)
    if (planIndex !== -1) {
      plans[planIndex] = currentPlan.value
      localStorage.setItem('plans', JSON.stringify(plans))
    }

    ElMessage.success('邀请发送成功')
  }).catch(() => {})
}

// 检查是否已邀请达人
const hasInvited = (plan) => {
  return plan.influencers?.some(influencer => influencer.inviteStatus) || false
}

// 获取已接受达人数量（随机生成，不超过总数）
const getAcceptedCount = (plan) => {
  if (!hasInvited(plan)) return 0
  return plan.influencers?.filter(inf => inf.acceptStatus)?.length || 0
}

// 获取已推广达人数量（不超过已接受量）
const getPromotedCount = (plan) => {
  if (!hasInvited(plan)) return 0
  return plan.influencers?.filter(inf => inf.promoteStatus)?.length || 0
}

// 获取计划状态
const getPlanStatus = (plan) => {
  if (plan.influencers?.some(inf => inf.cancelled)) {
    return '已取消'
  }
  
  if (!hasInvited(plan)) {
    return '未开始'
  }
  
  const totalCount = plan.influencers?.length || 0
  const acceptedCount = getAcceptedCount(plan)
  const promotedCount = getPromotedCount(plan)
  
  if (acceptedCount === totalCount && promotedCount === totalCount) {
    return '已完成'
  }
  
  return '进行中'
}

// 获取状态标签类型
const getPlanStatusType = (plan) => {
  const status = getPlanStatus(plan)
  switch (status) {
    case '未开始':
      return 'info'
    case '进行中':
      return 'warning'
    case '已完成':
      return 'success'
    case '已取消':
      return 'danger'
    default:
      return 'info'
  }
}

// 处理表格选择变化
const handleSelectionChange = (selection) => {
  selectedPlans.value = selection
}

// 取消邀约
const handleCancelInvitation = () => {
  if (selectedPlans.value.length === 0) {
    ElMessage.warning('请先选择要取消邀约的计划')
    return
  }
  
  const hasInvited = selectedPlans.value.some(plan => 
    plan.influencers?.some(inf => inf.inviteStatus && !inf.cancelled)
  )
  
  if (!hasInvited) {
    ElMessage.warning('没有可取消��邀约')
    return
  }

  ElMessageBox.confirm(
    `确定要取消选中的 ${selectedPlans.value.length} 个计划中的所有邀约吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    selectedPlans.value.forEach(plan => {
      plan.influencers?.forEach(inf => {
        if (inf.inviteStatus) {
          inf.inviteStatus = false
          inf.acceptStatus = false
          inf.promoteStatus = false
          inf.cancelled = true
        }
      })
    })

    localStorage.setItem('plans', JSON.stringify(planData.value))
    ElMessage.success('邀约已取消')
    loadPlans()
    selectedPlans.value = []
  })
}

// 删除未接受达人
const handleRemoveUnaccepted = () => {
  if (selectedPlans.value.length === 0) {
    ElMessage.warning('请先选择要操作的计划')
    return
  }

  const hasUnaccepted = selectedPlans.value.some(plan => 
    plan.influencers?.some(inf => inf.inviteStatus && !inf.acceptStatus && !inf.cancelled)
  )
  
  if (!hasUnaccepted) {
    ElMessage.warning('没有未接受的达人')
    return
  }

  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedPlans.value.length} 个计划中未接受邀约的达人吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    selectedPlans.value.forEach(plan => {
      plan.influencers = plan.influencers?.filter(inf => 
        (!inf.inviteStatus && !inf.cancelled) || inf.acceptStatus || inf.cancelled
      )
    })

    localStorage.setItem('plans', JSON.stringify(planData.value))
    ElMessage.success('未接受的达人已删除')
    loadPlans()
    selectedPlans.value = []
  })
}

// 在组件挂载时加载数据
onMounted(() => {
  loadPlans()
})

// 获取邀请状态显示文本
const getInviteStatus = (influencer) => {
  if (influencer.cancelled) {
    return '已取消'
  }
  return influencer.inviteStatus ? '已邀请' : '未邀请'
}

// 获取邀请状态标签类型
const getInviteStatusType = (influencer) => {
  if (influencer.cancelled) {
    return 'danger'
  }
  return influencer.inviteStatus ? 'success' : 'info'
}
</script>

<style scoped>
.plan-management {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-right: 20px;
}

.search-area,
.table-container {
  background: white;
  padding: 20px;
  border-radius: 4px;
  border: 1px solid #ebeef5;
}

.plan-details {
  padding: 0 20px;
}

.detail-section {
  margin-bottom: 20px;
}

.detail-section h3 {
  margin-bottom: 16px;
  font-size: 16px;
  color: #303133;
}

.info-item {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.info-item .label {
  width: 100px;
  color: #606266;
}

:deep(.el-table) {
  margin-top: 12px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3 {
  margin: 0;
}

.plan-content {
  display: flex;
  align-items: center;
  color: #606266;
  font-size: 14px;
}

.plan-content :deep(.el-divider--vertical) {
  margin: 0 12px;
}

.operation-buttons {
  margin-bottom: 16px;
  display: flex;
  gap: 10px;
}
</style> 