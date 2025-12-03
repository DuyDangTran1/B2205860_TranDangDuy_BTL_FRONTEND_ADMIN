<template>
  <div class="container mt-5">
    <div
      class="header-section mb-4 d-flex align-items-center justify-content-between"
    >
      <h2 class="fw-bold m-0 text-dark">Thống Kê Mượn Sách</h2>

      <div class="dropdown-wrapper">
        <select v-model="selectedChart" class="form-select w-auto">
          <option value="borrow">Số lượt mượn theo tháng</option>
          <option value="late">Số lượt trả muộn theo tháng</option>
          <option value="status">Thống kê trạng thái yêu cầu</option>
        </select>
      </div>
    </div>

    <hr class="mb-5" />

    <div class="chart-container">
      <h4 class="text-center fw-semibold mb-4 text-secondary">
        {{ chartTitle }}
      </h4>

      <div class="chart-wrapper">
        <div class="chart-box" v-if="selectedChart !== 'status'">
          <Bar :data="currentChartData" :options="chartOptions" />
        </div>

        <div class="doughnut-box" v-if="selectedChart === 'status'">
          <Doughnut :data="statusChartData" :options="chartOptions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

// ChartJS imports... (giữ nguyên phần này)
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Doughnut } from "vue-chartjs";

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

// ====================== DATA ======================
const selectedChart = ref("status");

const borrowChartData = ref({
  labels: [],
  datasets: [{ label: "Số lượt mượn", data: [], backgroundColor: "#36A2EB" }],
});

const lateChartData = ref({
  labels: [],
  datasets: [
    { label: "Số lượt trả muộn", data: [], backgroundColor: "#FF6384" },
  ],
});

const statusChartData = ref({
  labels: [],
  datasets: [
    {
      label: "Thống kê trạng thái",
      data: [],
      backgroundColor: [
        "#36A2EB", // Đang chờ duyệt (Blue)
        "#4BC0C0", // Đã duyệt (Cyan)
        "#9966FF", // Đã mượn (Purple)
        "#FFCD56", // Đã trả (Yellow)
        "#FF6384", // Đã trả muộn (Red)
        "#C9CBCF", // Đã bị hủy (Gray)
      ],
    },
  ],
});

// ====================== FETCH API ======================
async function loadStatistics() {
  // ... (giữ nguyên logic fetch API)
  try {
    const token = sessionStorage.getItem("accessToken");

    const res = await fetch("http://localhost:3000/api/dashboard/statistics", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    // Biểu đồ lượt mượn
    borrowChartData.value = {
      labels: data.months,
      datasets: [
        {
          label: "Số lượt mượn theo tháng",
          data: data.borrowCounts,
          backgroundColor: "#36A2EB",
        },
      ],
    };

    // Biểu đồ trả muộn
    lateChartData.value = {
      labels: data.months,
      datasets: [
        {
          label: "Số lượt trả muộn theo tháng",
          data: data.lateCounts,
          backgroundColor: "#FF6384",
        },
      ],
    };

    // Biểu đồ trạng thái tổng hợp
    statusChartData.value = {
      labels: data.statusLabels,
      datasets: [
        {
          label: "Số lượng",
          data: data.statusCounts,
          backgroundColor: [
            "#36A2EB",
            "#4BC0C0",
            "#9966FF",
            "#FFCD56",
            "#FF6384",
            "#C9CBCF",
          ],
        },
      ],
    };
  } catch (err) {
    console.error("Lỗi fetch thống kê:", err);
  }
}

onMounted(() => {
  loadStatistics();
});

// ====================== CHỌN BIỂU ĐỒ & TIÊU ĐỀ ======================
const currentChartData = computed(() => {
  if (selectedChart.value === "borrow") return borrowChartData.value;
  if (selectedChart.value === "late") return lateChartData.value;
  return statusChartData.value;
});

const chartTitle = computed(() => {
  if (selectedChart.value === "borrow")
    return "Số lượt mượn sách theo từng tháng";
  if (selectedChart.value === "late")
    return "Số lượt trả sách muộn theo từng tháng";
  return "Tỷ lệ trạng thái các yêu cầu mượn sách";
});

// ====================== OPTIONS ======================
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "bottom",
      labels: {
        padding: 20,
        font: { size: 14 },
      },
    },
  },
  // Options cho Bar Chart
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: "rgba(0, 0, 0, 0.05)" },
      ticks: { precision: 0 },
    },
    x: {
      grid: { display: false },
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 1000px;
}

/* Bố cục Header: Tiêu đề và Dropdown nằm ngang */
.header-section {
  /* d-flex, align-items-center, justify-content-between đã được thêm vào template */
}

/* Dropdown chỉ rộng bằng nội dung */
.dropdown-wrapper select {
  width: 250px !important; /* Đặt chiều rộng cố định cho dropdown */
  min-width: 200px;
}

/* Container chứa biểu đồ */
.chart-container {
  padding: 1rem;
}

.chart-wrapper {
  /* Đảm bảo biểu đồ nằm giữa */
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 🟦 Bar Chart (Mượn/Trả muộn) - Chiếm không gian ngang tốt hơn */
.chart-box {
  width: 90%;
  max-width: 700px; /* Giới hạn để không quá rộng */
  height: 400px;
}

/* 🍩 Doughnut Chart (Trạng thái) - Cân đối hình tròn */
.doughnut-box {
  width: 100%;
  max-width: 400px;
  height: 400px;
}
</style>
