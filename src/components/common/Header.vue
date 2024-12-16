<template>
  <div class="navbar">
    <div class="right-menu">
      <el-dropdown>
        <span class="el-dropdown-link">
          管理员
          <el-icon class="el-icon--right"><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ArrowDown } from '@element-plus/icons-vue'
</script>

<style scoped>
.navbar {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
}

.right-menu {
  cursor: pointer;
}
</style> 