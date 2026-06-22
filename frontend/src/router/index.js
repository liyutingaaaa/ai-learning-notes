import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/pages/Auth/Login.vue'
import Register from '@/pages/Auth/Register.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import NotesList from '@/pages/Notes/NotesList.vue'
import NoteDetail from '@/pages/Notes/NoteDetail.vue'
import NoteEdit from '@/pages/Notes/NoteEdit.vue'
import UserProfile from '@/pages/User/Profile.vue'

const routes = [
  {
    path: '/login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    component: Register,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/notes'
      },
      {
        path: 'notes',
        component: NotesList
      },
      {
        path: 'notes/:id',
        component: NoteDetail
      },
      {
        path: 'notes/:id/edit',
        component: NoteEdit
      },
      {
        path: 'create',
        component: NoteEdit
      },
      {
        path: 'profile',
        component: UserProfile
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register') && token) {
    next('/notes')
  } else {
    next()
  }
})

export default router