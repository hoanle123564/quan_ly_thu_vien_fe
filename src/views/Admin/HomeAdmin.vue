<template>
  <div class="admin-container">
    <SidebarAdmin />

    <main class="content">
      <h1 class="title">Trang quản trị hệ thống</h1>
      <p class="subtitle">Chào mừng bạn đến với quản trị thư viện</p>
    </main>
  </div>
</template>

<script>
import SidebarAdmin from "../../components/NavbarAdmin.vue";

export default {
  components: { SidebarAdmin },
};
</script>

<style scoped>
.admin-container {
  display: flex;
  height: 100vh;
  background: #f4f6fb;
  overflow-y: auto;
  width: 100%;
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
