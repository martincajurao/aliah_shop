import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'


Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/category',
    name: 'category',
    component: () => import(/* webpackChunkName: "new" */ '../views/Category.vue')
  },
  {
    path: '/products',
    name: 'products',
    component: () => import(/* webpackChunkName: "products" */ '../views/Products.vue')
  },
  {
    path: '/expenses',
    name: 'expenses',
    component: () => import(/* webpackChunkName: "products" */ '../views/Expense.vue')
  },
  {
    path: '/clients',
    name: 'clients',
    component: () => import(/* webpackChunkName: "products" */ '../views/Clients.vue')
  },
  {
    path: '/user_account',
    name: 'user_account',
    component: () => import(/* webpackChunkName: "products" */ '../views/UserAccount.vue')
  },
  {
    path: '/reports',
    name: 'reports',
    component: () => import(/* webpackChunkName: "products" */ '../views/Reports.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
