<template>
  <div class="noti-container" v-if="alerts.length > 0">
    <div
      class="noti-box"
      v-for="item in alerts"
      :key="item._id"
      :class="{ overdue: item.isLate }"
    >
      <i class="fas fa-exclamation-circle"></i>

      <div>
        <strong>{{ item.sach.TENSACH }}</strong>

        <p>Hạn trả: {{ format(dueDate(item.NGAYMUON)) }}</p>

        <!-- THÔNG BÁO -->
        <span v-if="item.isLate" class="urgent">
          ⚠ ĐÃ QUÁ HẠN {{ item.lateDays }} ngày – vui lòng trả ngay!
        </span>

        <span v-else-if="item.remainingDays === 0" class="warning">
          📌 Hôm nay là hạn trả – hãy trả sách!
        </span>

        <span v-else class="warning">
          ⏳ Còn {{ item.remainingDays }} ngày đến hạn trả
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return { alerts: [] };
  },

  async mounted() {
    const token = localStorage.getItem("user_token");
    const decoded = JSON.parse(atob(token.split(".")[1]));
    const userId = decoded.id;

    const res = await axios.get("http://localhost:3000/api/get-all-theodoi");
    const today = new Date();

    const list = res.data.data.filter(
      (i) => i.MADOCGIA === userId && i.DATRASACH === false
    );

    this.alerts = list
      .map((item) => {
        const due = this.dueDate(item.NGAYMUON);
        const diff = Math.floor((due - today) / (1000 * 60 * 60 * 24));

        return {
          ...item,
          remainingDays: diff,
          isLate: diff < 0,
          lateDays: diff < 0 ? Math.abs(diff) : 0,
        };
      })
      .filter((i) => i.remainingDays <= 2 || i.isLate);
  },

  methods: {
    dueDate(ngayMuon) {
      const d = new Date(ngayMuon);
      d.setDate(d.getDate() + 7);
      return d;
    },

    format(date) {
      return date.toISOString().split("T")[0];
    },
  },
};
</script>

<style scoped>
.noti-container {
  padding: 10px;
}

.noti-box {
  background: #fff3cd;
  border-left: 6px solid #e6a500;
  padding: 15px;
  border-radius: 8px;
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

/* QUÁ HẠN */
.noti-box.overdue {
  background: #ffe0e0 !important;
  border-left: 6px solid #ff3b3b !important;
}

.urgent {
  color: #d40000;
  font-weight: bold;
}

.warning {
  color: #b36b00;
  font-weight: bold;
}
</style>
