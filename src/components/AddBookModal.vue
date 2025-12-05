<template>
  <div class="modal" v-if="show">
    <div class="modal-box">
      <h3>Thêm sách mới</h3>

      <!-- TÊN + TÁC GIẢ -->
      <div class="grid-2">
        <input v-model="form.TENSACH" placeholder="Tên sách" />
        <input v-model="form.TACGIA" placeholder="Tác giả" />
      </div>

      <!-- ĐƠN GIÁ + SỐ QUYỂN -->
      <div class="grid-2">
        <div>
          <input
            type="number"
            v-model="form.DONGIA"
            placeholder="Đơn giá (≥ 1000)"
            @input="validatePrice"
            :class="{ 'error-input': errors.DONGIA }"
          />
          <p class="error-text" v-if="errors.DONGIA">{{ errors.DONGIA }}</p>
        </div>

        <div>
          <input
            type="number"
            v-model="form.SOQUYEN"
            placeholder="Số quyển (≥ 0)"
            @input="validateSoQuyen"
            :class="{ 'error-input': errors.SOQUYEN }"
          />
          <p class="error-text" v-if="errors.SOQUYEN">{{ errors.SOQUYEN }}</p>
        </div>
      </div>

      <!-- NĂM XUẤT BẢN + NXB -->
      <div class="grid-2">
        <div>
          <input
            type="number"
            v-model="form.NAMXUATBAN"
            placeholder="Năm xuất bản (≥ 1900)"
            @input="validateNamXB"
            :class="{ 'error-input': errors.NAMXUATBAN }"
          />
          <p class="error-text" v-if="errors.NAMXUATBAN">
            {{ errors.NAMXUATBAN }}
          </p>
        </div>

        <div>
          <select v-model="form.MANXB">
            <option disabled value="">-- Chọn NXB --</option>
            <option v-for="n in nxbList" :key="n.MANXB" :value="n.MANXB">
              {{ n.TENNXB }}
            </option>
          </select>
        </div>
      </div>

      <!-- ẢNH BASE64 -->
      <div class="field">
        <label>Ảnh sách:</label>
        <input type="file" accept="image/*" @change="toBase64" />
        <img v-if="form.ANH" :src="form.ANH" class="preview-img" />
      </div>

      <!-- BUTTON -->
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
        ANH: "",
      },

      errors: {},
    };
  },

  async mounted() {
    const res = await axios.get("http://localhost:3000/api/get-all-NXB");
    this.nxbList = res.data.data;
  },

  methods: {
    resetForm() {
      this.form = {
        TENSACH: "",
        TACGIA: "",
        DONGIA: "",
        SOQUYEN: "",
        NAMXUATBAN: "",
        MANXB: "",
        ANH: "",
      };
      this.errors = {};
    },
    toBase64(event) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.form.ANH = reader.result; // base64
      };

      if (file) reader.readAsDataURL(file);
    },

    validatePrice() {
      this.errors.DONGIA = this.form.DONGIA < 1000 ? "Đơn giá phải ≥ 1000" : "";
    },

    validateSoQuyen() {
      this.errors.SOQUYEN =
        this.form.SOQUYEN < 0 ? "Số quyển không được âm" : "";
    },

    validateNamXB() {
      this.errors.NAMXUATBAN =
        this.form.NAMXUATBAN < 1900 ? "Năm xuất bản phải ≥ 1900" : "";
    },

    submit() {
      if (!this.form.TENSACH.trim())
        return alert("Tên sách không được để trống!");
      if (!this.form.TACGIA.trim())
        return alert("Tác giả không được để trống!");
      if (!this.form.MANXB) return alert("Vui lòng chọn NXB!");

      if (this.errors.DONGIA || this.errors.SOQUYEN || this.errors.NAMXUATBAN)
        return alert("Vui lòng sửa lỗi trước khi lưu!");

      this.$emit("submit", {
        TENSACH: this.form.TENSACH,
        TACGIA: this.form.TACGIA,
        DONGIA: Number(this.form.DONGIA),
        SOQUYEN: Number(this.form.SOQUYEN),
        NAMXUATBAN: Number(this.form.NAMXUATBAN),
        MANXB: Number(this.form.MANXB),
        ANH: this.form.ANH || null,
      });

      // Reset form và hiển thị thông báo
      this.resetForm();
      alert("Thêm sách thành công!");
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
}

.modal-box {
  width: 500px;
  background: #fff;
  padding: 28px;
  border-radius: 16px;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 16px;
}

input,
select {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: #f9fbff;
  margin-bottom: 4px;
}

.error-input {
  border: 1px solid #ff4d4d !important;
  background: #ffecec !important;
}

.error-text {
  color: red;
  font-size: 13px;
  margin-bottom: 6px;
}

.preview-img {
  width: 90px;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #ddd;
  margin-top: 10px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.save-btn {
  padding: 10px 20px;
  background: #4caf50;
  color: white;
  border-radius: 8px;
  border: none;
}

.cancel-btn {
  padding: 10px 20px;
  background: #bbb;
  color: white;
  border-radius: 8px;
  border: none;
}
</style>
