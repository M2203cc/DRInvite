<template>
  <div class="user-profile">
    <el-card class="profile-card">
      <div class="profile-header">
        <div class="avatar-container">
          <el-avatar :size="100" :src="userInfo.avatar" @click="handleAvatarClick" />
          <div class="avatar-hover-text">点击修改头像</div>
        </div>
        <div class="user-info">
          <div class="info-item">
            <span class="label">用户账号：</span>
            <span v-if="!isEditingAccount" class="value">{{ userInfo.account }}</span>
            <div v-else class="edit-input">
              <el-input v-model="editForm.account" size="small" />
              <div class="edit-buttons">
                <el-button type="primary" link size="small" @click="handleSaveAccount">保存</el-button>
                <el-button link size="small" @click="isEditingAccount = false">取消</el-button>
              </div>
            </div>
            <el-button v-if="!isEditingAccount" type="primary" link @click="handleEditAccount">
              修改
            </el-button>
          </div>
          <div class="info-item">
            <span class="label">用户昵称：</span>
            <span v-if="!isEditingNickname" class="value">{{ userInfo.nickname }}</span>
            <div v-else class="edit-input">
              <el-input v-model="editForm.nickname" size="small" />
              <div class="edit-buttons">
                <el-button type="primary" link size="small" @click="handleSaveNickname">保存</el-button>
                <el-button link size="small" @click="isEditingNickname = false">取消</el-button>
              </div>
            </div>
            <el-button v-if="!isEditingNickname" type="primary" link @click="handleEditNickname">
              修改
            </el-button>
          </div>
        </div>
      </div>

      <el-divider />

      <div class="profile-details">
        <div class="detail-item">
          <div class="detail-label">会员类型</div>
          <div class="detail-value">
            <el-tag :type="userInfo.memberType === 'VIP' ? 'success' : 'info'">
              {{ userInfo.memberType }}
            </el-tag>
          </div>
        </div>
        <div class="detail-item">
          <div class="detail-label">到期时间</div>
          <div class="detail-value">{{ userInfo.expiryDate }}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">达人邀约次数</div>
          <div class="detail-value">
            <el-tag type="warning">
              已用 {{ userInfo.invitationCount }}/{{ userInfo.invitationLimit }} 次
            </el-tag>
          </div>
        </div>
        <div class="detail-item">
          <div class="detail-label">达人私信次数</div>
          <div class="detail-value">
            <el-tag type="warning">
              已用 {{ userInfo.messageCount }}/{{ userInfo.messageLimit }} 次
            </el-tag>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 头像上传对话框 -->
    <el-dialog
      title="修改头像"
      v-model="avatarDialogVisible"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-upload
        class="avatar-uploader"
        :show-file-list="false"
        :before-upload="beforeAvatarUpload"
        :http-request="handleAvatarUpload"
      >
        <img v-if="previewAvatar" :src="previewAvatar" class="avatar-preview" />
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
      </el-upload>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="avatarDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveAvatar" :loading="uploadLoading">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 用户信息
const userInfo = reactive(JSON.parse(localStorage.getItem('userInfo') || '{}'))

// 编辑状态
const isEditingAccount = ref(false)
const isEditingNickname = ref(false)
const editForm = reactive({
  account: '',
  nickname: ''
})

// 头像上传相关
const avatarDialogVisible = ref(false)
const previewAvatar = ref('')
const uploadLoading = ref(false)

// 点击头像
const handleAvatarClick = () => {
  avatarDialogVisible.value = true
  previewAvatar.value = userInfo.avatar
}

// 头像上传前的验证
const beforeAvatarUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('头像只能是 JPG/PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('头像大小不能超过 2MB!')
    return false
  }
  return true
}

// 处理头像上传
const handleAvatarUpload = async (options) => {
  try {
    const reader = new FileReader()
    reader.onload = (e) => {
      previewAvatar.value = e.target.result
    }
    reader.readAsDataURL(options.file)
  } catch (error) {
    console.error('上传失败:', error)
    ElMessage.error('上传失败，请重试')
  }
}

// 保存头像
const handleSaveAvatar = async () => {
  try {
    uploadLoading.value = true
    await new Promise(resolve => setTimeout(resolve, 1000))
    userInfo.avatar = previewAvatar.value
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
    ElMessage.success('头像修改成功')
    avatarDialogVisible.value = false
  } catch (error) {
    ElMessage.error('保存失败，请重试')
  } finally {
    uploadLoading.value = false
  }
}

// 保存账号
const handleSaveAccount = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    userInfo.account = editForm.account
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
    ElMessage.success('账号修改成功')
    isEditingAccount.value = false
  } catch (error) {
    ElMessage.error('保存失败，请重试')
  }
}

// 保存昵称
const handleSaveNickname = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    userInfo.nickname = editForm.nickname
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
    ElMessage.success('昵称修改成功')
    isEditingNickname.value = false
  } catch (error) {
    ElMessage.error('保存失败，请重试')
  }
}

// 开始编辑时初始化表单
const startEditing = (field) => {
  editForm[field] = userInfo[field]
}

// 在点击修改按钮时调用 startEditing
const handleEditAccount = () => {
  startEditing('account')
  isEditingAccount.value = true
}

const handleEditNickname = () => {
  startEditing('nickname')
  isEditingNickname.value = true
}
</script>

<style scoped>
.user-profile {
  padding: 20px;
  height: 100%;
  background-color: #f5f7fa;
}

.profile-card {
  max-width: 800px;
  margin: 0 auto;
}

.profile-header {
  display: flex;
  gap: 40px;
  padding: 20px 0;
}

.avatar-container {
  position: relative;
  cursor: pointer;
}

.avatar-container:hover .avatar-hover-text {
  opacity: 1;
}

.avatar-hover-text {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #409EFF;
  opacity: 0;
  transition: opacity 0.3s;
  white-space: nowrap;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.label {
  font-weight: bold;
  width: 80px;
}

.edit-input {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.edit-buttons {
  display: flex;
  gap: 5px;
}

.profile-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  padding: 20px 0;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-label {
  font-size: 14px;
  color: #606266;
}

.detail-value {
  font-size: 16px;
  font-weight: bold;
}

.avatar-uploader {
  text-align: center;
}

.avatar-uploader :deep(.el-upload) {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader :deep(.el-upload:hover) {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  line-height: 178px;
}

.avatar-preview {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
}
</style> 