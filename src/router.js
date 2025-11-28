import { createRouter, createWebHistory } from "vue-router";
import LoginUser from "./views/User/LoginUser.vue";
import RegisterUser from "./views/User/RegisterUser.vue";
import HomeUser from "./views/User/HomeUser.vue";

import LoginAdmin from "./views/Admin/LoginAdmin.vue";
import HomeAdmin from "./views/Admin/HomeAdmin.vue";
import DetailUser from "./views/User/ThongTinUser.vue";
// import store from "./store";

const routes = [
  // USER ZONE
  { path: "/", redirect: "/user/login" },
  { path: "/user/login", component: LoginUser },
  { path: "/user/register", component: RegisterUser },
  { path: "/user/home", component: HomeUser },
  { path: "/user/thong-tin", component: DetailUser },

  // ADMIN ZONE
  { path: "/admin/login", component: LoginAdmin },
  { path: "/admin/dashboard", component: HomeAdmin },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  // ADMIN PROTECTED ROUTE
  if (to.path.startsWith("/admin") && to.path !== "/admin/login") {
    if (role !== "admin" || !token) return next("/admin/login");
  }

  // USER PROTECTED ROUTE
  if (
    to.path.startsWith("/user") &&
    to.path !== "/user/login" &&
    to.path !== "/user/register"
  ) {
    if (role !== "user" || !token) return next("/user/login");
  }

  next();
});

export default router;
