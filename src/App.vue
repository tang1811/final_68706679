<template>
  <div>
    <!-- menu
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/Contact">Contact</router-link>
    </nav>
    -->

    <nav class="navbar navbar-expand-lg" data-bs-theme="light">
  <div class="container">

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active text-success" href="/employees">Employees</a>
        </li>
        <li class="nav-item pt-2">
          |
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/show_employees">Show Employees</a>
        </li>
      </ul>
    </div>
  </div>
</nav>

    <router-view />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #251c9e;
}
</style>

<script>
export default {
  data() {
    return {
      // ✅ ตัวแปรเก็บสถานะ Login
      isLoggedIn: false,

      // ✅ ตัวแปรเก็บชื่อผู้ใช้
      userName: "",
    };
  },

  // ✅ ทำงานทันทีเมื่อโหลด Component
  mounted() {
    this.checkLogin();
  },

  methods: {
    // ✅ ตรวจสอบสถานะ Login จาก localStorage
    checkLogin() {
      // ถ้ามี adminLogin → ถือว่า Login แล้ว
      this.isLoggedIn = !!localStorage.getItem("adminLogin");

      if (this.isLoggedIn) {
        // ดึงข้อมูล user
        const user = JSON.parse(localStorage.getItem("user"));

        // แสดงชื่อ ถ้าไม่มีใช้ "Admin"
        this.userName = user?.name || "Admin";
      }
    },

    // ✅ Logout
    logout() {
      // ลบข้อมูล Login
      localStorage.removeItem("adminLogin");
      localStorage.removeItem("user");

      // รีเซ็ตค่า
      this.isLoggedIn = false;
      this.userName = "";

      // ไปหน้า Login
      this.$router.push("/login");
    },
  },

  // ✅ ถ้าเปลี่ยนหน้า → เช็ค Login ใหม่
  watch: {
    $route() {
      this.checkLogin();
    },
  },
};
</script>
