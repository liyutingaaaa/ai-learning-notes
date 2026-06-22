<template>
  <div class="notes-list">
    <el-row :gutter="20" class="header">
      <el-col :span="12">
        <h2>笔记列表</h2>
      </el-col>
      <el-col :span="12" class="actions">
        <router-link to="/create">
          <el-button type="primary">+ 新建笔记</el-button>
        </router-link>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="filter">
      <el-col :span="12">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索笔记..."
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-select v-model="filterCategory" placeholder="选择分类" @change="handleFilter">
          <el-option label="全部分类" :value="" />
          <el-option
            v-for="cat in categories"
            :key="cat.id"
            :label="cat.name"
            :value="cat.id"
          />
        </el-select>
      </el-col>
      <el-col :span="6" class="text-right">
        <el-select v-model="sortBy" placeholder="排序" @change="handleFilter">
          <el-option label="最新" value="newest" />
          <el-option label="最旧" value="oldest" />
          <el-option label="学习时长" value="studyTime" />
        </el-select>
      </el-col>
    </el-row>

    <el-skeleton :loading="notesStore.loading" animated>
      <template #default>
        <el-row :gutter="20" class="notes-grid">
          <el-col :span="8" v-for="note in notes" :key="note.id">
            <el-card class="note-card" @click="goToDetail(note.id)">
              <template #header>
                <div class="card-header">
                  <span class="title" :title="note.title">{{ note.title }}</span>
                  <el-dropdown @command="handleCommand" @click.stop>
                    <span class="el-dropdown-link">
                      <el-icon><MoreFilled /></el-icon>
                    </span>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item command="edit" :data="note.id">编辑</el-dropdown-item>
                        <el-dropdown-item command="delete" :data="note.id">删除</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </template>
              <div class="note-content" :title="note.summary">{{ note.summary }}</div>
              <div class="note-footer">
                <span class="category" v-if="note.categoryName">📁 {{ note.categoryName }}</span>
                <span class="time">📅 {{ formatDate(note.createdAt) }}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </template>
    </el-skeleton>

    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50]"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="handlePageChange"
      @size-change="handlePageSizeChange"
      class="pagination"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNotesStore } from '@/stores/notes'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, MoreFilled } from '@element-plus/icons-vue'

const router = useRouter()
const notesStore = useNotesStore()

const searchKeyword = ref('')
const filterCategory = ref('')
const sortBy = ref('newest')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const notes = computed(() => notesStore.notes)
const categories = computed(() => notesStore.categories)

const loadNotes = async () => {
  try {
    const result = await notesStore.fetchNotes(currentPage.value, pageSize.value, {
      keyword: searchKeyword.value,
      categoryId: filterCategory.value,
      sortBy: sortBy.value
    })
    total.value = result.total
  } catch (error) {
    ElMessage.error('加载笔记失败')
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadNotes()
}

const handleFilter = () => {
  currentPage.value = 1
  loadNotes()
}

const handlePageChange = () => {
  loadNotes()
}

const handlePageSizeChange = () => {
  currentPage.value = 1
  loadNotes()
}

const goToDetail = (noteId) => {
  router.push(`/notes/${noteId}`)
}

const handleCommand = (command) => {
  // 需要修改以支持传参
  if (command === 'edit') {
    // 处理编辑
  } else if (command === 'delete') {
    // 处理删除
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

onMounted(async () => {
  await notesStore.fetchCategories()
  await loadNotes()
})
</script>

<style scoped>
.notes-list {
  padding: 20px;
}

.header {
  margin-bottom: 20px;
  align-items: center;
}

.actions {
  text-align: right;
}

.filter {
  margin-bottom: 20px;
}

.notes-grid {
  margin-bottom: 20px;
}

.note-card {
  cursor: pointer;
  transition: all 0.3s;
}

.note-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.note-content {
  color: #606266;
  height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  margin-bottom: 12px;
}

.note-footer {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
}

.pagination {
  text-align: right;
  margin-top: 20px;
}
</style>