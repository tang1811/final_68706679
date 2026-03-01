import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/Employees_crud_image.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: () =>
      import(/* webpackChunkName: "type" */ "../views/Employees_crud_image.vue"),
  },
  {
    path: "/employees",
    name: "employees",
    component: () =>
      import(/* webpackChunkName: "type" */ "../views/Employees_crud_image.vue"),
    
  },
  {
    path: "/show_employees",
    name: "show_employees",
    component: () =>
      import(/* webpackChunkName: "type" */ "../views/Show_Employees.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

/* ✅ ROUTE GUARD */
router.beforeEach((to, from, next) => {

  const isLoggedIn = localStorage.getItem("adminLogin")

  // ถ้าหน้านั้นต้อง login แต่ยังไม่ login
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login')
  } 
  // ถ้า login แล้วแต่พยายามเข้าหน้า login
  else if (to.path === '/login' && isLoggedIn) {
    next('/')   // หรือ dashboard
  }
  else {
    next()
  }
})

export default router;
