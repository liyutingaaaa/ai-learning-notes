<template>
  <div class="note-edit">
    <el-card class="edit-card">
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑笔记' : '新建笔记' }}</span>
        </div>
      </template>

      <el-form
        :model="form"
        :rules="rules"
        ref="formRef"
        label-width="100px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入笔记标题" />
        </el-form-item>

        <el-form-item label="分类" prop="categoryId">
          <el-select v-model="form.categoryId" placeholder="选择分类">
            <el-option
              v-for="cat in categories"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="标签" prop="tagIds">
          <el-select v-model="form.tagIds" multiple placeholder="选择标签">
            <el-option
              v-for="tag in tags"
              :key="tag.id"
              :label="tag.name"
              :value="tag.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="10"
            placeholder="请输入笔记内容"
          />
        </el-form-item>

        <el-form-item label="学习时长(分钟)" prop="studyTime">
          <el-input-number v-model="form.studyTime" :min="0" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSave" :loading="saving">保存</el-button>
          <el-button @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useNotesStore } from '@/stores/notes'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const notesStore = useNotesStore()
const formRef = ref()

const isEdit = computed(() => !!route.params.id)
const noteId = ref(route.params.id)
const saving = ref(false)

const form = ref({
  title: '',
  categoryId: '',
  tagIds: [],
  content: '',
  studyTime: 0
})

const rules = {
  title: [{ required: true, message: '请输入笔记标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入笔记内容', trigger: 'blur' }]
}

const categories = computed(() => notesStore.categories)
const tags = computed(() => notesStore.tags)

const loadNoteData = async () => {
  if (isEdit.value) {
    try {
      const note = await notesStore.fetchNoteDetail(noteId.value)
      form.value = {
        title: note.title,
        categoryId: note.categoryId,
        tagIds: note.tags?.map(t => t.id) || [],
        content: note.content,
        studyTime: note.studyTime
      }
    } catch (error) {
      ElMessage.error('加载笔记失败')
    }
  }
}

const handleSave = async () => {
  await formRef.value.validate()
  saving.value = true
  try {
    if (isEdit.value) {
      await notesStore.updateNote(noteId.value, form.value)
      ElMessage.success('更新成功')
    } else {
      await notesStore.createNote(form.value)
      ElMessage.success('创建成功')
    }
    router.push('/notes')
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '保存失败')
  } finally {
    saving.value = false
  }
}

const goBack = () => {
  router.push('/notes')
}

onMounted(async () => {
  await notesStore.fetchCategories()
  await notesStore.fetchTags()
  await loadNoteData()
})
</script>

<style scoped>
.note-edit {
  padding: 20px;
}

.edit-card {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
}
</style>