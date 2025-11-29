<template>
  <div class="book-container">
    <NavbarUser />

    <h2 class="title">Danh sách sách</h2>

    <div class="book-list">
      <div class="book-card" v-for="item in books" :key="item.MASACH">
        <h3>{{ item.TENSACH }}</h3>
        <p>Tác giả: {{ item.TACGIA }}</p>
        <p>Nhà XB: {{ item.TENNXB }}</p>
        <p>Số lượng: {{ item.SOQUYEN }}</p>

        <button class="borrow-btn" @click="muon(item)">Mượn sách</button>
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
    };
  },

  async mounted() {
    const res = await axios.get("http://localhost:3000/api/get-all-sach");
    this.books = res.data.data;
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

.title {
  text-align: center;
  margin-bottom: 25px;
}

.book-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.book-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  transition: 0.25s;
}

.book-card:hover {
  transform: translateY(-4px);
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
</style>
