<template>
  <div class="modal" v-if="show">
    <div class="modal-box">
      <h3>{{ editItem ? "Chỉnh sửa độc giả" : "Thêm độc giả mới" }}</h3>

      <!-- THÔNG BÁO CHUNG -->
      <p v-if="formMessage" :class="['form-message', formMessageType]">
        {{ formMessage }}
      </p>

      <!-- GRID FORM -->
      <div class="form-grid">
        <!-- Mã độc giả -->
        <div class="field">
          <input
            v-model="form.MADOCGIA"
            placeholder="Mã độc giả (VD: DG001)"
            :disabled="editItem"
            :class="{ 'error-input': errors.MADOCGIA }"
          />
          <span class="error-text" v-if="errors.MADOCGIA">
            {{ errors.MADOCGIA }}
          </span>
        </div>

        <!-- Mật khẩu -->
        <div class="field" v-if="!editItem">
          <input
            type="password"
            v-model="form.Password"
            placeholder="Mật khẩu"
            :class="{ 'error-input': errors.Password }"
          />
          <span class="error-text" v-if="errors.Password">
            {{ errors.Password }}
          </span>
        </div>

        <!-- Họ lót -->
        <div class="field">
          <input
            v-model="form.HOLOT"
            placeholder="Họ lót"
            :class="{ 'error-input': errors.HOLOT }"
          />
          <span class="error-text" v-if="errors.HOLOT">{{ errors.HOLOT }}</span>
        </div>

        <!-- Tên -->
        <div class="field">
          <input
            v-model="form.TEN"
            placeholder="Tên"
            :class="{ 'error-input': errors.TEN }"
          />
          <span class="error-text" v-if="errors.TEN">{{ errors.TEN }}</span>
        </div>

        <!-- Giới tính -->
        <div class="field">
          <select v-model="form.PHAI">
            <option value="">-- Giới tính --</option>
            <option>Nam</option>
            <option>Nữ</option>
            <option>Khác</option>
          </select>
        </div>

        <!-- Số điện thoại -->
        <div class="field">
          <input v-model="form.DIENTHOAI" placeholder="Số điện thoại" />
        </div>
      </div>

      <!-- Địa chỉ (full width) -->
      <div class="field full">
        <input v-model="form.DIACHI" placeholder="Địa chỉ" />
      </div>

      <!-- Ngày sinh (full width) -->
      <div class="field full">
        <input type="date" v-model="form.NGAYSINH" />
      </div>

      <!-- BUTTONS -->
      <div class="modal-actions">
        <button class="save-btn" @click="saveData">Lưu</button>
        <button class="cancel-btn" @click="$emit('close')">Hủy</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: { show: Boolean, editItem: Object },

  data() {
    return {
      form: {
        MADOCGIA: "",
        Password: "",
        HOLOT: "",
        TEN: "",
        NGAYSINH: "",
        PHAI: "",
        DIENTHOAI: "",
        DIACHI: "",
      },

      errors: {},
      formMessage: "",
      formMessageType: "",
    };
  },

  watch: {
    editItem: {
      immediate: true,
      handler(val) {
        if (val) {
          this.form = {
            MADOCGIA: val.MADOCGIA,
            Password: "",
            HOLOT: val.HOLOT,
            TEN: val.TEN,
            NGAYSINH: val.NGAYSINH ? val.NGAYSINH.substring(0, 10) : "",
            PHAI: val.PHAI,
            DIENTHOAI: val.DIENTHOAI,
            DIACHI: val.DIACHI,
          };
        } else {
          this.form = {
            MADOCGIA: "",
            Password: "",
            HOLOT: "",
            TEN: "",
            NGAYSINH: "",
            PHAI: "",
            DIENTHOAI: "",
            DIACHI: "",
          };
        }

        this.errors = {};
        this.formMessage = "";
      },
    },
  },

  methods: {
    validate() {
      this.errors = {};

      if (!this.form.MADOCGIA.trim())
        this.errors.MADOCGIA = "Không được để trống";
      if (!this.editItem && !this.form.Password.trim())
        this.errors.Password = "Không được để trống";
      if (!this.form.HOLOT.trim()) this.errors.HOLOT = "Không được để trống";
      if (!this.form.TEN.trim()) this.errors.TEN = "Không được để trống";

      return Object.keys(this.errors).length === 0;
    },

    async saveData() {
      if (!this.validate()) {
        this.formMessage = "Vui lòng sửa các lỗi bên dưới!";
        this.formMessageType = "error";
        return;
      }

      const payload = {
        HOLOT: this.form.HOLOT,
        TEN: this.form.TEN,
        NGAYSINH: this.form.NGAYSINH,
        PHAI: this.form.PHAI,
        DIENTHOAI: this.form.DIENTHOAI,
        DIACHI: this.form.DIACHI,
      };

      try {
        if (this.editItem) {
          // PATCH + gửi _id trong body (đúng với backend bạn!)
          await axios.patch("http://localhost:3000/api/edit-docgia", {
            _id: this.editItem._id,
            ...payload,
          });

          this.formMessage = "Cập nhật độc giả thành công!";
          this.formMessageType = "success";
        } else {
          // Thêm mới
          await axios.post("http://localhost:3000/api/add-docgia", {
            ...payload,
            MADOCGIA: this.form.MADOCGIA,
            Password: this.form.Password,
          });

          this.formMessage = "Thêm độc giả thành công!";
          this.formMessageType = "success";
        }

        setTimeout(() => {
          this.$emit("saved");
          this.$emit("close");
        }, 1000);
      } catch (err) {
        this.formMessage =
          err.response?.data?.message || "Lỗi khi lưu dữ liệu!";
        this.formMessageType = "error";
      }
    },
  },
};
</script>

<style scoped>
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-box {
  width: 520px;
  max-height: 85vh;
  overflow-y: auto;
  background: white;
  padding: 25px 30px;
  border-radius: 16px;
}

/* FORM GRID 2 CỘT */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 20px;
}

.full {
  width: 100%;
  margin-top: 12px;
}

h3 {
  margin-bottom: 12px;
  font-size: 22px;
  font-weight: bold;
}

/* THÔNG BÁO */
.form-message {
  padding: 10px;
  border-radius: 8px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 16px;
}

.form-message.error {
  background: #ffe1e1;
  color: #c62828;
  border: 1px solid #ff9f9f;
}

.form-message.success {
  background: #e5ffe8;
  color: #20843b;
  border: 1px solid #7aff9a;
}

/* INPUT + SELECT */
.field input,
.field select {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #dcdcdc;
  background: #f7faff;
  font-size: 15px;
}

.error-input {
  border-color: #ff4d4d !important;
}

.error-text {
  color: #ff3333;
  font-size: 13px;
  margin-top: 3px;
  display: block;
}

/* BUTTONS */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.save-btn {
  background: #4caf50;
  color: white;
  padding: 10px 22px;
  border-radius: 10px;
  border: none;
}

.cancel-btn {
  background: #c5c5c5;
  color: white;
  padding: 10px 22px;
  border-radius: 10px;
  border: none;
}
</style>
