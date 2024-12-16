<template>
  <div class="register-container">
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
      <!-- 注册框 -->
      <div class="register-box">
        <div class="register-title">
          <span>注册账号</span>
        </div>
        <el-form
          ref="registerFormRef"
          :model="form"
          :rules="rules"
          class="register-form"
        >
          <el-form-item prop="username">
            <el-input
              v-model="form.username"
              placeholder="请输入用户名"
              size="large"
            />
          </el-form-item>
          <el-form-item prop="phone">
            <el-input
              v-model="form.phone"
              placeholder="请输入手机号"
              size="large"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              size="large"
              show-password
            />
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input
              v-model="form.confirmPassword"
              type="password"
              placeholder="请确认密码"
              size="large"
              show-password
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              class="submit-btn"
              :loading="loading"
              @click="handleRegister"
            >
              注册并登录
            </el-button>
          </el-form-item>
          <div class="login-link">
            <span>已有账号？</span>
            <el-link type="primary" :underline="false" @click="$router.push('/login')">
              去登录
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
const registerFormRef = ref(null)
const loading = ref(false)

const form = reactive({
  username: '',
  phone: '',
  password: '',
  confirmPassword: ''
})

const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== form.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名长度不能小于3位', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, trigger: 'blur', validator: validatePass2 }
  ]
}

const handleRegister = async () => {
  try {
    await registerFormRef.value.validate()
    loading.value = true
    // 模拟注册请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 保存用户信息
    const userInfo = {
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      account: form.username,
      nickname: form.username,
      memberType: 'VIP',
      expiryDate: '2024-12-31',
      invitationCount: 50,
      invitationLimit: 100,
      messageCount: 200,
      messageLimit: 500
    }
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
    localStorage.setItem('token', 'dummy-token')
    ElMessage.success('注册成功')
    router.push('/home')
  } catch (error) {
    console.error('注册失败:', error)
    ElMessage.error('注册失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  width: 100%;
  height: 100%;
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

.register-box {
  width: 400px;
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.register-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 20px;
  color: #333;
}

.register-form {
  margin-top: 20px;
}

.submit-btn {
  width: 100%;
  height: 40px;
  background: #3f51b5;
  border-color: #3f51b5;
  margin-top: 10px;
}

.submit-btn:hover {
  background: #2196f3;
  border-color: #2196f3;
}

.login-link {
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
  
  .register-box {
    width: 100%;
    max-width: 400px;
  }
}
</style> 