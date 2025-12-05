<template>
  <section>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4>Quản lý sách</h4>
    </div>

    <div class="mb-3 d-flex align-items-center justify-content-between">
      <div class="d-flex align-items-center">
        <span class="me-3">Tìm kiếm sách:</span>
        <input
          type="text"
          class="form-control"
          style="width: 300px"
          placeholder="Tìm kiếm theo Tên sách..."
          v-model="searchTerm"
        />
      </div>

      <div>
        <router-link to="/admin/books/add" class="btn btn-primary">
          + Thêm sách mới
        </router-link>
      </div>
    </div>
    <table class="table table-striped align-middle table-sm">
      <thead class="table-dark">
        <tr>
          <th>Mã sách</th>
          <th>Tên sách</th>
          <th>Tác giả</th>
          <th>Thể loại</th>
          <th>Nhà xuất bản</th>
          <th>Số quyển</th>
          <th>Đơn giá</th>
          <th>Hành động</th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="isLoading">
          <td colspan="8" class="text-center text-muted">
            <div class="spinner-border spinner-border-sm me-2" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            Đang tải dữ liệu...
          </td>
        </tr>

        <template v-else>
          <tr v-for="book in filteredBooks" :key="book.MASACH">
            <td>{{ book.MASACH }}</td>
            <td>{{ book.TENSACH }}</td>
            <td>{{ book.TACGIA }}</td>
            <td>{{ book.TENTHELOAI }}</td>
            <td>{{ book.TENNHAXB }}</td>
            <td>{{ book.SOQUYEN }}</td>
            <td>{{ formatPrice(book.DONGIA) }}</td>
            <td>
              <RouterLink :to="`/admin/books/edit/${book._id}`"
                ><button class="btn btn-warning btn-sm me-2">
                  Sửa
                </button></RouterLink
              >
              <button
                class="btn btn-danger btn-sm"
                @click="deleteBook(book._id)"
              >
                Xóa
              </button>
            </td>
          </tr>
          <tr v-if="filteredBooks.length === 0">
            <td colspan="8" class="text-center text-muted">
              Không tìm thấy sách nào phù hợp.
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </section>
</template>

<script>
export default {
  name: "AdminBooks",
  data() {
    return {
      searchTerm: "",
      books: [], // Khởi tạo là mảng rỗng
      isLoading: true, // Khởi tạo trạng thái loading
    };
  },

  computed: {
    filteredBooks() {
      const term = this.searchTerm.toLowerCase();

      if (!term) {
        return this.books; // Trả về books từ data()
      }

      // Lọc danh sách sách - CHỈ LỌC THEO TÊN SÁCH (TENSACH)
      return this.books.filter((book) => {
        // Kiểm tra nếu book.TENSACH tồn tại trước khi gọi toLowerCase()
        return book.TENSACH && book.TENSACH.toLowerCase().includes(term);
      });
    },
  },

  methods: {
    addBook() {
      alert("Chức năng thêm sách đang được phát triển.");
    },

    formatPrice(value) {
      if (!value) return "";
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    },

    // Hàm gọi API load sách
    async loadBooks() {
      this.isLoading = true;
      const accessToken = sessionStorage.getItem("adToken");
      // Giả định bạn có hàm refreshToken() trong methods hoặc global
      const refreshToken = this.refreshToken;

      try {
        const res = await fetch(`http://localhost:3000/api/getallinforbooks`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        });
        const result = await res.json();

        // Xử lý logic refresh token (cần đảm bảo hàm refreshToken tồn tại)
        if (
          result.message === "Token hết hạn hoặc không hợp lệ" &&
          refreshToken
        ) {
          const refresh = await refreshToken();
          if (refresh === "oke") return await this.loadBooks();
        }

        // Cập nhật books và kết thúc loading
        this.books = result.books || [];
        console.log(this.books);
        this.isLoading = false;
      } catch (error) {
        console.error("Lỗi khi tải sách:", error);
        this.isLoading = false;
      }
    },

    async refreshToken() {
      console.log("Đang làm mới token...");
      return "oke";
    },

    async deleteBook(id) {
      if (!confirm("Bạn có chắc muốn xóa sách này?")) return;

      try {
        const token = sessionStorage.getItem("adToken");

        const res = await fetch(
          `http://localhost:3000/api/dashboard/book/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        const result = await res.json();

        alert(result.message);

        if (res.ok) {
          this.loadBooks(); // reload danh sách sách
        }
      } catch (err) {
        console.error("Lỗi xóa sách:", err);
        alert("Xóa thất bại!");
      }
    },
  },

  mounted() {
    this.loadBooks();
  },
};
</script>
