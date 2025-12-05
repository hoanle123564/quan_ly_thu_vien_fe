<template>
  <div class="modal" v-if="show">
    <div class="modal-box">
      <h3>{{ isEdit ? "Chỉnh sửa Nhà Xuất Bản" : "Thêm Nhà Xuất Bản" }}</h3>

      <!-- THÔNG BÁO CHUNG -->
      <p v-if="formMessage" :class="['form-message', formMessageType]">
        {{ formMessage }}
      </p>

      <!-- TÊN NHÀ XUẤT BẢN -->
      <div class="field">
        <input
          v-model="localForm.TENNXB"
          placeholder="Tên nhà xuất bản"
          :class="{ 'error-input': errors.TenNXB }"
        />
        <p v-if="errors.TenNXB" class="error-text">{{ errors.TenNXB }}</p>
      </div>

      <!-- ĐỊA CHỈ -->
      <div class="field">
        <input
          v-model="localForm.DIACHI"
          placeholder="Địa chỉ"
          :class="{ 'error-input': errors.DiaChi }"
        />
        <p v-if="errors.DiaChi" class="error-text">{{ errors.DiaChi }}</p>
      </div>

      <div class="modal-actions">
        <button class="save-btn" @click="submit">Lưu</button>
        <button class="cancel-btn" @click="$emit('close')">Hủy</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: Boolean,
    isEdit: Boolean,
    formData: Object,
  },

  data() {
    return {
      localForm: {
        TENNXB: "",
        DIACHI: "",
      },
      errors: {},
      formMessage: "",
      formMessageType: "",
    };
  },

  watch: {
    formData: {
      immediate: true,
      handler(val) {
        if (val) {
          this.localForm = {
            MANXB: val.MANXB || "",
            TENNXB: val.TenNXB || val.TENNXB || "",
            DIACHI: val.DiaChi || val.DIACHI || "",
          };
        } else {
          this.localForm = {
            TENNXB: "",
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

      if (!this.localForm.TENNXB || !this.localForm.TENNXB.trim()) {
        this.errors.TenNXB = "Tên nhà xuất bản không được để trống";
      }

      if (!this.localForm.DIACHI || !this.localForm.DIACHI.trim()) {
        this.errors.DiaChi = "Địa chỉ không được để trống";
      }

      return Object.keys(this.errors).length === 0;
    },

    submit() {
      if (!this.validate()) {
        this.formMessage = "Vui lòng sửa các lỗi trước khi lưu!";
        this.formMessageType = "error";
        return;
      }

      this.$emit("save", this.localForm);
      this.formMessage = "";
    },
  },
};
</script>

<style scoped>
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(2px);
}

.modal-box {
  width: 480px;
  background: #ffffff;
  padding: 32px;
  border-radius: 18px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18);
}

h3 {
  margin-bottom: 22px;
  font-size: 22px;
  font-weight: 700;
  color: #2b2d42;
}

.field {
  margin-bottom: 16px;
}

input {
  width: 100%;
  height: 46px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #d4d7e1;
  background: #f9fbff;
  font-size: 15px;
  box-sizing: border-box;
  transition: 0.2s;
}

input:focus {
  border-color: #4f7eff;
  box-shadow: 0 0 0 2px rgba(79, 126, 255, 0.2);
  outline: none;
}

.error-input {
  border-color: #ff4d4d !important;
}

.error-text {
  color: #ff3333;
  font-size: 13px;
  margin-top: 4px;
}

.form-message {
  text-align: center;
  padding: 10px;
  border-radius: 8px;
  font-weight: bold;
  margin-bottom: 16px;
}

.form-message.error {
  background: #ffe5e5;
  border: 1px solid #ff9a9a;
  color: #c62828;
}

.modal-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.save-btn {
  background: #4caf50;
  color: white;
  padding: 10px 22px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s;
}

.save-btn:hover {
  background: #45a049;
}

.cancel-btn {
  background: #9b9b9b;
  color: white;
  padding: 10px 22px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: 0.2s;
}

.cancel-btn:hover {
  background: #858585;
}
</style>
