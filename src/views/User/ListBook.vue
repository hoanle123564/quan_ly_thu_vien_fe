<template>
  <div>
    <NavbarUser />
    <div class="book-container">
      <h2 class="title">Danh sách sách</h2>

      <!-- SEARCH INPUT -->
      <div class="search-box">
        <input
          v-model="search"
          placeholder="Tìm sách theo tên..."
          class="search-input"
        />
      </div>

      <div class="book-list">
        <div class="book-card" v-for="item in filteredBooks" :key="item.MASACH">
          <img :src="item.ANH" class="book-img" alt="book cover" />
          <h3 class="book-title">{{ item.TENSACH }}</h3>
          <p>Tác giả: {{ item.TACGIA }}</p>
          <p>Nhà XB: {{ item.TENNXB }}</p>
          <p>Số lượng: {{ item.SOQUYEN }}</p>

          <button class="borrow-btn" @click="muon(item)">Mượn sách</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NavbarUser from "../../components/NavbarUser.vue";

export default {
  components: { NavbarUser },

  data() {
    return {
      books: [],
      search: "",
    };
  },

  async mounted() {
    const res = await axios.get("http://localhost:3000/api/get-all-sach");
    this.books = res.data.data;
    console.log("this.books", this.books);
  },

  computed: {
    filteredBooks() {
      const key = this.search.toLowerCase();
      return this.books.filter((b) => b.TENSACH.toLowerCase().includes(key));
    },
  },

  methods: {
    muon(item) {
      this.$router.push(`/user/muon-sach/${item._id}`);
    },
  },
};
</script>

<style scoped>
.book-container {
  padding: 20px;
}

/* TITLE */
.title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 28px;
  font-weight: 700;
}

/* SEARCH BOX */
.search-box {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.search-input {
  width: 320px;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 15px;
}

/* LIST GRID */
.book-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

/* CARD STYLE */
.book-card {
  background: white;
  padding: 20px;
  border-radius: 14px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  transition: 0.25s;
  min-height: 420px; /* Đảm bảo các card cao bằng nhau */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.book-card:hover {
  transform: translateY(-4px);
}

/* BOOK IMAGE */
.book-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 15px;
  border: 1px solid #e0e0e0;
}

/* TITLE TRUNCATE */
.book-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 10px;

  /* Rút gọn với dấu ... */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.borrow-btn {
  margin-top: 10px;
  width: 100%;
  padding: 10px;
  background: #4f7eff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.borrow-btn:hover {
  background: #3d6cf5;
}
</style>
