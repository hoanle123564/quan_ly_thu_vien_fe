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
            <th style="width: 13%">Độc giả</th>
            <th style="width: 22%">Sách</th>
            <th style="width: 11%">Ngày mượn</th>
            <th style="width: 11%">Ngày trả</th>
            <th style="width: 10%">Trạng thái</th>
            <th style="width: 12%">Phạt</th>
            <th style="width: 13%">Hành động</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in paginated" :key="item._id">
            <td class="text-truncate">
              {{ item.docgia.HOLOT }} {{ item.docgia.TEN }}
            </td>

            <td class="text-truncate">{{ item.sach.TENSACH }}</td>

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

            <!-- ⭐ Phạt: tính nếu chưa trả -->
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

      <!-- PAGINATION -->
      <div class="pagination-container">
        <div class="pagination">
          <button :disabled="page == 1" @click="page--">«</button>

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
    const res = await axios.get("http://localhost:3000/api/get-all-theodoi");
    this.list = res.data.data;
  },

  computed: {
    filtered() {
      if (!this.filter) return this.list;
      return this.list.filter((i) => i.DATRASACH === (this.filter === "true"));
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
    format(date) {
      return date ? date.split("T")[0] : "—";
    },

    // ⭐ Hàm tính phạt nếu chưa trả
    getFine(item) {
      if (item.DATRASACH === true) {
        return item.PHAT || 0;
      }

      const ngayMuon = new Date(item.NGAYMUON);
      const today = new Date();

      ngayMuon.setDate(ngayMuon.getDate() + 7);

      if (today <= ngayMuon) return 0;

      const diffTime = today - ngayMuon;
      const diffDay = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      return diffDay * 5000; // 5.000đ / ngày
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

        this.status = "Đã xác nhận trả sách!";
        this.toast.success("Xác nhận trả sách thành công!");
        item.DATRASACH = true;
      } catch {
        this.status = "Lỗi trong quá trình cập nhật!";
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
