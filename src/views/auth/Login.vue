<template>
  <div class="login-container" style="background: linear-gradient(120deg, #3f51b5, #2196f3);">
    <!-- 顶部导航 -->
    <div class="nav-header">
      <div class="nav-menu">
        <span>首页</span>
        <span>解决方案</span>
        <span>合作咨询</span>
        <span>技术支持</span>
        <span>关于我们</span>
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="main-content">
      <!-- 登录框 -->
      <div class="login-box">
        <div class="login-title">
          <span>登录</span>
        </div>
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名/手机号"
              size="large"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              size="large"
              show-password
              @keyup.enter="handleLogin"
            />
          </el-form-item>
          <div class="form-footer">
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
          <el-button
            type="primary"
            class="login-button"
            size="large"
            :loading="loading"
            @click="handleLogin"
          >
            登录
          </el-button>
          <div class="register-link">
            <span>还没有账号？</span>
            <el-link type="primary" :underline="false" @click="$router.push('/register')">
              立即注册
            </el-link>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loginFormRef = ref(null)
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

// 先定义验证函数
const validateUsername = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入用户名/手机号'))
  } else if (/^1[3-9]\d{9}$/.test(value)) {
    // 是手机号格式
    callback()
  } else if (value.length >= 3) {
    // 是用户名格式（至少3个字符）
    callback()
  } else {
    callback(new Error('用户名长度不能小于3位'))
  }
}

// 然后再使用验证函数
const loginRules = {
  username: [
    { required: true, message: '请输入用户名/手机号', trigger: 'blur' },
    { validator: validateUsername, trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  try {
    await loginFormRef.value.validate()
    loading.value = true
    // 模拟登录请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    // 保存用户信息
    const userInfo = {
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      account: loginForm.username,
      nickname: loginForm.username,
      memberType: 'VIP',
      expiryDate: '2024-12-31',
      invitationCount: 50,
      invitationLimit: 100,
      messageCount: 200,
      messageLimit: 500
    }
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
    localStorage.setItem('token', 'dummy-token')
    ElMessage.success('登录成功')
    router.push('/home')
  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error('登录失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
</style>

<style scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(120deg, #00acc1, #0288d1);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.nav-header {
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 40px;
  color: white;
}

.nav-menu {
  display: flex;
  gap: 40px;
}

.nav-menu span {
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.3s;
}

.nav-menu span:hover {
  opacity: 1;
}

.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
}

.login-box {
  width: 400px;
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 20px;
  color: #333;
}

.login-form {
  margin-top: 20px;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  margin: 10px 0 20px;
}

.login-button {
  width: 100%;
  height: 40px;
  background: #3f51b5;
  border-color: #3f51b5;
}

.login-button:hover {
  background: #2196f3;
  border-color: #2196f3;
}

.register-link {
  margin-top: 16px;
  text-align: center;
  color: #666;
}

:deep(.el-input__wrapper) {
  background-color: #f5f7fa;
  box-shadow: none !important;
  border: none;
}

:deep(.el-input__wrapper:hover),
:deep(.el-input__wrapper.is-focus) {
  background-color: #eef0f6;
}

@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }
  
  .login-box {
    width: 100%;
    max-width: 400px;
  }
}
</style> 