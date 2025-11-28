<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2>Đăng ký Độc Giả</h2>

      <input v-model="madocgia" placeholder="Mã độc giả (tên đăng nhập)" />

      <input v-model="holot" placeholder="Họ lót" />
      <input v-model="ten" placeholder="Tên" />

      <label class="label">Ngày sinh:</label>
      <input v-model="birth" type="date" />

      <select v-model="gender">
        <option disabled value="">-- Chọn giới tính --</option>
        <option value="Nam">Nam</option>
        <option value="Nữ">Nữ</option>
      </select>

      <input v-model="address" placeholder="Địa chỉ" />
      <input v-model="phone" placeholder="Số điện thoại" />

      <input v-model="password" type="password" placeholder="Mật khẩu" />

      <button @click="register">Đăng ký</button>

      <p class="error">{{ message }}</p>

      <router-link class="link" to="/user/login">
        Đã có tài khoản? Đăng nhập
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      madocgia: "",
      holot: "",
      ten: "",
      birth: "",
      gender: "",
      address: "",
      phone: "",
      password: "",
      message: "",
    };
  },

  methods: {
    async register() {
      try {
        await axios.post("http://localhost:3000/api/add-docgia", {
          MADOCGIA: this.madocgia,
          HOLOT: this.holot,
          TEN: this.ten,
          NGAYSINH: this.birth,
          PHAI: this.gender,
          DIACHI: this.address,
          DIENTHOAI: this.phone,
          Password: this.password,
        });

        this.message = "Đăng ký thành công!";
      } catch (err) {
        this.message = "Lỗi đăng ký!";
      }
    },
  },
};
</script>

<style scoped>
/* FULL SCREEN */
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

.auth-box {
  width: 400px;
  background: white;
  padding: 35px;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
  text-align: center;
  animation: fadeIn 0.4s ease;
}

input,
select {
  width: 100%;
  padding: 12px;
  margin-top: 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.label {
  text-align: left;
  width: 100%;
  display: block;
  margin-top: 15px;
  font-weight: bold;
  font-size: 14px;
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
}
</style>
