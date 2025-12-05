<template>
  <div class="admin-layout">
    <SidebarAdmin />

    <div class="nxb-container">
      <div class="header">
        <h2>Quản lý Nhà Xuất Bản</h2>
        <button class="add-btn" @click="openAdd">+ Thêm NXB</button>
      </div>

      <!-- SEARCH BOX -->
      <div class="search-box">
        <input
          v-model="searchText"
          placeholder="Tìm kiếm nhà xuất bản..."
          class="search-input"
        />
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên NXB</th>
            <th>Địa chỉ</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in paginatedData" :key="item._id">
            <td>{{ (page - 1) * perPage + index + 1 }}</td>
            <td>{{ item.TENNXB }}</td>
            <td>{{ item.DIACHI }}</td>
            <td>
              <button class="edit-btn" @click="openEdit(item)">Sửa</button>
              <button class="delete-btn" @click="deleteNXB(item)">Xóa</button>
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

      <!-- MODAL -->
      <AddNXBModal
        :show="showModal"
        :isEdit="isEdit"
        :formData="form"
        @save="save"
        @close="closeModal"
      />

      <p class="status">{{ status }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import SidebarAdmin from "../../components/NavbarAdmin.vue";
import AddNXBModal from "../../components/AddNXBModal.vue";
import { useToast } from "vue-toastification";

export default {
  components: { SidebarAdmin, AddNXBModal },

  setup() {
    const toast = useToast();
    return { toast };
  },

  data() {
    return {
      nxb: [],
      searchText: "",
      showModal: false,
      isEdit: false,
      form: { _id: "", TenNXB: "", DiaChi: "" },
      status: "",

      // pagination
      page: 1,
      perPage: 10,
    };
  },

  computed: {
    filteredNXB() {
      return this.nxb.filter((item) =>
        item.TENNXB.toLowerCase().includes(this.searchText.toLowerCase())
      );
    },

    totalPages() {
      return Math.ceil(this.filteredNXB.length / this.perPage);
    },

    paginatedData() {
      const start = (this.page - 1) * this.perPage;
      return this.filteredNXB.slice(start, start + this.perPage);
    },
  },

  async mounted() {
    this.loadData();
  },

  methods: {
    async loadData() {
      const res = await axios.get("http://localhost:3000/api/get-all-NXB");
      this.nxb = res.data.data;
    },

    openAdd() {
      this.isEdit = false;
      this.showModal = true;
      this.form = { TENNXB: "", DIACHI: "" };
    },

    openEdit(item) {
      this.isEdit = true;
      this.showModal = true;
      this.form = {
        MANXB: item.MANXB,
        TENNXB: item.TENNXB,
        DIACHI: item.DIACHI,
      };
    },

    closeModal() {
      this.showModal = false;
    },

    async save(data) {
      try {
        if (this.isEdit) {
          await axios.patch("http://localhost:3000/api/edit-NXB", data);
          this.toast.success("Cập nhật nhà xuất bản thành công!");
        } else {
          await axios.post("http://localhost:3000/api/add-NXB", data);
          this.toast.success("Thêm nhà xuất bản thành công!");
        }

        this.status = "Lưu thành công!";
        this.showModal = false;
        this.loadData();
      } catch (err) {
        this.status = "Lỗi khi lưu!";
        this.toast.error("Lỗi khi lưu nhà xuất bản!");
      }
    },

    async deleteNXB(item) {
      if (!confirm("Xóa nhà xuất bản này?")) return;

      try {
        await axios.delete("http://localhost:3000/api/delete-NXB", {
          data: { MANXB: item.MANXB },
        });

        this.status = "Xóa thành công!";
        this.toast.success("Xóa nhà xuất bản thành công!");
        this.loadData();
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || "Lỗi khi xóa nhà xuất bản!";
        this.status = "Lỗi khi xóa!";
        this.toast.error(errorMsg);
      }
    },
  },
};
</script>

<style scoped>
.admin-layout {
  display: flex;
  background: #f4f6fb;
  height: 100vh;
}

.nxb-container {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
  width: 100%;
}

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

.table {
  width: 100%;
  background: white;
  border-radius: 14px;
  overflow: hidden;
  border-collapse: collapse;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  table-layout: fixed;
}

thead tr {
  background: #eef3ff;
}

th {
  padding: 16px;
  font-weight: 700;
  color: #2c3e50;
  text-align: center;
}

td {
  padding: 16px;
  text-align: center;
  border-bottom: 1px solid #eee;
}

tbody tr:hover {
  background: #f7faff;
}

.edit-btn,
.delete-btn {
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  transition: 0.15s;
}

.edit-btn {
  background: #ff9800;
  color: white;
  margin-right: 6px;
}

.edit-btn:hover {
  background: #e68900;
}

.delete-btn {
  background: #ff4d4d;
  color: white;
}

.delete-btn:hover {
  background: #e33c3c;
}

.search-box {
  margin-bottom: 16px;
}

.search-input {
  width: 260px;
  padding: 10px 14px;
  border: 1px solid #d0d7e6;
  border-radius: 8px;
  font-size: 14px;
}

/* PAGINATION */
.pagination {
  margin-top: 18px;
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
