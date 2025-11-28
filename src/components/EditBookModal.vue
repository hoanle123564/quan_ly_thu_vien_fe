<template>
  <div class="modal" v-if="show">
    <div class="modal-box">
      <h3>Chỉnh sửa sách</h3>

      <input v-model="form.TENSACH" placeholder="Tên sách" />
      <input v-model="form.TACGIA" placeholder="Tác giả" />

      <input
        type="number"
        v-model.number="form.DONGIA"
        min="1000"
        placeholder="Đơn giá"
        @input="validatePrice"
      />

      <input
        type="number"
        v-model.number="form.SOQUYEN"
        min="0"
        placeholder="Số quyển"
        @input="validateSoQuyen"
      />

      <input
        type="number"
        v-model.number="form.NAMXUATBAN"
        min="1900"
        placeholder="Năm xuất bản"
        @input="validateNamXB"
      />

      <select v-model="form.MANXB">
        <option disabled value="">-- Chọn NXB --</option>
        <option v-for="n in nxbList" :key="n.MANXB" :value="n.MANXB">
          {{ n.TENNXB }}
        </option>
      </select>

      <div class="modal-actions">
        <button class="save-btn" @click="save">Cập nhật</button>
        <button class="cancel-btn" @click="$emit('close')">Hủy</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    show: Boolean,
    bookData: Object,
  },

  data() {
    return {
      nxbList: [],
      form: {
        MASACH: "",
        TENSACH: "",
        TACGIA: "",
        DONGIA: "",
        SOQUYEN: "",
        NAMXUATBAN: "",
        MANXB: "",
      },
    };
  },

  async mounted() {
    const res = await axios.get("http://localhost:3000/api/get-all-NXB");
    this.nxbList = res.data.data;
  },

  watch: {
    bookData: {
      handler(val) {
        if (val) this.form = { ...val }; // Fill data vào form edit
      },
      immediate: true,
    },
  },

  methods: {
    validatePrice() {
      if (this.form.DONGIA < 1000) this.form.DONGIA = 1000;
    },

    validateSoQuyen() {
      if (this.form.SOQUYEN < 0) this.form.SOQUYEN = 0;
    },

    validateNamXB() {
      if (this.form.NAMXUATBAN < 1900) this.form.NAMXUATBAN = 1900;
    },

    save() {
      this.$emit("update", { ...this.form });
    },
  },
};
</script>

<style scoped>
/* (Dùng y chang style của AddBookModal để đồng bộ) */

.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(3px);
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

input,
select {
  width: 100%;
  height: 46px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #d4d7e1;
  margin-bottom: 16px;
  background: #f9fbff;
  font-size: 15px;
  box-sizing: border-box;
  transition: 0.2s ease;
}

input:focus,
select:focus {
  border-color: #4f7eff;
  box-shadow: 0 0 0 2px rgba(79, 126, 255, 0.2);
  outline: none;
}

.modal-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 14px;
}

.save-btn {
  background: #4caf50;
  color: white;
  padding: 10px 22px;
  border-radius: 10px;
}

.cancel-btn {
  background: #c5c5c5;
  color: white;
  padding: 10px 22px;
  border-radius: 10px;
}
</style>
