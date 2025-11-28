<template>
  <div class="user-home">
    <NavbarUser />

    <div class="banner">
      <h1>Xin chào {{ userName }} 👋</h1>
      <p>Chào mừng bạn đến với hệ thống thư viện Life Library</p>
    </div>

    <div class="features">
      <div class="card" @click="goTo('muon-sach')">
        <i class="fas fa-book-open"></i>
        <h3>Mượn sách</h3>
        <p>Chọn sách và gửi yêu cầu mượn nhanh chóng.</p>
      </div>

      <div class="card" @click="goTo('tra-sach')">
        <i class="fas fa-undo"></i>
        <h3>Trả sách</h3>
        <p>Gửi yêu cầu trả sách hoặc gia hạn.</p>
      </div>

      <div class="card" @click="goTo('lich-su')">
        <i class="fas fa-history"></i>
        <h3>Lịch sử mượn</h3>
        <p>Theo dõi sách đã mượn, hạn trả và trạng thái.</p>
      </div>

      <div class="card" @click="goTo('thong-tin')">
        <i class="fas fa-user"></i>
        <h3>Thông tin cá nhân</h3>
        <p>Xem và chỉnh sửa thông tin tài khoản.</p>
      </div>
    </div>
  </div>
</template>

<script>
import NavbarUser from "../../components/NavbarUser.vue";

export default {
  components: { NavbarUser },

  data() {
    return {
      userName: "Độc giả", // sau này lấy từ JWT
    };
  },

  methods: {
    goTo(page) {
      this.$router.push(`/user/${page}`);
    },
  },
};
</script>

<style scoped>
.user-home {
  min-height: 100vh;
  background: #f4f6fb;
}

/* BANNER */
.banner {
  background: linear-gradient(135deg, #4f7eff, #7ba7ff);
  padding: 50px;
  color: white;
  text-align: center;
  border-radius: 0 0 25px 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  animation: fadeInDown 0.6s ease;
}

.banner h1 {
  font-size: 36px;
  font-weight: 700;
}

.banner p {
  font-size: 18px;
  opacity: 0.9;
  margin-top: 10px;
}

/* FEATURE CARDS */
.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 25px;
  padding: 40px;
}

.card {
  background: white;
  padding: 25px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: 0.25s ease;
  animation: fadeIn 0.6s ease;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.18);
}

.card i {
  font-size: 40px;
  margin-bottom: 15px;
  color: #4f7eff;
}

.card h3 {
  font-size: 20px;
  margin-bottom: 10px;
}

.card p {
  color: #666;
  font-size: 15px;
}

/* ANIMATIONS */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
