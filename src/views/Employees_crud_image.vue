<template>
  <div class="container mt-4">
    <h2 class="mb-3 fw-bold  text-center">Employee List</h2>

    <div class="mb-3">
      <button class="btn btn-primary" @click="openAddModal">
        Add
        <i class="bi bi-plus-circle"></i>
      </button>
    </div>

    <table class="table table-bordered table-striped">
      <thead class="table-primary">
        <tr>
          <th>รูปภาพ</th>
          <th>รหัส</th>
          <th>ชื่อ</th>
          <th>นามสกุล</th>
          <th>ที่อยู่</th>
          <th>เบอร์โทรศัพท์</th>
          <th>แก้ไข/ลบ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="emp in employees" :key="emp.emp_id">
          <td>
            <img
              v-if="emp.image"
              :src="'http://localhost/final_68706679/php_api/uploads/' + emp.image"
              width="50"
              height="50"
              style="object-fit: cover; border-radius: 50%;"
            />
            <span v-else>ไม่มีรูป</span>
          </td>
          <td>{{ emp.emp_id }}</td>
          <td>{{ emp.first_name }}</td>
          <td>{{ emp.last_name }}</td>
          <td>{{ emp.address }}</td>
          <td>{{ emp.phone }}</td>
          <td>
            <button class="btn btn-warning btn-sm" @click="openEditModal(emp)">Edit</button>
            |
            <button
              class="btn btn-danger btn-sm"
              @click="deleteemployees(emp.emp_id)"
            >Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="loading" class="text-center">
      <p>กำลังโหลดข้อมูล...</p>
    </div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div class="modal fade" id="editModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditMode ? "แก้ไขข้อมูลพนักงาน" : "เพิ่มพนักงานใหม่" }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveEmployees">
              <div class="mb-3">
                <input v-model="editEmployees.first_name" type="text" class="form-control" placeholder="First Name" required/>
              </div>
              <div class="mb-3">
                <input v-model="editEmployees.last_name" type="text" class="form-control" placeholder="Last Name" required/>
              </div>
              <div class="mb-3">
                <textarea 
                  v-model="editEmployees.address" 
                  class="form-control" 
                  rows="4" 
                  placeholder="Address"
                  required
                ></textarea>
              </div>
              <div class="mb-3">
                <input v-model="editEmployees.phone" type="text" class="form-control" placeholder="Phone" required/>
              </div>
              <div class="mb-3">
                <input
                  type="file"
                  @change="handleFileUpload"
                  class="form-control"
                  :required="!isEditMode"
                />

                <div v-if="isEditMode && editEmployees.image" class="mt-2">
                  <p class="small text-muted">รูปเดิม:</p>
                  <img
                    :src="'http://localhost/final_68706679/php_api/uploads/' + editEmployees.image"
                    width="80"
                  />
                </div>
              </div>

              <button
                type="submit"
                class="btn btn-primary w-100 mb-2"
              >{{ isEditMode ? "Update" : "Add" }}</button>
              <button type="button" class="btn btn-secondary w-100" data-bs-dismiss="modal">Cancel</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  name: "EmployeeList",
  setup() {
    const employees = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const editEmployees = ref({});
    const isEditMode = ref(false);
    const newImageFile = ref(null); // เก็บไฟล์รูปที่เลือกใหม่
    let editModal = null;

    const fetchemployees = async () => {
      try {
        const response = await fetch(
          "http://localhost/final_68706679/php_api/employees_crud_image.php"
        );
        const result = await response.json();
        employees.value = result.success ? result.data : [];
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchemployees();
      const modalEl = document.getElementById("editModal");
      editModal = new window.bootstrap.Modal(modalEl);
    });

    const handleFileUpload = event => {
      newImageFile.value = event.target.files[0];
    };

    const openAddModal = () => {
      isEditMode.value = false;
      editEmployees.value = {
        emp_id:"",
        first_name: "",
        last_name: "",
        address: "",
        phone: "",
        image: ""
      };
      newImageFile.value = null;

      // รีเซ็ต input file
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";

      editModal.show();
    };

    const openEditModal = emp => {
      isEditMode.value = true;
      editEmployees.value = { ...emp };
      newImageFile.value = null;
      editModal.show();
    };

    const saveEmployees = async () => {
      // ✅ ใช้ FormData เพื่อส่งไฟล์
      const formData = new FormData();
      formData.append("action", isEditMode.value ? "update" : "add");

      if (isEditMode.value) {
        formData.append("emp_id", editEmployees.value.emp_id);
      }

      formData.append("first_name", editEmployees.value.first_name); 
      formData.append("last_name", editEmployees.value.last_name);
      formData.append("address", editEmployees.value.address); 
      formData.append("phone", editEmployees.value.phone);

      if (newImageFile.value) {
        formData.append("image", newImageFile.value);
      }

      try {
        const response = await fetch(
          "http://localhost/final_68706679/php_api/employees_crud_image.php",
          {
            method: "POST", // ใช้ POST เสมอเมื่อส่ง FormData ที่มีไฟล์
            body: formData
          }
        );

        const result = await response.json();

        if (result.success) {
          alert(result.message);
          fetchemployees();
          editModal.hide();
        } else {
          alert(result.message);
        }
      } catch (err) {
        alert("เกิดข้อผิดพลาด: " + err.message);
      }
    };

    const deleteemployees = async id => {
      if (!confirm("คุณต้องการลบข้อมูลนี้ใช่หรือไม่?")) return;

      const formData = new FormData();
      formData.append("action", "delete");
      formData.append("emp_id", id);

      try {
        const response = await fetch(
          "http://localhost/final_68706679/php_api/employees_crud_image.php",
          {
            method: "POST",
            body: formData
          }
        );
        const result = await response.json();
        if (result.success) {
          alert(result.message);
          fetchemployees();
        } else {
          alert(result.message);
        }
      } catch (err) {
        alert("เกิดข้อผิดพลาด: " + err.message);
      }
    };

    return {
      employees,
      loading,
      error,
      editEmployees,
      isEditMode,
      openAddModal,
      openEditModal,
      handleFileUpload,
      saveEmployees,
      deleteemployees
    };
  }
};
</script>