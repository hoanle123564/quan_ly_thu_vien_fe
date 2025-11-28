<template>
  <div class="admin-container">
    <aside class="sidebar">
      <h2 class="logo">LIBRARY ADMIN</h2>

      <ul class="menu">
        <li @click="$router.push('/admin/books')">
          <i class="fas fa-book"></i> Quản lý sách
        </li>
        <li @click="$router.push('/admin/readers')">
          <i class="fas fa-users"></i> Quản lý độc giả
        </li>
        <li @click="$router.push('/admin/staff')">
          <i class="fas fa-user-tie"></i> Quản lý nhân viên
        </li>
        <li @click="$router.push('/admin/statistic')">
          <i class="fas fa-chart-line"></i> Thống kê – Biểu đồ
        </li>
      </ul>

      <button class="logout-btn" @click="logout">
        <i class="fas fa-sign-out-alt"></i> Đăng xuất
      </button>
    </aside>

    <main class="content">
      <h1 class="title">Trang quản trị hệ thống</h1>
      <p class="subtitle">Chào mừng bạn đến với quản trị thư viện</p>
    </main>
  </div>
</template>

<script>
import store from "../../store";

export default {
  methods: {
    logout() {
      store.logout();
      this.$router.push("/admin/login");
    },
  },
};
</script>

<style scoped>
.admin-container {
  display: flex;
  height: 100vh;
  background: #f4f6fb;
}

.sidebar {
  width: 260px;
  background: #1f2d3d;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.logo {
  text-align: center;
  margin-bottom: 30px;
}

.menu {
  list-style: none;
  padding: 0;
  flex: 1;
}

.menu li {
  padding: 12px 15px;
  margin-bottom: 10px;
  background: #2c3e50;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}

.menu li i {
  margin-right: 10px;
}

.menu li:hover {
  background: #3d566e;
}

.logout-btn {
  background: #e74c3c;
  color: white;
  padding: 10px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: 0.2s;
}

.logout-btn:hover {
  background: #c0392b;
}

.content {
  flex: 1;
  padding: 40px;
}

.title {
  font-size: 34px;
  font-weight: 700;
}

.subtitle {
  margin-top: 10px;
  font-size: 18px;
  color: #555;
}
</style>
