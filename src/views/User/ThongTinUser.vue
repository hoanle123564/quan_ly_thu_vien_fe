<template>
  <div class="profile-container">
    <NavbarUser />

    <div class="profile-box">
      <h2 class="title">Thông tin cá nhân</h2>

      <!-- Mã độc giả -->
      <div class="form-group">
        <label>Mã độc giả</label>
        <input v-model="user.MADOCGIA" disabled class="input disabled" />
      </div>

      <!-- Họ lót + Tên -->
      <div class="row">
        <div class="col">
          <label>Họ lót</label>
          <input v-model="user.HOLOT" class="input" />
        </div>

        <div class="col">
          <label>Tên</label>
          <input v-model="user.TEN" class="input" />
        </div>
      </div>

      <!-- Ngày sinh + Giới tính -->
      <div class="row">
        <div class="col">
          <label>Ngày sinh</label>
          <input type="date" v-model="user.NGAYSINH" class="input" />
        </div>

        <div class="col">
          <label>Giới tính</label>
          <select v-model="user.PHAI" class="input">
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
        </div>
      </div>

      <!-- Địa chỉ + Số điện thoại -->
      <div class="row">
        <div class="col">
          <label>Địa chỉ</label>
          <input v-model="user.DIACHI" class="input" />
        </div>

        <div class="col">
          <label>Số điện thoại</label>
          <input v-model="user.DIENTHOAI" class="input" />
        </div>
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
      const token = localStorage.getItem("user_token");
      const decoded = JSON.parse(atob(token.split(".")[1])); // Lấy info từ JWT
      console.log("decoded", decoded);

      // Gọi API lấy thông tin độc giả theo MADOCGIA
      const res = await axios.get(
        `http://localhost:3000/api/get-detail-docgia?madocgia=${decoded.id}`
      );
      console.log("res.data", res.data);

      const data = res.data.data;

      // Convert ISO date → yyyy-MM-dd
      if (data.NGAYSINH) {
        data.NGAYSINH = data.NGAYSINH.split("T")[0];
      }

      this.user = data;
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
  background: linear-gradient(to bottom right, #eef2f7, #f7f9fc);
}

.profile-box {
  width: 700px;
  margin: auto;
  background: #fff;
  padding: 40px 45px 55px;
  border-radius: 26px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
  animation: fadeIn 0.35s ease;
}

.title {
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 25px;
  color: #222;
  letter-spacing: 0.5px;
}

/* FORM */
.form-group {
  margin-top: 18px;
}

/* ROW 2 CỘT */
.row {
  display: flex;
  gap: 20px;
  margin-top: 18px;
}

.col {
  flex: 1;
}

label {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 6px;
  display: block;
  color: #444;
}

/* INPUTS */
.input {
  width: 100%;
  padding: 12px 14px;
  font-size: 15px;
  border: 1px solid #ccd3e0;
  border-radius: 12px;
  transition: 0.25s;
  background: #fff;
}

.input:hover {
  border-color: #8aa8ff;
}

.input:focus {
  border-color: #4f7eff;
  box-shadow: 0 0 0 3px rgba(79, 126, 255, 0.15);
  outline: none;
}

.disabled {
  background: #f1f3f7;
  color: #777;
  cursor: not-allowed;
}

/* SAVE BUTTON */
.save-btn {
  width: 100%;
  margin-top: 30px;
  padding: 14px 0;
  border: none;
  border-radius: 14px;
  font-size: 17px;
  color: #fff;
  font-weight: 600;
  background: linear-gradient(135deg, #4f7eff, #355de5);
  cursor: pointer;
  transition: 0.25s ease;
}

.save-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(53, 93, 229, 0.28);
}

.status {
  margin-top: 15px;
  text-align: center;
  color: #0abf30;
  font-size: 15px;
}

/* FADE ANIMATION */
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
