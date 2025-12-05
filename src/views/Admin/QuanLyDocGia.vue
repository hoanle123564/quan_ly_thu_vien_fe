<template>
  <div class="admin-layout">
    <SidebarAdmin />

    <div class="admin-book-container">
      <div class="header">
        <h2>Quản lý độc giả</h2>
        <button class="add-btn" @click="openAdd">+ Thêm độc giả</button>
      </div>

      <input
        v-model="search"
        class="search-box"
        placeholder="Tìm độc giả theo tên..."
      />

      <table class="book-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã độc giả</th>
            <th>Tên độc giả</th>
            <th>Số điện thoại</th>
            <th>Địa chỉ</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in paginatedList" :key="item._id">
            <td>{{ (page - 1) * perPage + index + 1 }}</td>
            <td>{{ item.MADOCGIA }}</td>
            <td>{{ item.HOLOT }} {{ item.TEN }}</td>
            <td>{{ item.DIENTHOAI }}</td>
            <td>{{ item.DIACHI }}</td>

            <td>
              <button class="edit-btn" @click="openEdit(item)">Sửa</button>
              <button class="delete-btn" @click="deleteDocGia(item._id)">
                Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- PAGINATION -->
      <div class="pagination">
        <button :disabled="page === 1" @click="page--">«</button>

        <span>Trang {{ page }} / {{ totalPages }}</span>

        <button :disabled="page >= totalPages" @click="page++">»</button>
      </div>

      <!-- Modal thêm/sửa -->
      <DocGiaForm
        :show="showForm"
        :editItem="editItem"
        @close="showForm = false"
        @saved="fetchDocGia"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import SidebarAdmin from "../../components/NavbarAdmin.vue";
import DocGiaForm from "./DocGiaForm.vue";
import { useToast } from "vue-toastification";

export default {
  components: { SidebarAdmin, DocGiaForm },

  setup() {
    const toast = useToast();
    return { toast };
  },

  data() {
    return {
      docGiaList: [],
      search: "",
      showForm: false,
      editItem: null,

      // pagination
      page: 1,
      perPage: 10,
    };
  },

  async mounted() {
    await this.fetchDocGia();
  },

  computed: {
    filteredList() {
      return this.docGiaList.filter((d) => {
        const fullname = `${d.HOLOT} ${d.TEN}`.toLowerCase();
        return fullname.includes(this.search.toLowerCase());
      });
    },

    totalPages() {
      return Math.ceil(this.filteredList.length / this.perPage);
    },

    paginatedList() {
      const start = (this.page - 1) * this.perPage;
      return this.filteredList.slice(start, start + this.perPage);
    },
  },

  methods: {
    async fetchDocGia() {
      const res = await axios.get("http://localhost:3000/api/get-all-docgia");

      this.docGiaList = res.data.data;
      console.log("this.docGiaList", this.docGiaList);
    },

    openAdd() {
      this.editItem = null;
      this.showForm = true;
    },

    openEdit(item) {
      this.editItem = { ...item };
      this.showForm = true;
    },

    async deleteDocGia(id) {
      if (!confirm("Bạn có chắc muốn xóa độc giả này?")) return;

      try {
        let res = await axios.delete(
          `http://localhost:3000/api/delete-docgia/${id}`
        );
        console.log("res", res);

        this.toast.success("Xóa độc giả thành công!");
        await this.fetchDocGia();
      } catch (error) {
        const msg = error.response?.data?.message || "Không thể xóa độc giả!";
        this.toast.error(msg);
      }
    },
  },
};
</script>

<style scoped>
/* --- Layout --- */
.admin-layout {
  display: flex;
  background: #f4f6fb;
  min-height: 100vh;
}

.admin-book-container {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
  width: 100%;
}

/* --- Header --- */
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.add-btn {
  background: #4f7eff;
  color: white;
  padding: 10px 18px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
}

.add-btn:hover {
  background: #3d6cf5;
}

/* --- Search --- */
.search-box {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  width: 300px;
  margin-bottom: 20px;
}

/* --- Table --- */
.book-table {
  width: 100%;
  background: white;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.book-table thead {
  background: #f0f4ff;
}

.book-table th {
  padding: 14px;
  text-align: left;
  font-weight: 700;
  color: #3c4a71;
}

.book-table td {
  padding: 14px;
}

.book-table tbody tr:hover {
  background: #f7faff;
}

/* --- Buttons --- */
.edit-btn {
  background: #ff9800;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  margin-right: 5px;
  cursor: pointer;
}

.delete-btn {
  background: #ff4d4d;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}

/* --- Pagination --- */
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
}

.pagination button {
  padding: 8px 16px;
  border-radius: 8px;
  background: #4f7eff;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 600;
}

.pagination button:disabled {
  background: #b4c4ff;
  cursor: not-allowed;
}

.pagination span {
  font-weight: 600;
  font-size: 15px;
}
</style>
