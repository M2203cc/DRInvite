<template>
  <div class="invitation-management">
    <!-- 搜索区域 -->
    <div class="search-area">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="账号类型">
          <el-select v-model="searchForm.accountType" placeholder="全部" style="width: 160px">
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
        <el-form-item label="店铺">
          <el-select v-model="searchForm.shop" placeholder="请选择店铺" style="width: 160px">
            <el-option label="全部" value="" />
            <el-option label="天猫" value="1" />
            <el-option label="京东" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 计划信息表单 -->
      <el-divider />
      <el-form :inline="true" :model="planForm" class="plan-form">
        <el-form-item label="计划名称">
          <el-input 
            v-model="planForm.name" 
            placeholder="请输入计划名称"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="planForm.endTime"
            type="datetime"
            placeholder="选择结束时间"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input 
            v-model="planForm.contact" 
            placeholder="请输入联系方式"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item>
          <el-button 
            type="success" 
            :disabled="!canCreatePlan"
            @click="handleCreatePlan"
          >
            <el-icon><Plus /></el-icon>创建计划
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 商品区域 -->
    <div class="section-container">
      <div class="section-header">
        <div class="left-buttons">
          <el-button type="primary" @click="handleAddProduct">
            <el-icon><Plus /></el-icon>添加商品
          </el-button>
          <el-button type="danger" @click="handleDeleteProduct">
            <el-icon><Delete /></el-icon>删除商品
          </el-button>
          <div class="commission-input">
            <el-input-number
              v-model="commission"
              :min="0"
              :max="100"
              :precision="2"
              style="width: 180px"
              controls-position="right"
              @change="handleCommissionChange"
            >
              <template #prefix>
                <span class="commission-label">佣金率：</span>
              </template>
              <template #suffix>%</template>
            </el-input-number>
            <span class="commission-tip">
              提示：勾选商品，批量修改佣金率
            </span>
          </div>
        </div>
      </div>

      <!-- 商品表格 -->
      <el-table
        :data="productData"
        style="width: 100%"
        border
        @selection-change="handleProductSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column prop="productId" label="产品ID" width="120" />
        <el-table-column prop="productName" label="产品名称" />
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
        <el-table-column prop="estimatedCommission" label="预估佣金" width="120">
          <template #default="{ row }">
            ¥{{ (row.price * row.commissionRate / 100).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="danger" link @click="handleDeleteSingleProduct(row)">
              <el-icon><Delete /></el-icon>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 达人列表区域 -->
    <div class="section-container">
      <div class="section-header">
        <div class="left-buttons">
          <el-button type="primary" @click="handleSearchInfluencer">
            <el-icon><Search /></el-icon>查找达人
          </el-button>
          <el-button type="danger" @click="handleClearInfluencers">
            <el-icon><Delete /></el-icon>清空达人
          </el-button>
        </div>
      </div>
      
      <!-- 达人表格 -->
      <el-table
        :data="influencerData"
        style="width: 100%"
        border
        @selection-change="handleInfluencerSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="influencerId" label="达人ID" align="center" />
        <el-table-column prop="name" label="达人名称" align="center" />
        <el-table-column prop="fansCount" label="粉丝数" align="center">
          <template #default="{ row }">
            {{ formatNumber(row.fansCount) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template #default="{ row }">
            <el-button type="danger" link @click="handleRemoveInfluencer(row)">
              <el-icon><Delete /></el-icon>移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 查找达人对话框 -->
    <el-dialog
      title="查找达人"
      v-model="searchDialogVisible"
      width="1200px"
      :close-on-click-modal="false"
    >
      <div class="search-dialog-content">
        <el-form :inline="true" :model="influencerSearchForm" class="search-form">
          <el-form-item label="平台">
            <el-select 
              v-model="influencerSearchForm.platform" 
              placeholder="请选择平台" 
              style="width: 160px"
              @change="handlePlatformChange"
            >
              <el-option label="全部" value="" />
              <el-option label="抖音" value="1" />
              <el-option label="快手" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="排序">
            <el-select 
              v-model="influencerSearchForm.sortBy" 
              placeholder="请选择排序方式" 
              style="width: 160px"
              @change="handleSortChange"
            >
              <el-option label="粉丝数" value="fans" />
              <el-option label="点赞数" value="likes" />
              <el-option label="评论数" value="comments" />
              <el-option label="转发数" value="shares" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="searchKeyword"
              placeholder="请输入达人ID或名称"
              clearable
              @input="handleSearchInfluencers"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
        
        <el-table
          :data="searchResults"
          style="width: 100%; margin-top: 20px"
          border
          v-loading="searching"
        >
          <el-table-column type="index" label="序号" width="80" align="center" />
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
          <el-table-column label="操作" width="120" align="center">
            <template #default="{ row }">
              <el-button 
                type="primary" 
                link 
                :disabled="isInfluencerAdded(row)"
                @click="handleAddInfluencer(row)"
              >
                {{ isInfluencerAdded(row) ? '已添加' : '添加' }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!-- 添加商品对话框 -->
    <el-dialog
      v-model="addProductDialogVisible"
      title="添加商品"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      destroy-on-close
    >
      <el-form
        ref="productFormRef"
        :model="productForm"
        :rules="productRules"
        label-width="100px"
        class="product-form"
        status-icon
      >
        <el-form-item label="商品名称" prop="productName">
          <el-input 
            v-model="productForm.productName" 
            placeholder="请输入商品名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="商品ID" prop="productId">
          <el-input 
            v-model="productForm.productId" 
            placeholder="请输入商品ID"
            clearable
          />
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input-number 
            v-model="productForm.price" 
            :precision="2" 
            :step="0.1" 
            :min="0"
            style="width: 100%"
            placeholder="请输入商品价格"
          />
        </el-form-item>
        <el-form-item label="佣金比例" prop="commissionRate">
          <el-input-number 
            v-model="productForm.commissionRate" 
            :precision="1" 
            :step="0.1" 
            :min="0"
            :max="100"
            style="width: 100%"
            placeholder="请输入佣金比例"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addProductDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitAddProduct">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Plus, Delete, Share, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PlanManagement from './PlanManagement.vue'

// 搜索表单
const searchForm = reactive({
  accountType: '',
  region: [],
  account: '',
  shop: ''
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
  // ... 其他地区数据
]

// 佣金率
const commission = ref(0)

// 商品相关数据
const productData = ref([
  {
    productId: 'P001',
    productName: '测试商品1',
    price: 199.99,
    commissionRate: 10,
  },
  {
    productId: 'P002',
    productName: '测试商品2',
    price: 299.99,
    commissionRate: 15,
  }
])
const selectedProducts = ref([])

// 邀请相关
const inviteDialogVisible = ref(false)
const currentProduct = ref(null)
const influencerSearchKeyword = ref('')

// 达人数据
const influencerData = ref([
  {
    influencerId: 'INF001',
    name: '达人A',
    fansCount: 1000000
  },
  {
    influencerId: 'INF002',
    name: '达人B',
    fansCount: 500000
  }
])

// 查找达人相关
const searchDialogVisible = ref(false)
const searchKeyword = ref('')
const searching = ref(false)
const searchResults = ref([
  {
    id: 1,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
    name: '生活达人C',
    platform: '抖音',
    fansCount: 3000000,
    likes: 1500000,
    comments: 100000,
    shares: 50000,
    growth: 5.2
  },
  {
    id: 2,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lily',
    name: '时尚达人A',
    platform: '抖音',
    fansCount: 2500000,
    likes: 1200000,
    comments: 80000,
    shares: 30000,
    growth: 4.8
  },
  {
    id: 3,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
    name: '美妆博主B',
    platform: '快手',
    fansCount: 1800000,
    likes: 900000,
    comments: 60000,
    shares: 40000,
    growth: 3.5
  },
  {
    id: 4,
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
    id: 5,
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

// 搜索商品方法
const handleSearch = () => {
  // 实现搜索逻辑
  console.log('搜索条件:', searchForm)
}

const resetSearch = () => {
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = ''
  })
}

// 添加商品相关变量
const addProductDialogVisible = ref(false)
const productFormRef = ref(null)
const productForm = reactive({
  productName: '',
  productId: '',
  price: 0,
  commissionRate: 0
})

// 表单验证规则
const productRules = {
  productName: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  productId: [
    { required: true, message: '请输入商品ID', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入商品价格', trigger: 'blur' }
  ],
  commissionRate: [
    { required: true, message: '请输入佣金比例', trigger: 'blur' }
  ]
}

// 修改添加商品方法
const handleAddProduct = () => {
  addProductDialogVisible.value = true
  // 重置表单
  productForm.productName = ''
  productForm.productId = ''
  productForm.price = 0
  productForm.commissionRate = 0
}

// 添加提交方法
const submitAddProduct = async () => {
  if (!productFormRef.value) return
  
  await productFormRef.value.validate((valid) => {
    if (valid) {
      // 创建新商品对象
      const newProduct = {
        productId: productForm.productId,
        productName: productForm.productName,
        price: productForm.price,
        commissionRate: productForm.commissionRate
      }
      
      // 添加到商品列表
      productData.value.push(newProduct)
      
      ElMessage.success('添加商品成功')
      addProductDialogVisible.value = false
    }
  })
}

// 商品相关方法
const handleDeleteProduct = () => {
  if (selectedProducts.value.length === 0) {
    ElMessage.warning('请选择要删除的商品')
    return
  }
  ElMessageBox.confirm(`确定要删除选中的 ${selectedProducts.value.length} 个商品吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 实现批量删除逻辑
    const selectedIds = selectedProducts.value.map(item => item.productId)
    productData.value = productData.value.filter(item => !selectedIds.includes(item.productId))
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handleDeleteSingleProduct = (row) => {
  ElMessageBox.confirm('确定要删除该商品吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    productData.value = productData.value.filter(item => item.productId !== row.productId)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handleProductSelectionChange = (selection) => {
  selectedProducts.value = selection
}

// 打开邀请对话框
const handleInvite = (product) => {
  currentProduct.value = product
  inviteDialogVisible.value = true
}

// 查找达人
const handleSearchInfluencer = () => {
  searchDialogVisible.value = true
  searchKeyword.value = ''
  searchResults.value = [
    {
      id: 1,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
      name: '生活达人C',
      platform: '抖音',
      fansCount: 3000000,
      likes: 1500000,
      comments: 100000,
      shares: 50000,
      growth: 5.2
    },
    {
      id: 2,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lily',
      name: '时尚达人A',
      platform: '抖音',
      fansCount: 2500000,
      likes: 1200000,
      comments: 80000,
      shares: 30000,
      growth: 4.8
    },
    {
      id: 3,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
      name: '美妆博主B',
      platform: '快手',
      fansCount: 1800000,
      likes: 900000,
      comments: 60000,
      shares: 40000,
      growth: 3.5
    },
    {
      id: 4,
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
      id: 5,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
      name: '科技达人D',
      platform: '快手',
      fansCount: 800000,
      likes: 400000,
      comments: 30000,
      shares: 15000,
      growth: 3.8
    }
  ]
}

// 搜索处理
const handleSearchInfluencers = async () => {
  if (!searchKeyword.value) {
    // 显示所有数据
    searchResults.value = [
      {
        id: 1,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
        name: '生活达人C',
        platform: '抖音',
        fansCount: 3000000,
        likes: 1500000,
        comments: 100000,
        shares: 50000,
        growth: 5.2
      },
      {
        id: 2,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lily',
        name: '时尚达人A',
        platform: '抖音',
        fansCount: 2500000,
        likes: 1200000,
        comments: 80000,
        shares: 30000,
        growth: 4.8
      },
      {
        id: 3,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
        name: '美妆博主B',
        platform: '快手',
        fansCount: 1800000,
        likes: 900000,
        comments: 60000,
        shares: 40000,
        growth: 3.5
      },
      {
        id: 4,
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
        id: 5,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
        name: '科技达人D',
        platform: '快手',
        fansCount: 800000,
        likes: 400000,
        comments: 30000,
        shares: 15000,
        growth: 3.8
      }
    ]
    return
  }
  
  searching.value = true
  try {
    // 模拟搜索请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    // 根据关键词过滤数据
    searchResults.value = searchResults.value.filter(item =>
      item.name.includes(searchKeyword.value) ||
      item.platform.includes(searchKeyword.value)
    )
  } finally {
    searching.value = false
  }
}

// 处理平台和排序方式变化
const handlePlatformChange = () => {
  const results = [...searchResults.value]
  if (influencerSearchForm.platform) {
    results = results.filter(item => item.platform === influencerSearchForm.platform)
  }
  searchResults.value = results
}

const handleSortChange = () => {
  const results = [...searchResults.value]
  switch (influencerSearchForm.sortBy) {
    case 'fans':
      results.sort((a, b) => b.fansCount - a.fansCount)
      break
    case 'likes':
      results.sort((a, b) => b.likes - a.likes)
      break
    case 'comments':
      results.sort((a, b) => b.comments - a.comments)
      break
    case 'shares':
      results.sort((a, b) => b.shares - a.shares)
      break
  }
  searchResults.value = results
}

// 检查达人是否已添加
const isInfluencerAdded = (influencer) => {
  return influencerData.value.some(item => item.influencerId === influencer.influencerId)
}

// 添加达人
const handleAddInfluencer = (influencer) => {
  if (!isInfluencerAdded(influencer)) {
    influencerData.value.push(influencer)
    ElMessage.success('添加成功')
  }
}

// 移除达人
const handleRemoveInfluencer = (influencer) => {
  ElMessageBox.confirm('确定要移除该达人吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    influencerData.value = influencerData.value.filter(
      item => item.influencerId !== influencer.influencerId
    )
    ElMessage.success('移除成功')
  }).catch(() => {})
}

// 清空达人
const handleClearInfluencers = () => {
  if (influencerData.value.length === 0) {
    ElMessage.warning('暂无达人可清空')
    return
  }
  
  ElMessageBox.confirm('确定要清空所有达人吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    influencerData.value = []
    ElMessage.success('清空成功')
  }).catch(() => {})
}

// 表格选择
const handleInfluencerSelectionChange = (selection) => {
  console.log('选中的达人:', selection)
}

// 计划表单
const planForm = reactive({
  name: '',
  endTime: '',
  contact: ''
})

// 达人搜索表单
const influencerSearchForm = reactive({
  platform: '',
  sortBy: 'fans'
})

// 判断是否可以创建计划
const canCreatePlan = computed(() => {
  return planForm.name && 
         planForm.endTime && 
         planForm.contact && 
         (selectedProducts.value.length > 0 || influencerData.value.length > 0)
})

// 创建计划
const handleCreatePlan = () => {
  ElMessageBox.confirm('确定要创建计划吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    // 创建新计划
    const newPlan = {
      id: Date.now(),  // 使用时间戳作为临时ID
      ...planForm,
      products: selectedProducts.value,
      influencers: influencerData.value
    }
    
    // 获取现有计划列表
    const existingPlans = JSON.parse(localStorage.getItem('plans') || '[]')
    // 添加新计划
    existingPlans.push(newPlan)
    // 保存到localStorage
    localStorage.setItem('plans', JSON.stringify(existingPlans))
    
    // 清空选中状态和达人列表
    selectedProducts.value = []
    influencerData.value = []
    
    // 重置计划表单
    planForm.name = ''
    planForm.endTime = ''
    planForm.contact = ''
    
    ElMessage.success('计划创建成功')
  }).catch(() => {})
}

// 处理佣金率变化
const handleCommissionChange = (value) => {
  if (selectedProducts.value.length === 0) {
    ElMessage.warning('请先勾选要修改佣金率的商品')
    return
  }
  
  ElMessageBox.confirm(
    `确定要将选中的 ${selectedProducts.value.length} 个商品的佣金率修改为 ${value}% 吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 更新选中商品的佣金率
    selectedProducts.value.forEach(product => {
      const targetProduct = productData.value.find(item => item.productId === product.productId)
      if (targetProduct) {
        targetProduct.commissionRate = value
      }
    })
    ElMessage.success('佣金率修改成功')
  }).catch(() => {
    // 如果用户取消，将佣金率输入框的值重置为0
    commission.value = 0
  })
}
</script>

<style scoped>
.invitation-management {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100%;
}

.search-area {
  background: white;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.section-container {
  background: white;
  border-radius: 4px;
  margin-bottom: 20px;
}

.section-header {
  padding: 16px;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-buttons {
  display: flex;
  gap: 10px;
}

.commission-input {
  display: flex;
  align-items: center;
  margin-left: 16px;
  gap: 10px;
}

.commission-label {
  font-size: 12px;
  color: #606266;
}

:deep(.el-table) {
  margin: 16px 0;
}

:deep(.el-form--inline .el-form-item) {
  margin-right: 20px;
}

:deep(.el-input-number .el-input__wrapper) {
  padding-left: 0;
  padding-right: 30px;
}

:deep(.el-input-number .el-input__prefix) {
  padding-left: 8px;
}

:deep(.el-input-number .el-input__suffix) {
  padding-right: 8px;
}

.invite-dialog-content {
  padding: 0 20px;
}

.dialog-search {
  margin-bottom: 20px;
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

.search-dialog-content {
  padding: 0 20px;
  max-height: 600px;
  overflow-y: auto;
}

.interaction-data {
  display: flex;
  gap: 15px;
}

.interaction-data span {
  color: #666;
  font-size: 13px;
}

.plan-form {
  margin-top: 16px;
}

.el-divider {
  margin: 16px 0;
}

.commission-tip {
  color: #909399;
  font-size: 12px;
}
</style>