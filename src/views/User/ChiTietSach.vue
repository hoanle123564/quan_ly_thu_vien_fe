<template>
  <div class="detail-container">
    <NavbarUser />

    <!--  SEARCH BOX -->
    <div class="search-bar">
      <input
        v-model="searchText"
        @input="searchBook"
        class="search-input"
        placeholder="Tìm sách theo tên..."
      />

      <!-- RESULTS DROPDOWN -->
      <div v-if="suggestions.length > 0" class="suggest-box">
        <div
          class="suggest-item"
          v-for="item in suggestions"
          :key="item._id"
          @click="goToDetail(item._id)"
        >
          {{ item.TENSACH }}
        </div>
      </div>
    </div>

    <div class="detail-box" v-if="sach">
      <img class="cover" :src="sach.HinhAnh || defaultImg" />

      <div class="info">
        <h2>{{ sach.TENSACH }}</h2>
        <p>Tác giả: {{ sach.TACGIA }}</p>
        <p>Nhà xuất bản: {{ sach.TENNXB }}</p>
        <p>Số lượng còn: {{ sach.SOQUYEN }}</p>

        <button class="borrow-btn" @click="muon">Mượn sách</button>
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
      sach: null,
      allBooks: [],
      searchText: "",
      suggestions: [],
      defaultImg: "https://i.imgur.com/OBeKBxP.png",
    };
  },

  async mounted() {
    const res = await axios.get("http://localhost:3000/api/get-all-sach");
    this.allBooks = res.data.data;

    const id = this.$route.params.id;
    this.sach = this.allBooks.find((i) => i._id === id);
  },

  methods: {
    searchBook() {
      if (!this.searchText.trim()) {
        this.suggestions = [];
        return;
      }

      this.suggestions = this.allBooks.filter((b) =>
        b.TENSACH.toLowerCase().includes(this.searchText.toLowerCase())
      );
    },

    goToDetail(id) {
      this.$router.push(`/user/chitiet-sach/${id}`);
      this.suggestions = [];
      this.searchText = "";
    },

    muon() {
      this.$router.push(`/user/muon-sach/${this.sach._id}`);
    },
  },
};
</script>

<style scoped>
/* SEARCH BAR */
.search-bar {
  width: 100%;
  padding: 20px 30px 0;
  position: relative;
}

.search-input {
  width: 300px;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.suggest-box {
  position: absolute;
  background: white;
  width: 300px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-top: 5px;
  z-index: 50;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.suggest-item {
  padding: 10px;
  cursor: pointer;
}

.suggest-item:hover {
  background: #f0f4ff;
}

/* DETAIL UI */
.detail-box {
  display: flex;
  gap: 25px;
  padding: 30px;
}

.cover {
  width: 180px;
  border-radius: 12px;
}

.borrow-btn {
  margin-top: 20px;
  width: 200px;
  padding: 12px;
  background: #4f7eff;
  color: white;
  border-radius: 8px;
  border: none;
}
</style>
