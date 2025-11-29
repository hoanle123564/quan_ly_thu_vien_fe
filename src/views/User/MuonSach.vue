<template>
  <div class="borrow-container">
    <NavbarUser />

    <div class="borrow-wrapper">
      <div class="borrow-card">
        <h2 class="title">
          <span class="icon">📘</span>
          Mượn sách
        </h2>

        <div class="info">
          <p><strong>Tên sách:</strong> {{ sach.TENSACH }}</p>
          <p><strong>Tác giả:</strong> {{ sach.TACGIA }}</p>
          <p><strong>NXB:</strong> {{ sach.TENNXB }}</p>
          <label>Số lượng mượn</label>
          <input type="number" v-model="soLuong" min="1" />
        </div>

        <div class="date-group">
          <label>Ngày mượn</label>
          <input
            style="cursor: not-allowed"
            type="date"
            v-model="ngayMuon"
            disabled
          />

          <label>Ngày trả (tự tính 14 ngày)</label>
          <input
            style="cursor: not-allowed"
            type="date"
            v-model="ngayTra"
            disabled
          />
        </div>

        <button class="submit-btn" @click="handleMuon">✔ Xác nhận mượn</button>

        <p class="status" :class="{ error: isError }">{{ status }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NavbarUser from "../../components/NavbarUser.vue";

export default {
  components: { NavbarUser },

  data() {
    return {
      sach: {},
      ngayMuon: "",
      soLuong: null,
      ngayTra: "",
      status: "",
      isError: false,
    };
  },

  async mounted() {
    const id = this.$route.params.id;
    const res = await axios.get("http://localhost:3000/api/get-all-sach");
    this.sach = res.data.data.find((i) => i._id === id);

    this.setDates();
  },

  methods: {
    setDates() {
      const today = new Date();
      const due = new Date();
      due.setDate(today.getDate() + 14);

      const f = (d) => d.toISOString().slice(0, 10);

      this.ngayMuon = f(today);
      this.ngayTra = f(due);
    },

    async handleMuon() {
      const token = localStorage.getItem("user_token");
      const decoded = JSON.parse(atob(token.split(".")[1]));
      let data = {
        MADOCGIA: decoded.id,
        MASACH: this.sach.MASACH,
        SOLUONG: this.soLuong,
        NGAYMUON: this.ngayMuon,
        NGAYTRA: this.ngayTra,
      };

      try {
        await axios.post("http://localhost:3000/api/muon-sach", data);

        this.status = "Mượn sách thành công!";
        this.isError = false;
        this.$router.push(`/user/muon-sach`);
      } catch (err) {
        this.status = err.response?.data?.message || "Không thể mượn sách";
        this.isError = true;
      }
    },
  },
};
</script>

<style scoped>
/* Toàn bộ nền + tránh bị dính navbar */

/* Wrapper để đẩy card sang bên phải như ảnh bạn gửi */
.borrow-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;

  min-height: 100vh; /* Giúp form luôn cân giữa theo chiều dọc */
  padding-left: 0; /* Tránh bị đẩy sang phải */
}

/* Thẻ mượn sách */
.borrow-card {
  width: 420px;
  background: white;
  padding: 28px;
  border-radius: 18px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
  animation: fadeIn 0.3s ease;
  margin: 0 auto;
}

.title {
  text-align: center;
  margin-bottom: 22px;
  font-size: 26px;
  font-weight: 700;
  color: #333;
}

.icon {
  font-size: 30px;
  margin-right: 6px;
}

.info p {
  margin: 6px 0;
  font-size: 15px;
}

.date-group label {
  font-weight: 600;
  display: block;
  margin-top: 15px;
}

input {
  width: 90%;
  padding: 12px;
  margin-top: 8px;
  border-radius: 10px;
  border: 1px solid #d2d8e6;
  background: #f0f2f5;
  font-size: 15px;
}

.submit-btn {
  width: 95%;
  padding: 14px;
  margin-top: 25px;
  background: #4f7eff;
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.25s;
}

.submit-btn:hover {
  background: #3a66d3;
  transform: translateY(-2px);
}

.status {
  text-align: center;
  margin-top: 15px;
  font-weight: 600;
}

.status.error {
  color: #d93025;
}

.status:not(.error) {
  color: #28a745;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
