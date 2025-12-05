<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const error = ref("");

const router = useRouter();

async function handleLogin() {
  error.value = "";
  if (!email.value || !password.value) {
    error.value = "Vui lòng nhập đầy đủ email và mật khẩu";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/dashboard/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ Email: email.value, Password: password.value }),
    });
    const data = await res.json();

    if (res.status !== 200) {
      error.value = data.message || "Đăng nhập thất bại";
      console.log(data);
      return;
    }

    // Lưu token vào sessionStorage
    sessionStorage.setItem("adToken", data.accessToken);

    // Chuyển sang dashboard
    router.push("/");
  } catch (err) {
    console.error(err);
    error.value = "Lỗi server, vui lòng thử lại";
  }
}
</script>

<template>
  <div
    class="container vh-100 d-flex align-items-center justify-content-center"
  >
    <div class="card shadow-sm p-4 w-100" style="max-width: 400px">
      <h3 class="text-center mb-4">Đăng nhập</h3>

      <div v-if="error" class="alert alert-danger py-2" role="alert">
        {{ error }}
      </div>

      <form @submit.prevent="handleLogin" novalidate>
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="form-control"
            placeholder="Nhập email"
            required
          />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Mật khẩu</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="form-control"
            placeholder="Nhập mật khẩu"
            required
          />
        </div>

        <button type="submit" class="btn btn-primary w-100 mb-3 mt-2">
          Đăng nhập
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
body,
html {
  height: 100%;
}
</style>
