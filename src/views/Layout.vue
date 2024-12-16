<template>
  <div class="app-wrapper">
    <div class="sidebar">
      <el-menu
        class="sidebar-menu"
        background-color="#1d1e26"
        text-color="#fff"
        active-text-color="#409EFF"
        :default-active="$route.path"
        router
      >
        <el-menu-item index="/home">
          <el-icon><HomeFilled /></el-icon>
          <span>主页</span>
        </el-menu-item>
        <el-sub-menu index="account">
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>账号管理</span>
          </template>
          <el-menu-item index="/account/users">账号管理</el-menu-item>
          <el-menu-item index="/account/shops">店铺管理</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="influencers">
          <template #title>
            <el-icon><User /></el-icon>
            <span>达人管理</span>
          </template>
          <el-menu-item index="/influencers/chat">达人私聊</el-menu-item>
          <el-menu-item index="/influencers/ranking">达人排行榜</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="invitation">
          <template #title>
            <el-icon><Message /></el-icon>
            <span>邀约管理</span>
          </template>
          <el-menu-item index="/invitation">商品邀约</el-menu-item>
          <el-menu-item index="/invitation/plans">计划管理</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/chat">
          <el-icon><ChatRound /></el-icon>
          <span>达人消息</span>
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
    </div>
    <div class="main-container">
      <div class="header">
        <div class="header-right">
          <el-dropdown>
            <span class="user-info">
              {{ userInfo.nickname || '用户' }}
              <el-icon class="el-icon--right"><CaretBottom /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleToProfile">个人中心</el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="main-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { User, Message, ChatRound, Warning, Setting, CaretBottom, UserFilled, HomeFilled } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ref, onMounted } from 'vue'

const router = useRouter()

const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || '{}'))

const handleToProfile = () => {
  router.push('/profile')
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  ElMessage.success('退出成功')
  router.push('/login')
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-wrapper {
  display: flex;
  width: 100%;
  height: 100vh;
}

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 200px;
  background-color: #1d1e26;
  z-index: 1000;
}

.sidebar-menu {
  height: 100%;
  border-right: none;
  background-color: #1d1e26;
}

.main-container {
  flex: 1;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 200px;
  top: 0;
  right: 0;
  bottom: 0;
  padding: 0;
  overflow: hidden;
}

.header {
  height: 50px;
  background: white;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  display: flex;
  align-items: center;
  padding-right: 20px;
  justify-content: flex-end;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #606266;
}

.main-content {
  flex: 1;
  background-color: #f5f7fa;
  padding: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: auto;
}

:deep(.el-menu) {
  border-right: none;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  display: flex;
  align-items: center;
  height: 50px;
  line-height: 50px;
}

:deep(.el-menu-item .el-icon),
:deep(.el-sub-menu__title .el-icon) {
  margin-right: 10px;
  font-size: 18px;
}

:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background-color: #2d2e3d !important;
}

:deep(.el-menu-item.is-active) {
  background-color: rgba(64, 158, 255, 0.1) !important;
  color: #409EFF !important;
  border-left: 4px solid #409EFF;
}

:deep(.el-sub-menu .el-menu-item) {
  min-width: 200px;
  background-color: #1d1e26;
}

:deep(.el-sub-menu .el-menu-item:hover) {
  background-color: #2d2e3d !important;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  transition: all 0.3s ease;
}

:deep(.el-sub-menu.is-opened) {
  background-color: rgba(0, 0, 0, 0.1);
}

:deep(.el-menu-item.is-active:not(.is-sub-menu)) {
  padding-left: 16px !important;
}

:deep(.el-tabs__header) {
  margin: 0;
}

:deep(.el-tabs__content) {
  padding: 0;
}
</style> 