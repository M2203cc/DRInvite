<template>
  <el-menu
    class="sidebar-menu"
    background-color="#304156"
    text-color="#fff"
    active-text-color="#409EFF"
    router
  >
    <el-menu-item index="/influencers">
      <el-icon><User /></el-icon>
      <span>达人管理</span>
    </el-menu-item>
    <el-sub-menu index="invitation">
      <template #title>
        <el-icon><Message /></el-icon>
        <span>邀约管理</span>
      </template>
      <el-menu-item index="/invitation/batch">批量邀约</el-menu-item>
      <el-menu-item index="/invitation/direct">定向邀约</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="/chat">
      <el-icon><ChatLineRound /></el-icon>
      <span>私信管理</span>
    </el-menu-item>
    <el-menu-item index="/blacklist">
      <el-icon><Warning /></el-icon>
      <span>黑名单管理</span>
    </el-menu-item>
    <el-menu-item index="/profile">
      <el-icon><Setting /></el-icon>
      <span>个人中心</span>
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import {
  User,
  Message,
  ChatLineRound,
  Warning,
  Setting
} from '@element-plus/icons-vue'
</script>

<style scoped>
.sidebar-menu {
  height: 100%;
  border-right: none;
}
</style> 