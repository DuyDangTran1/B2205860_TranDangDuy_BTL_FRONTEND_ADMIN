<script setup>
import { ref, onMounted } from "vue";
import { refreshToken } from "@/api/token";

const borrow_requests = ref([]);
const isLoading = ref(true);
const accessToken = sessionStorage.getItem("accessToken");

const statusBtn = {
  "Đang chờ duyệt": "Duyệt",
  "Đã duyệt": "Xác nhận mượn",
  "Đã mượn": "Xác nhận trả",
};

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
      if (refresh == "oke") return await loadBorrowRequest();
    }

    borrow_requests.value = result.borrow_requests || [];
    console.log(borrow_requests.value);
    isLoading.value = false;
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  loadBorrowRequest();
});

function formatDate(date) {
  if (!date) return "Chưa xác định";
  const d = new Date(date);
  return d.toLocaleDateString() + " " + d.toLocaleTimeString();
}

const actionBtn = (state) => statusBtn[state];

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
      if (refresh == "oke") return await updateStatus(id);
    }

    if (result.status != 200) alert(result.message);

    await loadBorrowRequest();
    if (result.status == 200) alert(result.message);
    isLoading.value = false;
  } catch (error) {
    console.log(error);
  }
}

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
      if (refresh == "oke") return await cancelBtn(id);
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
    <table class="table table-hover align-middle mt-3">
      <thead class="table-dark">
        <tr>
          <th>STT</th>
          <th>Độc giả</th>
          <th>Tên sách</th>
          <th>Ngày mượn</th>
          <th>Ngày trả</th>
          <th>Phí phạt</th>
          <th>Nhân viên duyệt</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-if="!isLoading"
          v-for="(borrow_request, index) in borrow_requests"
          :key="borrow_request._id"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ borrow_request.TEN_DOCGIA || "Chưa có" }}</td>
          <td>{{ borrow_request.TENSACH || "Chưa có" }}</td>
          <td>{{ formatDate(borrow_request.NGAYMUON) }}</td>
          <td>{{ formatDate(borrow_request.NGAYTRA) }}</td>
          <td>
            {{
              borrow_request.PHUPHAT
                ? borrow_request.PHUPHAT.toLocaleString() + " VND"
                : "0"
            }}
          </td>
          <td>{{ borrow_request.HOTENNV || "Chưa duyệt" }}</td>
          <td>
            <span
              class="px-1 rounded-1"
              :class="{
                'bg-warning': borrow_request.TRANGTHAI === 'Đang chờ duyệt',
                'bg-primary': borrow_request.TRANGTHAI === 'Đã duyệt',
                'bg-info': borrow_request.TRANGTHAI === 'Đã mượn',
                'bg-success': borrow_request.TRANGTHAI === 'Đã trả',
                'bg-danger': ['Đã bị hủy', 'Đã trả muộn'].includes(
                  borrow_request.TRANGTHAI
                ),
                'bg-primary': borrow_request.TRANGTHAI === 'Hoàn tất',
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
              v-on:click="updateStatus(borrow_request._id)"
              class="btn btn-success btn-sm me-2"
            >
              {{ actionBtn(borrow_request.TRANGTHAI) }}
            </button>
            <button
              v-if="
                borrow_request.TRANGTHAI === 'Đang chờ duyệt' ||
                borrow_request.TRANGTHAI === 'Đã duyệt'
              "
              v-on:click="cancelBtn(borrow_request._id)"
              class="btn btn-danger btn-sm"
            >
              Từ chối
            </button>
          </td>
        </tr>
        <tr v-if="isLoading">
          <td colspan="10" class="text-center">Đang tải dữ liệu...</td>
        </tr>
        <tr v-if="!isLoading && borrow_requests.length === 0">
          <td colspan="10" class="text-center">Không có yêu cầu nào</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
