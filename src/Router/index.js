import { createRouter, createWebHistory } from "vue-router";
import AdminDashboard from "@/Views/AdminDashboard.vue";
import AdminPending from "@/components/AdminPending.vue";
import AdminBooks from "@/components/AdminBook.vue";
import AdminUsers from "@/components/AdminUsers.vue";
import Statistical from "@/components/Statistical.vue";
import AddBook from "@/components/AddBook.vue";
import { refreshToken } from "@/api/token";
import EditBook from "@/components/EditBook.vue";

const routes = [
  {
    path: "/admin",
    component: AdminDashboard,
    children: [
      { path: "pending", component: AdminPending },
      { path: "books", component: AdminBooks },
      { path: "users", component: AdminUsers },
      { path: "statistical", component: Statistical },
      { path: "/", redirect: "/admin/pending" },
    ],
  },

  {
    path: "/dashboard/login",
    component: () => import("../Views/Login.vue"),
  },

  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: () => import("../Views/Error404.vue"),
  },
  {
    path: "/admin/books/add",
    component: AddBook,
  },
  {
    path: "/admin/books/edit/:id",
    component: EditBook,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  try {
    let accessToken = sessionStorage.getItem("adToken");

    // 1. Nếu vào login → cho qua luôn
    if (to.path === "/dashboard/login") return next();

    // 2. Nếu không có token → thử refresh
    if (!accessToken) {
      const refresh = await refreshToken();
      if (refresh !== "oke") return next("/dashboard/login");

      // Lấy lại token mới sau refresh
      accessToken = sessionStorage.getItem("adToken");
      if (!accessToken) return next("/dashboard/login");
    }

    // 3. Chỉ check /admin routes
    if (to.path.startsWith("/admin")) {
      const resp = await fetch(
        "http://localhost:3000/api/dashboard/isEmployee",
        {
          method: "GET",
          headers: { Authorization: "Bearer " + accessToken },
          credentials: "include",
        }
      );

      if (resp.status !== 200) {
        sessionStorage.removeItem("adToken"); // xóa đúng token
        return next("/dashboard/login"); // trả về login và dừng guard
      }
    }

    // 4. Các trường hợp khác → cho qua
    return next();
  } catch (error) {
    return next("/dashboard/login");
  }
});

export default router;
