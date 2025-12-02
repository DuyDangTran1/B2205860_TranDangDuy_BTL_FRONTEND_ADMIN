import { createRouter, createWebHistory } from "vue-router";
import AdminDashboard from "@/Views/AdminDashboard.vue";
import AdminPending from "@/components/AdminPending.vue";
import AdminBooks from "@/components/AdminBook.vue";
import AdminUsers from "@/components/AdminUsers.vue";
import { refreshToken } from "@/api/token";

const routes = [
  {
    path: "/admin",
    component: AdminDashboard,
    children: [
      { path: "pending", component: AdminPending },
      { path: "books", component: AdminBooks },
      { path: "users", component: AdminUsers },
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, formatPostcssSourceMap, next) => {
  let accessToken = sessionStorage.getItem("accessToken");

  try {
    //Nếu không có accessToken thì thử refesh lại
    if (!accessToken) {
      if (to.path == "/dashboard/login") return next();
      const refresh = await refreshToken();
      if (refresh != "oke") return next("/dashboard/login");
    }
  } catch (error) {
    return next("/dashboard/login");
  }

  // Còn thiếu nếu có accessToken nhưng hết hạn với refreshToken hết hạn thì đẩy về
  // /dashboard/login
  // .......

  // nếu có accessToken và path là login thì đưa về /
  if (accessToken && to.path == "/dashboard/login") return next("/");

  //Các trường hợp khác thì bỏ qua
  next();
});
export default router;
