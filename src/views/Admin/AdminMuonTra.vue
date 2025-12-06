<template>
  <div class="admin-layout d-flex">
    <NavbarAdmin />

    <div class="content-area">
      <div class="header-box">
        <h2>Quản lý mượn – trả sách</h2>

        <select v-model="filter" class="filter-select">
          <option value="">Tất cả</option>
          <option value="false">Đang mượn</option>
          <option value="true">Đã trả</option>
        </select>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>Độc giả</th>
            <th>Sách</th>
            <th>Ngày mượn</th>
            <th>Ngày trả</th>
            <th>Trạng thái</th>
            <th>Phạt</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in paginated" :key="item._id">
            <!-- Độc giả -->
            <td class="text-truncate">
              {{
                item.docgia
                  ? item.docgia.HOLOT + " " + item.docgia.TEN
                  : "Độc giả đã bị xóa"
              }}
            </td>

            <!-- Sách -->
            <td class="text-truncate">
              {{ item.sach ? item.sach.TENSACH : "Sách đã bị xóa" }}
            </td>

            <td>{{ format(item.NGAYMUON) }}</td>

            <td>{{ item.NGAYTRA ? format(item.NGAYTRA) : "—" }}</td>

            <td>
              <span
                class="status"
                :class="item.DATRASACH ? 'da-tra' : 'dang-muon'"
              >
                {{ item.DATRASACH ? "Đã trả" : "Đang mượn" }}
              </span>
            </td>

            <td>
              <span class="fine-text">{{ formatMoney(getFine(item)) }}</span>
            </td>

            <td>
              <button
                v-if="!item.DATRASACH"
                @click="xacNhanTra(item)"
                class="btn-return"
              >
                Xác nhận trả
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="pagination-container">
        <div class="pagination">
          <button :disabled="page === 1" @click="page--">«</button>

          <span>Trang {{ page }} / {{ totalPages }}</span>

          <button :disabled="page >= totalPages" @click="page++">»</button>
        </div>

        <p class="notify">{{ status }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NavbarAdmin from "../../components/NavbarAdmin.vue";
import { useToast } from "vue-toastification";

export default {
  components: { NavbarAdmin },

  setup() {
    const toast = useToast();
    return { toast };
  },

  data() {
    return {
      list: [],
      filter: "",
      status: "",
      page: 1,
      perPage: 10,
    };
  },

  async mounted() {
    await this.loadData();
  },

  computed: {
    filtered() {
      return this.list.filter((i) => {
        // loại bỏ bản ghi rác
        if (!i.docgia || !i.sach) return false;

        if (!this.filter) return true;
        return i.DATRASACH === (this.filter === "true");
      });
    },

    totalPages() {
      return Math.ceil(this.filtered.length / this.perPage);
    },

    paginated() {
      const start = (this.page - 1) * this.perPage;
      return this.filtered.slice(start, start + this.perPage);
    },
  },

  methods: {
    async loadData() {
      const res = await axios.get("http://localhost:3000/api/get-all-theodoi");
      this.list = res.data.data || [];
    },

    format(date) {
      return date ? date.split("T")[0] : "—";
    },

    getFine(item) {
      if (item.DATRASACH) return item.PHAT || 0;

      const due = new Date(item.NGAYMUON);
      due.setDate(due.getDate() + 7);

      const now = new Date();
      if (now <= due) return 0;

      const diffDays = Math.floor((now - due) / (1000 * 60 * 60 * 24));
      return diffDays * 5000;
    },

    formatMoney(amount) {
      return Number(amount).toLocaleString("vi-VN") + " đ";
    },

    async xacNhanTra(item) {
      try {
        await axios.post("http://localhost:3000/api/tra-sach", {
          MADOCGIA: item.MADOCGIA,
          MASACH: item.MASACH,
        });

        this.toast.success("Xác nhận trả sách thành công!");
        await this.loadData(); // reload dữ liệu mới → tránh lỗi null
      } catch {
        this.toast.error("Lỗi khi xác nhận trả sách!");
      }
    },
  },
};
</script>

<style scoped>
/* Layout */
.admin-layout {
  display: flex;
  height: 100vh;
  background: #f4f6fb;
}

.content-area {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}

/* Header + Filter */
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter-select {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
}

/* Table */
.table {
  width: 100%;
  background: white;
  border-radius: 12px;
  border-collapse: collapse;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  table-layout: fixed;
}

.table thead {
  background: #f0f4ff;
}

.table th {
  padding: 14px;
  font-size: 15px;
  font-weight: 700;
  color: #334155;
}

.table td {
  padding: 14px;
  color: #333;
}

/* Truncate */
.text-truncate {
  max-width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.table tbody tr:hover {
  background: #f7faff;
}

/* Status tags */
.status {
  padding: 5px 10px;
  border-radius: 6px;
  color: white;
  font-weight: 600;
  font-size: 12px;
  white-space: nowrap;
  display: inline-block;
}

.da-tra {
  background: #4caf50;
}

.dang-muon {
  background: #ff9800;
}

/* Fine text */
.fine-text {
  white-space: nowrap;
  font-size: 14px;
  font-weight: 500;
}

/* Button */
.btn-return {
  background: #4f7eff;
  color: white;
  border: none;
  padding: 5px 8px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 450;
  white-space: nowrap;
  font-size: 13px;
}

.btn-return:hover {
  background: #3d6cf5;
}

.notify {
  margin-top: 15px;
  font-weight: 600;
}

/* PAGINATION */
.pagination-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}
.pagination {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pagination button {
  padding: 6px 12px;
  border-radius: 8px;
  border: none;
  background: #4f7eff;
  color: white;
  cursor: pointer;
}

.pagination button:disabled {
  background: #b0b8d1;
  cursor: not-allowed;
}

.pagination span {
  font-weight: 600;
}
</style>
