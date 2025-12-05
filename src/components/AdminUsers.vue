<template>
  <section>
    <h4>Tài khoản người dùng</h4>

    <table class="table table-hover align-middle mt-3">
      <thead class="table-dark">
        <tr>
          <th>Mã người dùng</th>
          <th>Họ tên</th>
          <th>Email</th>
          <th>Điện thoại</th>
          <th>Vi phạm</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.phone }}</td>

          <!-- VI PHẠM + CHẤM ĐỎ -->
          <td>
            {{ user.violations }}
            <span
              v-if="user.violations >= 3"
              class="ms-2"
              style="
                display: inline-block;
                width: 10px;
                height: 10px;
                background: red;
                border-radius: 50%;
              "
            ></span>
          </td>

          <!-- TRẠNG THÁI -->
          <td>
            <span
              :class="['badge', user.active ? 'bg-success' : 'bg-secondary']"
            >
              {{ user.active ? "Hoạt động" : "Đã khóa" }}
            </span>
          </td>

          <!-- HÀNH ĐỘNG -->
          <td>
            <button
              class="btn btn-sm"
              :class="user.active ? 'btn-danger' : 'btn-success'"
              @click="toggleUser(user)"
              :disabled="user.loading"
            >
              <!-- show spinner khi đang chờ -->
              <span
                v-if="user.loading"
                class="spinner-border spinner-border-sm me-1"
                role="status"
                aria-hidden="true"
              ></span>
              {{ user.active ? "Khóa" : "Mở khóa" }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
export default {
  data() {
    return {
      users: [],
    };
  },

  async mounted() {
    await this.loadUsers();
  },

  methods: {
    async loadUsers() {
      try {
        const accessToken = sessionStorage.getItem("adToken");

        const res = await fetch("http://localhost:3000/api/dashboard/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        });

        if (!res.ok) {
          const err = await res.text();
          console.error("Failed to load users:", res.status, err);
          return;
        }

        const json = await res.json();
        console.log("Load users:", json);

        this.users = json.users.map((u) => ({
          id: u.MADOCGIA,
          name: u.HOTEN,
          email: u.EMAIL,
          phone: u.DIENTHOAI,
          violations: u.VIOLATIONS,
          // block = true -> bị khóa, active = false
          active: !u.block,
          loading: false, // flag khi gọi api toggle
        }));
      } catch (err) {
        console.error("Lỗi loadUsers:", err);
      }
    },

    async toggleUser(user) {
      // disable nếu đang request
      if (user.loading) return;

      try {
        user.loading = true;

        const accessToken = sessionStorage.getItem("adToken");

        // IMPORTANT:
        // Backend lưu `block` (true = khóa). Frontend sử dụng `active = !block`.
        // current: user.active
        // newBlock (giá trị block muốn gửi) = !currentBlock
        // currentBlock = !user.active => newBlock = !(!user.active) = user.active
        // Vì vậy: gửi newBlock = user.active
        const newBlock = user.active;

        console.log(
          "Gửi state mới (block):",
          newBlock,
          "cho email:",
          user.email
        );

        const res = await fetch(
          "http://localhost:3000/api/dashboard/users/update-block",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              email: user.email,
              state: newBlock,
            }),
          }
        );

        // nếu backend trả lỗi http
        if (!res.ok) {
          const text = await res.text();
          console.error("Update failed", res.status, text);
          // giữ nguyên trạng thái cũ; hiển thị alert (tuỳ em)
          alert("Cập nhật thất bại: " + res.status);
          return;
        }

        const json = await res.json();
        console.log("Toggle user response:", json);

        // Update UI theo kết quả backend (block boolean)
        if (typeof json.block === "boolean") {
          user.active = !json.block; // block true -> active false
        } else {
          user.active = !Boolean(json.block);
        }
      } catch (err) {
        console.error("Lỗi toggleUser:", err);
        alert("Có lỗi xảy ra, thử lại sau.");
      } finally {
        user.loading = false;
      }
    },
  },
};
</script>
