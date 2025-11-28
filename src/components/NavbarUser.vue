<template>
  <nav class="navbar">
    <div class="left">
      <router-link class="logo" to="/user/home"> 📚 Life Library </router-link>
    </div>

    <div class="right">
      <router-link to="/user/home" class="nav-item">
        <i class="fas fa-home"></i> Trang chủ
      </router-link>

      <router-link to="/user/lich-su" class="nav-item">
        <i class="fas fa-history"></i> Lịch sử mượn
      </router-link>

      <router-link to="/user/thong-tin" class="nav-item">
        <i class="fas fa-user"></i> Tài khoản
      </router-link>

      <button class="logout-btn" @click="logout">
        <i class="fas fa-sign-out-alt"></i> Đăng xuất
      </button>
    </div>
  </nav>
</template>

<script>
import store from "../store";

export default {
  methods: {
    logout() {
      store.logout();
      this.$router.push("/user/login");
    },
  },
};
</script>

<style scoped>
/* NAVBAR */
.navbar {
  width: 100%;
  height: 60px;
  background: #ffffff;
  padding: 0 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  border-bottom: 1px solid #e0e6f0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);

  position: sticky;
  top: 0;
  z-index: 1000;
}

.logo {
  font-weight: 700;
  font-size: 20px;
  color: #4f7eff;
  text-decoration: none;
}

.right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-item {
  color: #333;
  font-size: 16px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: 0.2s;
}

.nav-item:hover {
  color: #4f7eff;
  transform: translateY(-2px);
}

/* LOGOUT BUTTON */
.logout-btn {
  background: #ff4d4d;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: 0.2s;
}

.logout-btn:hover {
  background: #e63d3d;
  transform: translateY(-2px);
}

/* RESPONSIVE */
@media (max-width: 600px) {
  .right {
    gap: 10px;
  }

  .nav-item {
    font-size: 14px;
  }

  .logout-btn {
    padding: 6px 10px;
    font-size: 14px;
  }
}
* {
  box-sizing: border-box;
}

.navbar {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}
</style>
