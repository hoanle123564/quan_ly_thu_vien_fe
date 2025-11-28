<template>
  <div class="modal" v-if="show">
    <div class="modal-box">
      <h3>Thêm sách mới</h3>

      <input v-model="form.TENSACH" placeholder="Tên sách" />
      <input v-model="form.TACGIA" placeholder="Tác giả" />

      <input
        type="number"
        v-model="form.DONGIA"
        min="1000"
        placeholder="Đơn giá"
      />
      <input
        type="number"
        v-model="form.SOQUYEN"
        min="0"
        placeholder="Số quyển"
      />
      <input
        type="number"
        v-model="form.NAMXUATBAN"
        min="1900"
        placeholder="Năm xuất bản"
      />

      <select v-model="form.MANXB">
        <option disabled value="">-- Chọn NXB --</option>
        <option v-for="n in nxbList" :key="n.MANXB" :value="n.MANXB">
          {{ n.TENNXB }}
        </option>
      </select>

      <div class="modal-actions">
        <button class="save-btn" @click="submit">Lưu</button>
        <button class="cancel-btn" @click="$emit('close')">Hủy</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: { show: Boolean },

  data() {
    return {
      nxbList: [],
      form: {
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

  methods: {
    validatePrice() {
      if (this.form.DONGIA < 1000) this.form.DONGIA = 1000;
    },

    validateSoQuyen() {
      if (this.form.SOQUYEN < 0) this.form.SOQUYEN = 0;
    },

    validateNamXB() {
      if (this.form.NAMXUATBAN < 0) this.form.NAMXUATBAN = 0;
    },
    submit() {
      this.$emit("submit", {
        TENSACH: this.form.TENSACH,
        TACGIA: this.form.TACGIA,
        DONGIA: Number(this.form.DONGIA),
        SOQUYEN: Number(this.form.SOQUYEN),
        NAMXUATBAN: Number(this.form.NAMXUATBAN),
        MANXB: Number(this.form.MANXB),
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
  backdrop-filter: blur(3px);
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

/* BUTTONS */
.modal-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.save-btn {
  background: linear-gradient(135deg, #4f7eff, #6a8bff);
  color: #fff;
  padding: 10px 22px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s;
}

.save-btn:hover {
  background: linear-gradient(135deg, #3d6cf5, #5f80ff);
  transform: translateY(-2px);
}

.cancel-btn {
  background: #c5c5c5;
  color: white;
  padding: 10px 22px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: 0.2s;
}

.cancel-btn:hover {
  background: #a8a8a8;
}
</style>
