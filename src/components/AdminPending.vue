<script setup>
import { ref, onMounted, computed } from "vue";
import { refreshToken } from "@/api/token";

const borrow_requests = ref([]);
const isLoading = ref(true);
const accessToken = sessionStorage.getItem("adToken");

// Trạng thái cho nút hành động
const statusBtn = {
  "Đang chờ duyệt": "Duyệt",
  "Đã duyệt": "Xác nhận mượn",
  "Đã mượn": "Xác nhận trả",
};

// Bộ lọc trạng thái
const filterStatus = ref("Tất cả");
const statusOptions = [
  "Tất cả",
  "Đang chờ duyệt",
  "Đã duyệt",
  "Đã bị hủy",
  "Đã trả",
];

// Lọc danh sách theo trạng thái
const filteredRequests = computed(() => {
  if (filterStatus.value === "Tất cả") return borrow_requests.value;
  return borrow_requests.value.filter(
    (req) => req.TRANGTHAI === filterStatus.value
  );
});

// Load danh sách mượn
const loadBorrowRequest = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/dashboard/pending`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });
    const result = await res.json();

    if (result.message === "Token hết hạn hoặc không hợp lệ") {
      const refresh = await refreshToken();
      if (refresh === "oke") return await loadBorrowRequest();
    }

    borrow_requests.value = result.borrow_requests || [];
    isLoading.value = false;
  } catch (error) {
    console.error(error);
  }
};

// Auto update
const autoUpdate = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/dashboard/autoupdate`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });
    const result = await res.json();

    if (result.message === "Token hết hạn hoặc không hợp lệ") {
      const refresh = await refreshToken();
      if (refresh === "oke") return await autoUpdate();
    }
  } catch (error) {}
};

onMounted(() => {
  loadBorrowRequest();
  autoUpdate();
});

// Format ngày giờ
function formatDate(date) {
  if (!date) return "Chưa xác định";
  const d = new Date(date);
  return d.toLocaleDateString() + " " + d.toLocaleTimeString();
}

// Lấy tên nút hành động
const actionBtn = (state) => statusBtn[state];

// Cập nhật trạng thái mượn
async function updateStatus(id) {
  try {
    isLoading.value = true;
    const res = await fetch(
      `http://localhost:3000/api/dashboard/updateState/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      }
    );
    const result = await res.json();

    if (result.message === "Token hết hạn hoặc không hợp lệ") {
      const refresh = await refreshToken();
      if (refresh === "oke") return await updateStatus(id);
    }

    if (result.status != 200) alert(result.message);

    await loadBorrowRequest();
    if (result.status == 200) alert(result.message);
    isLoading.value = false;
  } catch (error) {
    console.log(error);
  }
}

// Hủy yêu cầu mượn
async function cancelBtn(id) {
  try {
    isLoading.value = true;
    const res = await fetch(`http://localhost:3000/api/cancel/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });

    const result = await res.json();
    if (result.message === "Token hết hạn hoặc không hợp lệ") {
      const refresh = await refreshToken();
      if (refresh === "oke") return await cancelBtn(id);
    }

    if (result.status != 200) alert(result.message);
    await loadBorrowRequest();
    isLoading.value = false;
    if (result.status == 200) alert(result.message);
  } catch (error) {
    console.log(error);
  }
}
</script>

<template>
  <section>
    <h4>Danh sách chờ duyệt</h4>

    <!-- Bộ lọc trạng thái ngang -->
    <div class="d-flex align-items-center gap-2 mb-3">
      <label class="mb-0">Lọc theo trạng thái:</label>
      <select v-model="filterStatus" class="form-select form-select-sm w-auto">
        <option v-for="status in statusOptions" :key="status" :value="status">
          {{ status }}
        </option>
      </select>
    </div>

    <table class="table table-hover align-middle mt-3">
      <thead class="table-dark">
        <tr>
          <th style="width: 40px">STT</th>
          <th>Độc giả</th>
          <th>Tên sách</th>
          <th>Ngày mượn</th>
          <th>Ngày trả</th>
          <th style="width: 120px" class="text-end">Phí phạt</th>
          <th>Nhân viên duyệt</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <!-- Dữ liệu -->
        <tr
          v-for="(borrow_request, index) in filteredRequests"
          :key="borrow_request._id"
          v-if="!isLoading"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ borrow_request.TEN_DOCGIA || "Chưa có" }}</td>
          <td>{{ borrow_request.TENSACH || "Chưa có" }}</td>
          <td>{{ formatDate(borrow_request.NGAYMUON) }}</td>
          <td>{{ formatDate(borrow_request.NGAYTRA) }}</td>
          <td class="text-end" style="white-space: nowrap">
            {{
              borrow_request.PHUPHAT
                ? borrow_request.PHUPHAT.toLocaleString() + " VND"
                : "0"
            }}
          </td>
          <td>{{ borrow_request.HOTENNV || "Chưa duyệt" }}</td>
          <td>
            <span
              class="px-1 rounded-1 text-white"
              :class="{
                'bg-warning': borrow_request.TRANGTHAI === 'Đang chờ duyệt',
                'bg-primary': borrow_request.TRANGTHAI === 'Đã duyệt',
                'bg-info': borrow_request.TRANGTHAI === 'Đã mượn',
                'bg-success': borrow_request.TRANGTHAI === 'Đã trả',
                'bg-danger': ['Đã bị hủy', 'Đã trả muộn'].includes(
                  borrow_request.TRANGTHAI
                ),
              }"
            >
              {{ borrow_request.TRANGTHAI }}
            </span>
          </td>
          <td>
            <button
              v-if="
                borrow_request.TRANGTHAI !== 'Đã trả' &&
                borrow_request.TRANGTHAI !== 'Đã trả muộn' &&
                borrow_request.TRANGTHAI !== 'Đã bị hủy'
              "
              class="btn btn-success btn-sm me-2"
              @click="updateStatus(borrow_request._id)"
            >
              {{ actionBtn(borrow_request.TRANGTHAI) }}
            </button>
            <button
              v-if="
                borrow_request.TRANGTHAI === 'Đang chờ duyệt' ||
                borrow_request.TRANGTHAI === 'Đã duyệt'
              "
              class="btn btn-danger btn-sm"
              @click="cancelBtn(borrow_request._id)"
            >
              Từ chối
            </button>
          </td>
        </tr>

        <!-- Đang tải dữ liệu -->
        <tr v-if="isLoading">
          <td colspan="9" class="text-center">Đang tải dữ liệu...</td>
        </tr>

        <!-- Không có dữ liệu -->
        <tr v-if="!isLoading && filteredRequests.length === 0">
          <td colspan="9" class="text-center py-5">Không có yêu cầu nào</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
td {
  white-space: nowrap;
}
</style>
