<template>
  <div>
    <NavbarUser />
    <div class="history-container">
      <h2 class="title">Lịch sử mượn sách</h2>

      <!-- SEARCH -->
      <input
        v-model="search"
        class="search-box"
        placeholder="Tìm kiếm theo tên sách..."
      />

      <!-- TABLE -->
      <table class="history-table">
        <thead>
          <tr>
            <th>Tên sách</th>
            <th>Tác giả</th>
            <th>Số lượng</th>
            <th>Ngày mượn</th>
            <th>Ngày trả dự kiến</th>
            <th>Ngày trả thực tế</th>
            <th>Tiền phạt</th>
            <th>Trạng thái</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in paginatedList" :key="item._id">
            <td>{{ item.sach ? item.sach.TENSACH : "Sách đã bị xóa" }}</td>

            <td>{{ item.sach.TACGIA }}</td>
            <td>{{ item.SOLUONG }}</td>

            <td>{{ format(item.NGAYMUON) }}</td>
            <td>{{ addDays(item.NGAYMUON, 7) }}</td>

            <td>{{ item.NGAYTRA ? format(item.NGAYTRA) : "—" }}</td>

            <td class="fine">{{ formatMoney(calcFine(item)) }}</td>

            <td>
              <span :class="item.DATRASACH ? 'status done' : 'status pending'">
                {{ item.DATRASACH ? "Đã trả" : "Đang mượn" }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- EMPTY -->
      <div v-if="filteredList.length === 0" class="empty">
        Không tìm thấy kết quả.
      </div>

      <!-- PAGINATION -->
      <div class="pagination">
        <button :disabled="page === 1" @click="page--">Trước</button>

        <span>Trang {{ page }} / {{ totalPages }}</span>

        <button :disabled="page === totalPages" @click="page++">Sau</button>
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
    return {
      list: [],
      search: "",
      page: 1,
      pageSize: 5,
    };
  },

  computed: {
    filteredList() {
      return this.list.filter((item) => {
        if (!item.sach) return false; // tránh lỗi null
        return item.sach.TENSACH.toLowerCase().includes(
          this.search.toLowerCase()
        );
      });
    },
    totalPages() {
      return Math.ceil(this.filteredList.length / this.pageSize) || 1;
    },

    paginatedList() {
      const start = (this.page - 1) * this.pageSize;
      return this.filteredList.slice(start, start + this.pageSize);
    },
  },

  watch: {
    search() {
      this.page = 1;
    },
  },

  async mounted() {
    const token = localStorage.getItem("user_token");
    const decoded = JSON.parse(atob(token.split(".")[1]));
    const userId = decoded.id;

    const res = await axios.get(
      `http://localhost:3000/api/get-all-LichSuMuon-private?MADOCGIA=${userId}`
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

    calcFine(item) {
      const due = new Date(item.NGAYMUON);
      due.setDate(due.getDate() + 7);

      if (item.DATRASACH && item.NGAYTRA) return item.PHAT || 0;

      const today = new Date();
      if (today <= due) return 0;

      const diff = Math.floor((today - due) / (1000 * 60 * 60 * 24));

      return diff * 5000;
    },

    formatMoney(amount) {
      return Number(amount).toLocaleString("vi-VN") + " đ";
    },
  },
};
</script>

<style scoped>
.history-container {
  padding: 25px;
}

.title {
  text-align: center;
  margin-bottom: 20px;
}

.search-box {
  width: 300px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-bottom: 15px;
  display: block;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.history-table th,
.history-table td {
  padding: 12px;
  border-bottom: 1px solid #f1f1f1;
  text-align: left;
}

.history-table th {
  background: #fafafa;
  font-weight: 600;
}

.status {
  padding: 6px 10px;
  border-radius: 6px;
  color: white;
  font-size: 12px;
}

.status.done {
  background: #27ae60;
}
.status.pending {
  background: #f39c12;
}

.fine {
  color: #d63031;
  font-weight: bold;
}

.empty {
  text-align: center;
  color: #888;
  margin-top: 15px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 15px;
}

.pagination button {
  padding: 6px 14px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
