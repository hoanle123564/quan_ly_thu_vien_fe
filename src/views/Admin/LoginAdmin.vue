<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Admin Login</h2>

      <input v-model="username" placeholder="Tên đăng nhập" />
      <input v-model="password" type="password" placeholder="Mật khẩu" />

      <button @click="login">Đăng nhập</button>

      <p class="error">{{ message }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import store from "../../store";

export default {
  data() {
    return {
      username: "",
      password: "",
      message: "",
    };
  },

  methods: {
    async login() {
      try {
        const res = await axios.post(
          "http://localhost:3000/api/login-nhanvien",
          {
            masnv: this.username,
            password: this.password,
          }
        );

        store.setAuth(res.data.token, "admin");
        this.$router.push("/admin/dashboard");
      } catch (err) {
        this.message = "Sai tài khoản hoặc mật khẩu!";
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #3f87ff, #72b5ff);
}

.login-box {
  width: 350px;
  padding: 35px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.15);
  text-align: center;
  animation: fadeIn 0.5s ease;
}

.login-box h2 {
  margin-bottom: 25px;
}

input {
  width: 100%;
  padding: 12px;
  margin-top: 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

button {
  width: 100%;
  padding: 12px;
  margin-top: 20px;
  background: #3f87ff;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  transition: 0.2s;
}

button:hover {
  background: #2d6fe3;
}

.error {
  color: red;
  margin-top: 10px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
