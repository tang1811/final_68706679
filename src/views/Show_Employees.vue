<template>
  <div class="container mt-0">
    <!-- ✅ Loading -->
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary"></div>
      <p class="mt-3">กำลังโหลดสินค้า...</p>
    </div>

    <!-- ✅ Error -->
    <div v-else-if="error" class="alert alert-danger text-center">
      {{ error }}
    </div>

    <!-- ✅ Product Section -->
    <div v-else class="mb-5">
      <h3 class="mb-4 fw-bold text-center">Employee List</h3>

      <div class="row">
        <div
          class="col-md-3 mb-4"
          v-for="employees in Alldata"
          :key="employees.emp_id"
        >
          <div class="card h-100 shadow-sm">
            <!-- ✅ รูปสินค้า -->
            <img
              :src="getImage(employees.image)"
              class="card-img-top"
              style="height: 200px; object-fit: cover"
            />

            <div class="card-footer bg-white border-0 text-center">
              <p class="mb-1">{{ employees.first_name }} {{ employees.last_name }}</p>
              <p class="mb-0 text-primary">Phone: {{ employees.phone }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  name: "DataList",
  setup() {
    const Alldata = ref([]);
    const loading = ref(true);
    const error = ref(null);

    // ฟังก์ชันดึงข้อมูลจาก API
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost/final_68706679/php_api/show_employees.php",
        );
        if (!response.ok) {
          throw new Error("ไม่สามารถดึงข้อมูลได้");
        }
        Alldata.value = await response.json();
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    };

    // ✅ สร้าง URL รูป
    const getImage = (image) => {
      if (!image) {
        return "https://via.placeholder.com/300x200?text=No+Image";
      }
      return `http://localhost/final_68706679/php_api/uploads/${image}`;
    };

    onMounted(() => {
      fetchData();
    });

    return {
      Alldata,
      loading,
      error,
      getImage,
    };
  },
};
</script>
