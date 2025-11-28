<template>
  <div class="admin-layout">
    <SidebarAdmin />

    <div class="admin-book-container">
      <div class="header">
        <h2>Quản lý sách</h2>
        <button class="add-btn" @click="showAdd = true">+ Thêm sách</button>
      </div>

      <input
        v-model="search"
        class="search-box"
        placeholder="Tìm sách theo tên..."
      />

      <table class="book-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên sách</th>
            <th>Tác giả</th>
            <th>Đơn giá</th>
            <th>Số quyển</th>
            <th>Năm xuất bản</th>
            <th>Mã NXB</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in filteredBooks" :key="item.MASACH">
            <td>{{ index + 1 }}</td>
            <td>{{ item.TENSACH }}</td>
            <td>{{ item.TACGIA }}</td>
            <td>{{ formatMoney(item.DONGIA) }}</td>
            <td>{{ item.SOQUYEN }}</td>
            <td>{{ item.NAMXUATBAN }}</td>
            <td>{{ item.MANXB }}</td>

            <td>
              <button class="edit-btn" @click="openEdit(item)">Sửa</button>
              <button class="delete-btn" @click="deleteBook(item)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Modal thêm -->
      <AddBookModal
        :show="showAdd"
        @close="showAdd = false"
        @submit="addBook"
      />

      <!-- Modal sửa -->
      <EditBookModal
        :show="showEdit"
        :bookData="currentBook"
        @update="updateBook"
        @close="showEdit = false"
      />

      <p class="status">{{ status }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import SidebarAdmin from "../../components/NavbarAdmin.vue";
import AddBookModal from "../../components/AddBookModal.vue";
import EditBookModal from "../../components/EditBookModal.vue";

export default {
  components: { SidebarAdmin, AddBookModal, EditBookModal },

  data() {
    return {
      books: [],
      search: "",
      showAdd: false,
      showEdit: false,
      currentBook: null,
      status: "",
    };
  },

  async mounted() {
    await this.loadBooks();
  },

  computed: {
    filteredBooks() {
      return this.books.filter((b) =>
        (b.TENSACH || "").toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },

  methods: {
    // Load tất cả sách
    async loadBooks() {
      const res = await axios.get("http://localhost:3000/api/get-all-sach");
      this.books = res.data.data;
    },

    formatMoney(value) {
      if (!value) return "";
      return Number(value).toLocaleString("vi-VN") + " đ";
    },

    // Thêm sách
    async addBook(data) {
      try {
        await axios.post("http://localhost:3000/api/add-sach", data);
        this.status = "Thêm sách thành công!";
        this.showAdd = false;
        this.loadBooks();
      } catch (err) {
        this.status = "Lỗi khi thêm sách!";
      }
    },

    // Mở modal sửa
    openEdit(book) {
      this.currentBook = { ...book };
      this.showEdit = true;
    },

    // Cập nhật sách
    async updateBook(data) {
      try {
        await axios.patch("http://localhost:3000/api/edit-sach", data);
        this.status = "Cập nhật thành công!";
        this.showEdit = false;
        await this.loadBooks();
      } catch (err) {
        this.status = "Lỗi cập nhật!";
      }
    },

    // Xóa sách
    async deleteBook(item) {
      if (!confirm(`Xóa sách "${item.TENSACH}"?`)) return;

      await axios.delete("http://localhost:3000/api/delete-sach", {
        data: { MASACH: item.MASACH },
      });

      this.status = "Xóa thành công!";
      await this.loadBooks();
    },
  },
};
</script>

<style scoped>
/* --- Layout chung --- */
.admin-layout {
  display: flex;
  background: #f4f6fb;
  min-height: 100vh;
}

.admin-book-container {
  flex: 1;
  padding: 30px;
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
  font-size: 14px;
  border: none;
  cursor: pointer;
  font-weight: 600;
}

.add-btn:hover {
  background: #3d6cf5;
}

/* --- Search box --- */
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

.book-table tbody tr:hover {
  background: #f7faff;
}

.book-table td {
  padding: 14px;
}

/* --- Buttons --- */
.edit-btn {
  background: #ff9800;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
}

.delete-btn {
  background: #ff4d4d;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
}

/* Status */
.status {
  margin-top: 16px;
  font-weight: 600;
}
</style>
