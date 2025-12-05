<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2>Đăng ký Độc Giả</h2>

      <!-- Row: Mã độc giả -->
      <div class="row">
        <div class="col">
          <input v-model="madocgia" placeholder="Mã độc giả (tên đăng nhập)" />
        </div>
      </div>

      <!-- Row: Họ lót - Tên -->
      <div class="row">
        <div class="col">
          <input v-model="holot" placeholder="Họ lót" />
        </div>
        <div class="col">
          <input v-model="ten" placeholder="Tên" />
        </div>
      </div>

      <!-- Row: Ngày sinh - Giới tính -->
      <div class="row">
        <div class="col">
          <label class="label">Ngày sinh:</label>
          <input v-model="birth" type="date" />
        </div>
        <div class="col">
          <label class="label">Giới tính:</label>
          <select v-model="gender">
            <option disabled value="">-- Chọn giới tính --</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
        </div>
      </div>

      <!-- Row: Địa chỉ - Số điện thoại -->
      <div class="row">
        <div class="col">
          <input v-model="address" placeholder="Địa chỉ" />
        </div>
        <div class="col">
          <input v-model="phone" placeholder="Số điện thoại" />
        </div>
      </div>

      <!-- Mật khẩu full width -->
      <input
        v-model="password"
        type="password"
        placeholder="Mật khẩu"
        class="full"
      />

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
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #3f87ff, #72b5ff);
}

.auth-box {
  width: 520px; /* tăng để không bị tràn */
  max-width: 95%; /* an toàn với màn nhỏ */
  background: white;
  padding: 30px 35px;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
  animation: fadeIn 0.4s ease;
}

.row {
  display: flex;
  justify-content: space-between;
  gap: 10px; /* thu nhỏ để không tràn */
  margin-top: 12px;
}

.col {
  flex: 1;
}

input,
select {
  width: 100%;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.label {
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 14px;
  text-align: left;
  display: block;
}

.full {
  width: 100%;
  margin-top: 12px;
}

button {
  width: 100%;
  padding: 12px;
  margin-top: 20px;
  background: #3f87ff;
  color: white;
  border-radius: 6px;
  border: none;
  cursor: pointer;
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

.row {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.col {
  flex: 1;
}

.full {
  width: 100%;
  margin-top: 12px;
}

input,
select {
  width: 100%;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 14px;
}

/* Container giữ nguyên */
.auth-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #3f87ff, #72b5ff);
}

.auth-box {
  width: 450px;
  background: white;
  padding: 35px;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
  text-align: center;
}
</style>
