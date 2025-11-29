<template>
  <div class="history-container">
    <NavbarUser />

    <h2 class="title">Lịch sử mượn sách</h2>

    <div v-if="list.length === 0" class="empty">
      Bạn chưa mượn cuốn sách nào.
    </div>

    <div class="history-list">
      <div class="history-card" v-for="item in list" :key="item._id">
        <h3>{{ item.sach.TENSACH }}</h3>
        <p><strong>Tác giả:</strong> {{ item.sach.TACGIA }}</p>
        <p><strong>Số lượng: </strong>{{ item.SOLUONG }}</p>
        <p>Ngày mượn: {{ format(item.NGAYMUON) }}</p>
        <p>Ngày trả dự kiến: {{ addDays(item.NGAYMUON, 7) }}</p>

        <p v-if="item.NGAYTRA">Ngày trả thực tế: {{ format(item.NGAYTRA) }}</p>
        <p><strong>Tiền phạt: </strong>{{ item.PHAT }}</p>

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
    console.log("list lich su muon:", this.list);
  },

  methods: {
    format(date) {
      return date ? date.split("T")[0] : "—";
    },
    addDays(dateString, days) {
      const date = new Date(dateString);
      date.setDate(date.getDate() + days);
      return date.toISOString().split("T")[0]; // format YYYY-MM-DD
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

.empty {
  text-align: center;
  color: #888;
  margin-top: 20px;
}
</style>
