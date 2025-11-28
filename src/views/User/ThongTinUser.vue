<template>
  <div class="profile-container">
    <NavbarUser />

    <div class="profile-box">
      <h2>Thông tin cá nhân</h2>

      <div class="form-group">
        <label>Mã độc giả</label>
        <input v-model="user.MADOCGIA" disabled />
      </div>

      <div class="form-group">
        <label>Họ lót</label>
        <input v-model="user.HOLOT" />
      </div>

      <div class="form-group">
        <label>Tên</label>
        <input v-model="user.TEN" />
      </div>

      <div class="form-group">
        <label>Ngày sinh</label>
        <input type="date" v-model="user.NGAYSINH" />
      </div>

      <div class="form-group">
        <label>Giới tính</label>
        <select v-model="user.PHAI">
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
        </select>
      </div>

      <div class="form-group">
        <label>Địa chỉ</label>
        <input v-model="user.DIACHI" />
      </div>

      <div class="form-group">
        <label>Số điện thoại</label>
        <input v-model="user.DIENTHOAI" />
      </div>

      <button class="save-btn" @click="updateInfo">Lưu thay đổi</button>

      <p class="status">{{ statusMessage }}</p>
    </div>
  </div>
</template>

<script>
import NavbarUser from "../../components/NavbarUser.vue";
import axios from "axios";

export default {
  components: { NavbarUser },

  data() {
    return {
      user: {
        MADOCGIA: "",
        HOLOT: "",
        TEN: "",
        NGAYSINH: "",
        PHAI: "",
        DIACHI: "",
        DIENTHOAI: "",
      },
      statusMessage: "",
    };
  },

  async mounted() {
    try {
      const token = localStorage.getItem("token");
      const decoded = JSON.parse(atob(token.split(".")[1])); // Lấy info từ JWT

      // Gọi API lấy thông tin độc giả theo MADOCGIA
      const res = await axios.get(
        `http://localhost:3000/api/get-docgia?madocgia=${decoded.id}`
      );

      this.user = res.data.data;
    } catch (err) {
      console.error("Lỗi tải thông tin:", err);
    }
  },

  methods: {
    async updateInfo() {
      try {
        await axios.patch("http://localhost:3000/api/edit-docgia", this.user);

        this.statusMessage = "Cập nhật thành công!";
      } catch (err) {
        this.statusMessage = "Có lỗi xảy ra!";
      }
    },
  },
};
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background: #f4f6fb;
  padding-bottom: 40px;
}

.profile-box {
  width: 450px;
  margin: 30px auto;
  background: white;
  padding: 35px;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.4s ease;
}

h2 {
  text-align: center;
  margin-bottom: 25px;
}

.form-group {
  margin-top: 15px;
}

label {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 6px;
  display: block;
}

input,
select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-top: 4px;
}

.save-btn {
  width: 100%;
  margin-top: 25px;
  padding: 12px;
  background: #4f7eff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.2s;
}

.save-btn:hover {
  background: #3b63d3;
  transform: translateY(-2px);
}

.status {
  margin-top: 15px;
  text-align: center;
  color: green;
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
