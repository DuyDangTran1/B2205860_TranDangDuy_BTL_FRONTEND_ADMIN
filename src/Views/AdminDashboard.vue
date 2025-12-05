<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
const logOut = () => {
  sessionStorage.removeItem("adToken");
  router.push("/dashboard/login");
};
</script>

<template>
  <div class="d-flex min-vh-100">
    <nav class="sidebar bg-dark text-white p-3">
      <h4 class="text-center mb-4">Quản trị</h4>
      <ul class="nav flex-column">
        <li class="nav-item mb-2">
          <RouterLink
            to="/admin/pending"
            class="nav-link text-white"
            active-class="active"
          >
            Danh sách chờ duyệt
          </RouterLink>
        </li>
        <li class="nav-item mb-2">
          <RouterLink
            to="/admin/books"
            class="nav-link text-white"
            active-class="active"
          >
            Quản lý sách
          </RouterLink>
        </li>

        <li class="nav-item mb-2">
          <RouterLink
            to="/admin/statistical"
            class="nav-link text-white"
            active-class="active"
          >
            Thống kê
          </RouterLink>
        </li>

        <li class="nav-item mb-2">
          <RouterLink
            to="/admin/users"
            class="nav-link text-white"
            active-class="active"
          >
            Tài khoản người dùng
          </RouterLink>
        </li>
      </ul>
    </nav>

    <main class="flex-grow-1 p-4">
      <div class="mb-4 text-end">
        <div class="dropdown d-inline-block">
          <button
            class="btn p-0 border-0 dropdown-toggle d-flex align-items-center gap-2"
            type="button"
            id="adminDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              src="https://i.pravatar.cc/40"
              alt="avatar"
              class="rounded-circle"
            />
            <span class="fw-semibold">Admin</span>
          </button>

          <ul
            class="dropdown-menu dropdown-menu-end shadow mt-2"
            aria-labelledby="adminDropdown"
          >
            <li class="text-center" v-on:click="logOut">
              <i class="bi bi-box-arrow-right me-2"></i> Đăng xuất
            </li>
          </ul>
        </div>
      </div>

      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.sidebar {
  width: 250px;
  min-height: 100vh;
}
.nav-link.active {
  background-color: #0d6efd;
  border-radius: 5px;
}
</style>
