import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home.vue'
import Login from '../views/login.vue'

Vue.use(VueRouter)
const routes = [
  {
    path:'/',
    redirect:'/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
 
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if(to.path==='/home'){
   const isLogin = localStorage.getItem('isLogin')
   if(isLogin === 'true'){
    next()
   }else{
    next('/login')
   }
  }else{
    next()
  } 
})

export default router