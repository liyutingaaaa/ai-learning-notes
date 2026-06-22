<template>
  <div class="note-detail">
    <el-skeleton :loading="loading" animated>
      <template #default>
        <div v-if="note" class="detail-container">
          <el-row :gutter="20" class="header">
            <el-col :span="18">
              <h1>{{ note.title }}</h1>
            </el-col>
            <el-col :span="6" class="text-right">
              <router-link :to="`/notes/${noteId}/edit`">
                <el-button type="primary">编辑</el-button>
              </router-link>
              <el-button type="danger" @click="handleDelete">删除</el-button>
            </el-col>
          </el-row>

          <div class="meta-info">
            <span v-if="note.categoryName">📁 {{ note.categoryName }}</span>
            <span>📅 {{ formatDate(note.createdAt) }}</span>
            <span>👁️ {{ note.viewCount }} 次浏览</span>
            <span>⏱️ {{ note.studyTime }} 分钟</span>
          </div>

          <div class="tags" v-if="note.tags && note.tags.length">
            <el-tag v-for="tag in note.tags" :key="tag.id" type="info" style="margin-right: 8px">
              {{ tag.name }}
            </el-tag>
          </div>

          <div class="content">
            {{ note.content }}
          </div>

          <el-divider />

          <div class="ai-actions">
            <h3>AI 辅助工具</h3>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-button @click="summarizeNote" :loading="summarizing">📝 生成总结</el-button>
              </el-col>
              <el-col :span="6">
                <el-button @click="generateQuestions" :loading="generating">❓ 生成题目</el-button>
              </el-col>
            </el-row>
            <div v-if="aiResult" class="ai-result">
              <p>{{ aiResult }}</p>
            </div>
          </div>

          <el-button @click="goBack" style="margin-top: 20px">返回</el-button>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useNotesStore } from '@/stores/notes'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const route = useRoute()
const notesStore = useNotesStore()

const noteId = ref(route.params.id)
const note = ref(null)
const loading = ref(true)
const summarizing = ref(false)
const generating = ref(false)
const aiResult = ref('')

const loadNote = async () => {
  loading.value = true
  try {
    note.value = await notesStore.fetchNoteDetail(noteId.value)
  } catch (error) {
    ElMessage.error('加载笔记失败')
  } finally {
    loading.value = false
  }
}

const handleDelete = async () => {
  try {
    await ElMessageBox.confirm('确定删除该笔记吗？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await notesStore.deleteNote(noteId.value)
    ElMessage.success('删除成功')
    router.push('/notes')
  } catch (error) {
    // 用户取消
  }
}

const summarizeNote = async () => {
  summarizing.value = true
  try {
    const result = await notesStore.summarizeNote(noteId.value)
    aiResult.value = result
    ElMessage.success('总结生成成功')
  } catch (error) {
    ElMessage.error('生成总结失败')
  } finally {
    summarizing.value = false
  }
}

const generateQuestions = async () => {
  generating.value = true
  try {
    const result = await notesStore.generateQuestions(noteId.value, 5)
    aiResult.value = result
    ElMessage.success('题目生成成功')
  } catch (error) {
    ElMessage.error('生成题目失败')
  } finally {
    generating.value = false
  }
}

const goBack = () => {
  router.push('/notes')
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

onMounted(() => {
  loadNote()
})
</script>

<style scoped>
.note-detail {
  padding: 20px;
}

.detail-container {
  max-width: 900px;
  margin: 0 auto;
}

.header {
  margin-bottom: 20px;
  align-items: center;
}

h1 {
  margin: 0;
}

.meta-info {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  color: #909399;
  font-size: 14px;
}

.tags {
  margin-bottom: 20px;
}

.content {
  line-height: 1.8;
  color: #333;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin-bottom: 20px;
}

.ai-actions {
  margin: 20px 0;
}

.ai-result {
  background: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  margin-top: 10px;
  max-height: 300px;
  overflow-y: auto;
}

.text-right {
  text-align: right;
}
</style>