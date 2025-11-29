<template>
  <div class="modal" v-if="show">
    <div class="modal-box">
      <h3>{{ isEdit ? "Chỉnh sửa Nhà Xuất Bản" : "Thêm Nhà Xuất Bản" }}</h3>

      <input v-model="form.TenNXB" placeholder="Tên NXB" />
      <input v-model="form.DiaChi" placeholder="Địa chỉ" />

      <div class="modal-actions">
        <button class="save-btn" @click="save">Lưu</button>
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
      form: { TenNXB: "", DiaChi: "", _id: "" },
    };
  },

  watch: {
    formData: {
      handler(newVal) {
        this.form = { ...newVal };
      },
      immediate: true,
    },
  },

  methods: {
    save() {
      this.$emit("save", {
        MANXB: this.form.MANXB,
        TENNXB: this.form.TenNXB,
        DIACHI: this.form.DiaChi,
      });
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

/* MODAL BOX CHUẨN */
.modal-box {
  width: 480px;
  background: #ffffff;
  padding: 32px;
  border-radius: 18px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18);
}

/* TIÊU ĐỀ */
h3 {
  margin-bottom: 22px;
  font-size: 22px;
  font-weight: 700;
  color: #2b2d42;
}

/* INPUT & SELECT – THỐNG NHẤT 100% */
input,
select {
  width: 100%;
  height: 46px; /* CHUẨN HOÁ CHIỀU CAO */
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #d4d7e1;
  margin-bottom: 16px; /* KHOẢNG CÁCH ĐỀU */
  background: #f9fbff; /* NỀN NHẸ ĐỀU 2 FORM */
  font-size: 15px;
  box-sizing: border-box; /* GIÚP CANH THẲNG HÀNG */
  transition: 0.2s;
}

/* CHỐNG INPUT LỆCH KHI FOCUS */
input:focus,
select:focus {
  border-color: #4f7eff;
  box-shadow: 0 0 0 2px rgba(79, 126, 255, 0.2);
  outline: none;
}

.modal-actions {
  margin-top: 10px;
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
}

.cancel-btn {
  background: #9b9b9b;
  color: white;
  padding: 10px 22px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}
</style>
