<template>
  <div class="admin-layout d-flex">
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
            <th style="width: 5%">STT</th>
            <th style="width: 10%">Ảnh</th>
            <th style="width: 20%">Tên sách</th>
            <th style="width: 15%">Tác giả</th>
            <th style="width: 8%">Số quyển</th>
            <th style="width: 10%">Năm xuất bản</th>
            <th style="width: 12%">NXB</th>
            <th style="width: 20%">Hành động</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in paginatedBooks" :key="item.MASACH">
            <td>{{ (page - 1) * perPage + index + 1 }}</td>

            <td>
              <img :src="item.ANH" class="book-img" alt="book-image" />
            </td>

            <td class="text-truncate">{{ item.TENSACH }}</td>
            <td class="text-truncate">{{ item.TACGIA }}</td>

            <td>{{ item.SOQUYEN }}</td>

            <td>{{ item.NAMXUATBAN }}</td>

            <td class="text-truncate">{{ item.TENNXB }}</td>

            <td>
              <button class="edit-btn" @click="openEdit(item)">Sửa</button>
              <button class="delete-btn" @click="deleteBook(item)">Xóa</button>
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

      // Pagination
      page: 1,
      perPage: 10,
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

    totalPages() {
      return Math.ceil(this.filteredBooks.length / this.perPage);
    },

    paginatedBooks() {
      const start = (this.page - 1) * this.perPage;
      return this.filteredBooks.slice(start, start + this.perPage);
    },
  },

  methods: {
    async loadBooks() {
      const res = await axios.get("http://localhost:3000/api/get-all-sach");
      this.books = res.data.data;
      console.log(" this.books", this.books);
    },

    formatMoney(value) {
      if (!value) return "";
      return Number(value).toLocaleString("vi-VN") + " đ";
    },

    async addBook(data) {
      try {
        await axios.post("http://localhost:3000/api/add-sach", data);
        this.status = "Thêm sách thành công!";
        this.showAdd = false;
        await this.loadBooks();
      } catch (err) {
        this.status = "Lỗi khi thêm sách!";
        alert("Lỗi khi thêm sách!");
      }
    },

    openEdit(book) {
      this.currentBook = { ...book };
      this.showEdit = true;
    },

    async updateBook(data) {
      try {
        await axios.patch("http://localhost:3000/api/edit-sach", data);
        this.status = "Cập nhật thành công!";
        alert("Cập nhật sách thành công!");
        this.showEdit = false;
        await this.loadBooks();
      } catch (err) {
        this.status = "Lỗi cập nhật!";
        alert("Lỗi khi cập nhật sách!");
      }
    },

    async deleteBook(item) {
      if (!confirm(`Xóa sách "${item.TENSACH}"?`)) return;

      try {
        await axios.delete("http://localhost:3000/api/delete-sach", {
          data: { MASACH: item.MASACH },
        });

        this.status = "Xóa thành công!";
        alert("Xóa sách thành công!");
        await this.loadBooks();
      } catch (err) {
        this.status = "Lỗi khi xóa sách!";
        alert("Lỗi khi xóa sách!");
      }
    },
  },
};
</script>

<style scoped>
/* --- Layout chung --- */
.admin-layout {
  background: #f4f6fb;
  height: 100vh;
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
  table-layout: fixed;
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

/* Truncate */
.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Buttons */
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

/* Pagination */
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

/* Status */
.status {
  margin-top: 16px;
  font-weight: 600;
}
.book-img {
  width: 60px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #ddd;
}
</style>
