<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2>Đăng nhập Độc giả</h2>

      <input v-model="username" placeholder="Tên đăng nhập" />
      <input v-model="password" type="password" placeholder="Mật khẩu" />

      <button @click="login">Đăng nhập</button>

      <p class="error">{{ message }}</p>

      <router-link class="link" to="/user/register">
        Chưa có tài khoản? Đăng ký
      </router-link>
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
        const res = await axios.post("http://localhost:3000/api/login-docgia", {
          madocgia: this.username,
          password: this.password,
        });

        store.setAuth(res.data.token, "user");
        this.$router.push("/user/home");
      } catch (err) {
        this.message = "Sai tài khoản hoặc mật khẩu!";
      }
    },
  },
};
</script>

<style scoped>
/* FULL SCREEN + CENTER */
.auth-container {
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #3f87ff, #72b5ff);
}

/* BOX */
.auth-box {
  width: 350px;
  background: white;
  padding: 35px;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
  text-align: center;
  animation: fadeIn 0.4s ease;
}

h2 {
  margin-bottom: 20px;
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

.link {
  display: block;
  margin-top: 12px;
  color: #3f87ff;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
