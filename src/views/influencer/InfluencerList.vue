<template>
  <div class="influencer-list">
    <!-- 搜索区域 -->
    <div class="search-area">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="类型">
          <el-select v-model="searchForm.type" placeholder="全部">
            <el-option label="全部" value="" />
            <el-option label="主播" value="1" />
            <el-option label="达人" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部">
            <el-option label="全部" value="" />
            <el-option label="在线" value="1" />
            <el-option label="离线" value="0" />
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
      <el-button type="primary">
        <el-icon><Plus /></el-icon>新增达人
      </el-button>
      <el-button type="danger">
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
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column prop="name" label="达人名称" />
        <el-table-column prop="type" label="类型">
          <template #default="{ row }">
            <el-tag :type="row.type === '1' ? 'success' : 'warning'">
              {{ row.type === '1' ? '主播' : '达人' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="platform" label="平台" />
        <el-table-column prop="fans" label="粉丝数" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === '1' ? 'success' : 'info'">
              {{ row.status === '1' ? '在线' : '离线' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link>
              <el-icon><Edit /></el-icon>编辑
            </el-button>
            <el-button type="primary" link>
              <el-icon><Message /></el-icon>私信
            </el-button>
            <el-button type="danger" link>
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
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Plus, Edit, Delete, Message } from '@element-plus/icons-vue'

// 搜索表单
const searchForm = reactive({
  type: '',
  status: '',
  keyword: ''
})

// 表格数据
const loading = ref(false)
const tableData = ref([
  {
    name: '测试达人1',
    type: '1',
    platform: '抖音',
    fans: '100万',
    status: '1'
  },
  // 添加更多测试数据...
])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 方法
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
  // 重新加载数据
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  // 重新加载数据
}
</script>

<style scoped>
.influencer-list {
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

:deep(.el-table) {
  flex: 1;
}

/* 优化表格样式 */
:deep(.el-table__header) {
  th {
    background-color: #f5f7fa;
    color: #606266;
    font-weight: 500;
    padding: 12px 0;
  }
}

:deep(.el-table__body) {
  td {
    padding: 8px 0;
  }
}

/* 表格内图标和文字对齐 */
:deep(.el-button--link) {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* 搜索区域样式优化 */
.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-left: 0;
}

:deep(.el-form-item) {
  margin-bottom: 0;
  margin-right: 12px;
}

:deep(.el-form-item__label) {
  font-weight: normal;
}

/* 表格容器滚动优化 */
:deep(.el-table__body-wrapper) {
  overflow-y: auto;
}

/* 表格固定列阴影优化 */
:deep(.el-table__fixed-right) {
  height: 100% !important;
  box-shadow: -6px 0 6px -4px rgba(0,0,0,.12);
}

/* 表格hover效果优化 */
:deep(.el-table__row:hover) {
  td {
    background-color: #f5f7fa !important;
  }
}
</style> 