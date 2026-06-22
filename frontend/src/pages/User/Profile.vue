<template>
  <div class="profile">
    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <span>个人中心</span>
        </div>
      </template>

      <el-row :gutter="20">
        <el-col :span="8" class="profile-info">
          <div class="avatar">👤</div>
          <h2>{{ user?.username }}</h2>
          <p class="email">{{ user?.email }}</p>
          <el-button @click="logout" type="danger" plain>退出登录</el-button>
        </el-col>
        <el-col :span="16" class="stats">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-statistic title="笔记总数" :value="stats?.totalNotes || 0" />
            </el-col>
            <el-col :span="12">
              <el-statistic title="总学习时长" :value="stats?.totalStudyTime || 0" />
            </el-col>
          </el-row>
          <el-row :gutter="20" style="margin-top: 20px">
            <el-col :span="12">
              <el-statistic title="学习天数" :value="stats?.studyDays || 0" />
            </el-col>
            <el-col :span="12">
              <el-statistic title="AI 调用次数" :value="stats?.aiCalls || 0" />
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'
import api from '@/services/api'

const router = useRouter()
const authStore = useAuthStore()

const user = ref(authStore.user)
const stats = ref(null)

const loadStats = async () => {
  try {
    const response = await api.get('/users/stats')
    stats.value = response.data.data
  } catch (error) {
    ElMessage.error('加载统计数据失败')
  }
}

const logout = () => {
  authStore.logout()
  ElMessage.success('已退出登录')
  router.push('/login')
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.profile {
  padding: 20px;
}

.profile-card {
  max-width: 1000px;
  margin: 0 auto;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
}

.profile-info {
  text-align: center;
  border-right: 1px solid #ebeef5;
}

.avatar {
  font-size: 60px;
  margin-bottom: 20px;
}

h2 {
  margin: 0;
  color: #303133;
}

.email {
  color: #909399;
  margin-top: 8px;
}

.stats {
  padding-left: 20px;
}
</style>