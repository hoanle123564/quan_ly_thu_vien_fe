<template>
  <div class="admin-layout">
    <SidebarAdmin />

    <div class="nxb-container">
      <div class="header">
        <h2>Quản lý Nhà Xuất Bản</h2>
        <button class="add-btn" @click="openAdd">+ Thêm NXB</button>
      </div>

      <!-- 🔍 SEARCH BOX -->
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
          <tr v-for="(item, index) in filteredNXB" :key="item._id">
            <td>{{ index + 1 }}</td>
            <td>{{ item.TENNXB }}</td>
            <td>{{ item.DIACHI }}</td>
            <td>
              <button class="edit-btn" @click="openEdit(item)">Sửa</button>
              <button class="delete-btn" @click="deleteNXB(item)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>

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

export default {
  components: { SidebarAdmin, AddNXBModal },

  data() {
    return {
      nxb: [],
      searchText: "",
      showModal: false,
      isEdit: false,
      form: { _id: "", TenNXB: "", DiaChi: "" },
      status: "",
    };
  },

  computed: {
    filteredNXB() {
      return this.nxb.filter((item) =>
        item.TENNXB.toLowerCase().includes(this.searchText.toLowerCase())
      );
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
      this.form = { _id: "", TenNXB: "", DiaChi: "" };
    },

    openEdit(item) {
      this.isEdit = true;
      this.showModal = true;
      this.form = {
        MANXB: item.MANXB,
        TenNXB: item.TENNXB,
        DiaChi: item.DIACHI,
      };
    },

    closeModal() {
      this.showModal = false;
    },

    async save(data) {
      if (this.isEdit)
        await axios.patch("http://localhost:3000/api/edit-NXB", data);
      else await axios.post("http://localhost:3000/api/add-NXB", data);

      this.status = "Lưu thành công!";
      this.showModal = false;
      this.loadData();
    },

    async deleteNXB(item) {
      if (!confirm("Xóa nhà xuất bản này?")) return;

      await axios.delete("http://localhost:3000/api/delete-NXB", {
        data: { _id: item._id },
      });

      this.status = "Xóa thành công!";
      this.loadData();
    },
  },
};
</script>
<style scoped>
.admin-layout {
  display: flex;
  background: #f4f6fb;
  min-height: 100vh;
}

.nxb-container {
  flex: 1;
  padding: 30px;
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

/* TABLE UI */
/* TABLE UI */
.table {
  width: 100%;
  background: white;
  border-radius: 14px;
  overflow: hidden;
  border-collapse: collapse;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  table-layout: fixed; /* QUAN TRỌNG: Chia cột đều */
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

/* CHIA LẠI TỈ LỆ CỘT – ĐỀU & ĐẸP */
th:nth-child(1),
td:nth-child(1) {
  width: 8%;
} /* STT */
th:nth-child(2),
td:nth-child(2) {
  width: 35%;
} /* Tên NXB */
th:nth-child(3),
td:nth-child(3) {
  width: 30%;
} /* Địa chỉ */
th:nth-child(4),
td:nth-child(4) {
  width: 22%;
} /* Hành động */

/* HOVER ROW */
tbody tr:hover {
  background: #f7faff;
}

/* BUTTONS */
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
</style>
