<template>
  <section>
    <h4>👥 Tài khoản người dùng</h4>
    <table class="table table-hover align-middle mt-3">
      <thead class="table-dark">
        <tr>
          <th>Mã người dùng</th>
          <th>Họ tên</th>
          <th>Email</th>
          <th>Điện thoại</th>
          <th>Trạng thái</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.phone }}</td>
          <td>
            <span
              :class="['badge', user.active ? 'bg-success' : 'bg-secondary']"
            >
              {{ user.active ? "Hoạt động" : "Đã khóa" }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
export default {
  name: "AdminUsers",
  data() {
    return {
      users: [
        {
          id: "U001",
          name: "Nguyễn Văn A",
          email: "a@gmail.com",
          phone: "0901234567",
          active: true,
        },
        {
          id: "U002",
          name: "Trần Thị B",
          email: "b@gmail.com",
          phone: "0902345678",
          active: false,
        },
      ],
    };
  },
};
</script>
