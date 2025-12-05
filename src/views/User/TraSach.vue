<template>
  <div class="return-container">
    <NavbarUser />

    <h2 class="title">Sách đang mượn</h2>

    <p v-if="dsMuon.length === 0" class="empty-msg">
      Bạn hiện không có sách nào cần trả.
    </p>

    <div class="book-list" v-else>
      <div class="book-item" v-for="item in dsMuon" :key="item._id">
        <h3 class="truncate">{{ item.sach.TENSACH }}</h3>

        <p>Tác giả: {{ item.sach.TACGIA }}</p>
        <p>Số lượng: {{ item.SOLUONG }}</p>

        <p>Ngày mượn: {{ item.NGAYMUON.split("T")[0] }}</p>
        <p>Ngày mượn tối đa: {{ formatDueDate(item.NGAYMUON) }}</p>

        <p class="fine">
          Phạt: <strong>{{ formatMoney(calcFine(item.NGAYMUON)) }}</strong>
        </p>

        <button class="return-btn" @click="handleTra(item)">Trả sách</button>
      </div>
    </div>

    <p class="status">{{ status }}</p>
  </div>
</template>

<script>
import axios from "axios";
import NavbarUser from "../../components/NavbarUser.vue";

export default {
  components: { NavbarUser },

  data() {
    return {
      dsMuon: [],
      status: "",
      userId: null,
    };
  },

  async mounted() {
    const token = localStorage.getItem("user_token");
    const decoded = JSON.parse(atob(token.split(".")[1]));

    this.userId = decoded.id;
    this.loadBorrowedBooks();
  },

  methods: {
    formatDueDate(ngayMuon) {
      const date = new Date(ngayMuon);
      date.setDate(date.getDate() + 7);
      return date.toISOString().split("T")[0];
    },

    calcFine(ngayMuon) {
      const due = new Date(ngayMuon);
      const today = new Date();
      due.setDate(due.getDate() + 7);

      if (today <= due) return 0;

      const diffDays = Math.floor((today - due) / (1000 * 60 * 60 * 24));
      return diffDays * 5000;
    },

    formatMoney(amount) {
      return Number(amount).toLocaleString("vi-VN") + " đ";
    },

    async loadBorrowedBooks() {
      const res = await axios.get(
        `http://localhost:3000/api/get-all-theodoi-private?MADOCGIA=${this.userId}`
      );
      this.dsMuon = res.data.data.filter((item) => !item.DATRASACH);
    },

    async handleTra(item) {
      try {
        await axios.post("http://localhost:3000/api/tra-sach", {
          MADOCGIA: item.docgia.MADOCGIA,
          MASACH: item.sach.MASACH,
        });

        this.status = "Trả sách thành công!";
        alert("Trả sách thành công!");
        this.loadBorrowedBooks();
      } catch {
        this.status = "Lỗi! Không thể trả sách.";
        alert("Lỗi! Không thể trả sách.");
      }
    },
  },
};
</script>

<style scoped>
.return-container {
  padding: 20px;
}

.title {
  text-align: center;
  margin-bottom: 25px;
}

.empty-msg {
  text-align: center;
  margin-top: 40px;
  font-size: 18px;
  color: #888;
}

/* GRID ĐỀU CÁC CARD */
.book-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 22px;
}

/* CARD ĐỀU CHIỀU CAO */
.book-item {
  background: white;
  padding: 20px;
  border-radius: 14px;
  min-height: 350px; /* Giữ chiều cao đồng đều */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* RÚT GỌN TÊN SÁCH */
.truncate {
  font-size: 20px;
  font-weight: 700;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fine {
  font-size: 16px;
  color: #d63031;
  font-weight: 600;
}

.return-btn {
  margin-top: 12px;
  width: 100%;
  background: #ff4d4d;
  color: white;
  padding: 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}
</style>
