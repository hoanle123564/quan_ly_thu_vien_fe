<template>
  <div class="history-container">
    <NavbarUser />

    <h2 class="title">Lịch sử mượn sách</h2>

    <div v-if="list.length === 0" class="empty">
      Bạn chưa mượn cuốn sách nào.
    </div>

    <div class="history-list">
      <div class="history-card" v-for="item in list" :key="item._id">
        <h3 class="title-book">{{ item.sach.TENSACH }}</h3>

        <p><strong>Tác giả:</strong> {{ item.sach.TACGIA }}</p>
        <p><strong>Số lượng:</strong> {{ item.SOLUONG }}</p>

        <p>Ngày mượn: {{ format(item.NGAYMUON) }}</p>
        <p>Ngày trả dự kiến: {{ addDays(item.NGAYMUON, 7) }}</p>

        <p v-if="item.NGAYTRA">Ngày trả thực tế: {{ format(item.NGAYTRA) }}</p>

        <!-- ⭐ TIỀN PHẠT (tự tính nếu chưa trả) -->
        <p>
          <strong>Tiền phạt: </strong>
          <span class="fine">
            {{ formatMoney(calcFine(item)) }}
          </span>
        </p>

        <span
          class="status"
          :class="item.DATRASACH === true ? 'da-tra' : 'dang-muon'"
        >
          {{ item.DATRASACH === true ? "Đã trả" : "Đang mượn" }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import NavbarUser from "../../components/NavbarUser.vue";
import axios from "axios";

export default {
  components: { NavbarUser },

  data() {
    return { list: [] };
  },

  async mounted() {
    const token = localStorage.getItem("user_token");
    const decoded = JSON.parse(atob(token.split(".")[1]));
    this.userId = decoded.id;

    const res = await axios.get(
      `http://localhost:3000/api/get-all-LichSuMuon-private?MADOCGIA=${this.userId}`
    );

    this.list = res.data.data;
  },

  methods: {
    format(date) {
      return date ? date.split("T")[0] : "—";
    },

    addDays(dateString, days) {
      const date = new Date(dateString);
      date.setDate(date.getDate() + days);
      return date.toISOString().split("T")[0];
    },

    // ⭐ TÍNH PHẠT CHO SÁCH CHƯA TRẢ
    calcFine(item) {
      const due = new Date(item.NGAYMUON);
      due.setDate(due.getDate() + 7);

      // Nếu đã trả → dùng PHAT trong DB
      if (item.DATRASACH && item.NGAYTRA) {
        return item.PHAT || 0;
      }

      // Nếu chưa trả → tính phạt theo hôm nay
      const today = new Date();

      if (today <= due) return 0;

      const diff = Math.floor((today - due) / (1000 * 60 * 60 * 24));

      return diff * 5000; // mỗi ngày 5.000đ
    },

    // ⭐ Format tiền 125000 → 125.000 đ
    formatMoney(amount) {
      return Number(amount).toLocaleString("vi-VN") + " đ";
    },
  },
};
</script>

<style scoped>
.history-container {
  padding: 20px;
}
.title {
  text-align: center;
  margin-bottom: 25px;
}
.history-list {
  display: grid;
  gap: 18px;
}
.history-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.title-book {
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.status {
  padding: 6px 12px;
  border-radius: 6px;
  display: inline-block;
  margin-top: 10px;
}
.status.da-tra {
  background: #4caf50;
  color: white;
}
.status.dang-muon {
  background: #ff9800;
  color: white;
}
.fine {
  color: #d63031;
  font-weight: 600;
}
.empty {
  text-align: center;
  color: #888;
  margin-top: 20px;
}
</style>
