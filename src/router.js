import { createRouter, createWebHistory } from "vue-router";
import LoginUser from "./views/User/LoginUser.vue";
import RegisterUser from "./views/User/RegisterUser.vue";
import HomeUser from "./views/User/HomeUser.vue";

import LoginAdmin from "./views/Admin/LoginAdmin.vue";
import HomeAdmin from "./views/Admin/HomeAdmin.vue";
import DetailUser from "./views/User/ThongTinUser.vue";
import ListBook from "./views/User/ListBook.vue";
import TraSach from "./views/User/TraSach.vue";
import LichSuMuon from "./views/User/LichSuMuon.vue";
import AdminQuanLySach from "./views/Admin/AdminQuanLySach.vue";
import nxb from "./views/Admin/AdminNXB.vue";
// import store from "./store";

const routes = [
  // USER ZONE
  { path: "/", redirect: "/user/login" },
  { path: "/user/login", component: LoginUser },
  { path: "/user/register", component: RegisterUser },
  { path: "/user/home", component: HomeUser },
  { path: "/user/thong-tin", component: DetailUser },
  { path: "/user/muon-sach", component: ListBook },
  { path: "/user/tra-sach", component: TraSach },
  { path: "/user/lich-su", component: LichSuMuon },

  // ADMIN ZONE
  { path: "/admin/login", component: LoginAdmin },
  { path: "/admin/dashboard", component: HomeAdmin },
  { path: "/admin/books", component: AdminQuanLySach },
  { path: "/admin/nxb", component: nxb },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  let token = null;
  let role = null;

  // Nếu vào admin
  if (to.path.startsWith("/admin")) {
    token = localStorage.getItem("admin_token");
    role = localStorage.getItem("admin_role");

    if (to.path !== "/admin/login" && (!token || role !== "admin")) {
      return next("/admin/login");
    }
  }

  // Nếu vào user
  if (to.path.startsWith("/user")) {
    token = localStorage.getItem("user_token");
    role = localStorage.getItem("user_role");

    if (
      to.path !== "/user/login" &&
      to.path !== "/user/register" &&
      (!token || role !== "user")
    ) {
      return next("/user/login");
    }
  }

  next();
});

export default router;
