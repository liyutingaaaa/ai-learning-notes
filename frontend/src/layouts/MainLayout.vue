<template>
  <el-container class="main-layout">
    <el-header class="header">
      <div class="header-content">
        <div class="logo">🎓 AI 学习笔记</div>
        <el-menu mode="horizontal" class="header-menu">
          <el-menu-item index="/notes">笔记</el-menu-item>
          <el-menu-item index="/profile">个人中心</el-menu-item>
          <el-menu-item @click="handleLogout">退出</el-menu-item>
        </el-menu>
      </div>
    </el-header>
    <el-main class="main">
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  ElMessage.success('已退出登录')
  router.push('/login')
}
</script>

<style scoped>
.main-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #ffffff;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  align-items: center;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.header-menu {
  flex: 1;
  text-align: right;
  border: none;
}

.main {
  flex: 1;
  overflow-y: auto;
  background-color: #f5f7fa;
}
</style>