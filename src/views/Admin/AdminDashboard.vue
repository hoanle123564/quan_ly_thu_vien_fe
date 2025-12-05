<template>
  <div class="admin-layout d-flex">
    <SidebarAdmin />

    <div class="content-area flex-grow-1">
      <div class="dashboard-container container-fluid py-3">
        <!-- SUMMARY CARDS -->
        <div class="row g-3 mb-3">
          <div
            v-for="item in summaryCards"
            :key="item.title"
            class="col-xl-3 col-md-6"
          >
            <div class="card shadow-sm border-0 summary-card">
              <div
                class="card-body d-flex justify-content-between align-items-center"
              >
                <div>
                  <h6 class="card-title text-muted m-0">{{ item.title }}</h6>
                  <h3 class="fw-bold mt-2">{{ item.value }}</h3>
                </div>
                <div class="icon-box">
                  <i :class="item.icon"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CHART ROW 1 -->
        <div class="row g-3">
          <!-- LƯỢT MƯỢN THEO THÁNG -->
          <div class="col-lg-8">
            <div class="card shadow-sm border-0">
              <div class="card-header bg-white fw-bold">
                Lượt mượn theo tháng
              </div>
              <div class="card-body chart-box">
                <v-chart :option="borrowMonthOption" autoresize />
              </div>
            </div>
          </div>

          <!-- TRẠNG THÁI MƯỢN SÁCH -->
          <div class="col-lg-4">
            <div class="card shadow-sm border-0">
              <div class="card-header bg-white fw-bold">
                Trạng thái mượn sách
              </div>
              <div class="card-body chart-box">
                <v-chart :option="borrowStatusOption" autoresize />
              </div>
            </div>
          </div>
        </div>

        <!-- CHART ROW 2 -->
        <div class="row g-3 mt-1">
          <div class="col-lg-12">
            <div class="card shadow-sm border-0">
              <div class="card-header bg-white fw-bold">
                Top 5 sách mượn nhiều nhất
              </div>
              <div class="card-body chart-box-large">
                <v-chart :option="topBooksOption" autoresize />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SidebarAdmin from "../../components/NavbarAdmin.vue";
import axios from "axios";

/* ---------------- ECHARTS IMPORT ---------------- */
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";
import VChart from "vue-echarts";

use([
  CanvasRenderer,
  BarChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
]);

export default {
  name: "AdminDashboard",
  components: { SidebarAdmin, VChart },

  data() {
    return {
      /* SUMMARY CARDS */
      summaryCards: [
        { title: "Tổng sách", value: 0, icon: "fas fa-book text-primary" },
        { title: "Độc giả", value: 0, icon: "fas fa-users text-success" },
        {
          title: "Lượt mượn",
          value: 0,
          icon: "fas fa-book-reader text-warning",
        },
        {
          title: "Quá hạn",
          value: 0,
          icon: "fas fa-exclamation-circle text-danger",
        },
      ],

      /* ECharts Options */
      borrowMonthOption: {},
      borrowStatusOption: {},
      topBooksOption: {},
    };
  },

  async mounted() {
    await this.loadSummary();
    await this.loadBorrowMonth();
    await this.loadBorrowStatus();
    await this.loadTopBooks();
  },

  methods: {
    /* ----------- LOAD THỐNG KÊ ----------- */
    async loadSummary() {
      const res = await axios.get("http://localhost:3000/api/summary");
      this.summaryCards[0].value = res.data.totalBooks;
      this.summaryCards[1].value = res.data.totalReaders;
      this.summaryCards[2].value = res.data.totalBorrow;
      this.summaryCards[3].value = res.data.overdue;
    },

    async loadBorrowMonth() {
      const res = await axios.get(
        "http://localhost:3000/api/summary/borrow-by-month"
      );

      const months = Array(12).fill(0);
      res.data.forEach((i) => (months[i._id - 1] = i.count));

      this.borrowMonthOption = {
        tooltip: {},
        legend: { data: ["Lượt mượn"], top: 5 },
        grid: { left: 40, right: 20, bottom: 40, top: 50 },
        xAxis: {
          type: "category",
          data: [
            "T1",
            "T2",
            "T3",
            "T4",
            "T5",
            "T6",
            "T7",
            "T8",
            "T9",
            "T10",
            "T11",
            "T12",
          ],
        },
        yAxis: { type: "value" },
        series: [
          {
            name: "Lượt mượn",
            type: "bar",
            data: months,
            barWidth: 25,
            itemStyle: { color: "#4e73df" },
          },
        ],
      };
    },

    async loadBorrowStatus() {
      const res = await axios.get(
        "http://localhost:3000/api/summary/borrow-status"
      );

      this.borrowStatusOption = {
        tooltip: { trigger: "item" },
        legend: { top: 10 },
        series: [
          {
            type: "pie",
            radius: "65%",
            data: [
              { value: res.data.borrowing, name: "Đang mượn" },
              { value: res.data.returned, name: "Đã trả" },
              { value: res.data.overdue, name: "Quá hạn" },
            ],
            label: { fontSize: 12 },
            itemStyle: {
              color: (params) =>
                ["#36b9cc", "#1cc88a", "#e74a3b"][params.dataIndex],
            },
          },
        ],
      };
    },

    async loadTopBooks() {
      const res = await axios.get(
        "http://localhost:3000/api/summary/top-books"
      );

      const labels = res.data.map((b) => b.book.TENSACH);
      const values = res.data.map((b) => b.total);

      this.topBooksOption = {
        tooltip: {},
        legend: { data: ["Lượt mượn"] },
        grid: { left: 120, right: 30, bottom: 40, top: 40 },
        xAxis: { type: "value" },
        yAxis: {
          type: "category",
          data: labels,
        },
        series: [
          {
            type: "bar",
            data: values,
            barWidth: 22,
            itemStyle: { color: "#f6c23e" },
          },
        ],
      };
    },
  },
};
</script>

<style scoped>
.admin-layout {
  height: 100vh;
  background: #f8f9fc;
}
.admin-layout > *:first-child {
  width: 260px !important;
  min-width: 260px !important;
}
.content-area {
  overflow-y: auto;
  width: 100%;
}

.summary-card {
  border-radius: 12px;
  transition: 0.2s;
}
.summary-card:hover {
  transform: translateY(-3px);
}

.chart-box {
  height: 330px;
}

.chart-box-large {
  height: 420px;
}

.card {
  border-radius: 12px !important;
}
</style>
