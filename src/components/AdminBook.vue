<template>
  <section>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4>📚 Quản lý sách</h4>
      <button class="btn btn-primary btn-sm" @click="addBook">
        + Thêm sách
      </button>
    </div>
    <table class="table table-striped align-middle">
      <thead class="table-dark">
        <tr>
          <th>Mã sách</th>
          <th>Tên sách</th>
          <th>Tác giả</th>
          <th>Thể loại</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in books" :key="book.id">
          <td>{{ book.id }}</td>
          <td>{{ book.title }}</td>
          <td>{{ book.author }}</td>
          <td>{{ book.genre }}</td>
          <td>
            <button class="btn btn-warning btn-sm me-2">Sửa</button>
            <button class="btn btn-danger btn-sm">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
export default {
  name: "AdminBooks",
  data() {
    return {
      books: [
        {
          id: "B001",
          title: "Vue 3 Cơ Bản",
          author: "Nguyễn Minh",
          genre: "Lập trình",
        },
        {
          id: "B002",
          title: "HTML & CSS",
          author: "Trần Thảo",
          genre: "Thiết kế",
        },
      ],
    };
  },
  methods: {
    addBook() {
      alert("Thêm sách mới");
    },
  },
};
</script>
