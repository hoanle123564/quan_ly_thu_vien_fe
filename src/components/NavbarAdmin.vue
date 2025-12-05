<template>
  <aside class="sidebar">
    <h2 class="logo">QUẢN LÝ THƯ VIỆN</h2>

    <ul class="menu">
      <li @click="$router.push('/admin/books')">
        <i class="fas fa-book"></i> Quản lý sách
      </li>
      <li @click="$router.push('/admin/nxb')">
        <i class="fas fa-book"></i> Quản lý nhà xuất bản
      </li>
      <li @click="$router.push('/admin/readers')">
        <i class="fas fa-users"></i> Quản lý độc giả
      </li>

      <li @click="$router.push('/admin/muon-tra')">
        <i class="fas fa-exchange-alt"></i> Mượn – Trả sách
      </li>

      <li @click="$router.push('/admin/statistic')">
        <i class="fas fa-chart-line"></i> Thống kê – Biểu đồ
      </li>
    </ul>

    <button class="logout-btn" @click="logout">
      <i class="fas fa-sign-out-alt"></i> Đăng xuất
    </button>
  </aside>
</template>

<script>
import store from "../store";

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
.sidebar {
  width: 260px;
  background: #1f2d3d;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  /* min-height: 100vh; */
}

.logo {
  text-align: center;
  margin-bottom: 30px;
  font-size: 35px;
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
</style>
