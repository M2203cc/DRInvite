import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/auth/Register.vue')
  },
  {
    path: '/',
    component: () => import('../views/Layout.vue'),
    children: [
      {
        path: 'home',
        name: 'HomePage',
        component: () => import('../views/home/HomePage.vue')
      },
      {
        path: 'influencers/chat',
        name: 'InfluencerChat',
        component: () => import('../views/influencer/InfluencerChat.vue')
      },
      {
        path: 'influencers/ranking',
        name: 'InfluencerRanking',
        component: () => import('../views/influencer/InfluencerRanking.vue')
      },
      {
        path: 'invitation',
        name: 'InvitationManagement',
        component: () => import('../views/invitation/InvitationManagement.vue')
      },
      {
        path: 'invitation/plans',
        name: 'PlanManagement',
        component: () => import('../views/invitation/PlanManagement.vue')
      },
      {
        path: 'chat',
        name: 'ChatSystem',
        component: () => import('../views/chat/ChatSystem.vue')
      },
      {
        path: 'blacklist',
        name: 'Blacklist',
        component: () => import('../views/blacklist/BlacklistManagement.vue')
      },
      {
        path: 'profile',
        name: 'UserProfile',
        component: () => import('../views/profile/UserProfile.vue')
      },
      {
        path: 'account/users',
        name: 'UserManagement',
        component: () => import('../views/account/UserManagement.vue')
      },
      {
        path: 'account/shops',
        name: 'ShopManagement',
        component: () => import('../views/account/ShopManagement.vue')
      },
      {
        path: 'invitation/product',
        name: 'ProductInvitation',
        component: () => import('../views/invitation/ProductInvitation.vue'),
        meta: {
          title: '商品邀约'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 添加路由守卫
router.beforeEach((to, from, next) => {
  // 检查是否已登录（这里简单用 localStorage 模拟，实际项目中应该使用更安全的方式）
  const isAuthenticated = localStorage.getItem('token')

  // 如果访问的是登录或注册页面，直接放行
  if (to.path === '/login' || to.path === '/register') {
    next()
    return
  }

  // 如果未登录，重定向到登录页
  if (!isAuthenticated) {
    next('/login')
    return
  }

  // 已登录，放行
  next()
})

export default router 