<template>
  <div class="modal" v-if="show">
    <div class="modal-box">
      <h3>Thêm sách mới</h3>

      <!-- THÔNG BÁO CHUNG -->
      <p v-if="formMessage" :class="['form-message', formMessageType]">
        {{ formMessage }}
      </p>

      <!-- INPUT TÊN SÁCH -->
      <div class="field">
        <input
          v-model="form.TENSACH"
          placeholder="Tên sách"
          :class="{ 'error-input': errors.TENSACH }"
        />
        <p v-if="errors.TENSACH" class="error-text">{{ errors.TENSACH }}</p>
      </div>

      <!-- TÁC GIẢ -->
      <div class="field">
        <input
          v-model="form.TACGIA"
          placeholder="Tác giả"
          :class="{ 'error-input': errors.TACGIA }"
        />
        <p v-if="errors.TACGIA" class="error-text">{{ errors.TACGIA }}</p>
      </div>

      <!-- GIÁ, SỐ QUYỂN -->
      <div class="grid">
        <div class="field">
          <input
            v-model.number="form.DONGIA"
            type="number"
            placeholder="Đơn giá (≥ 1000)"
            @input="validate"
            :class="{ 'error-input': errors.DONGIA }"
          />
          <p v-if="errors.DONGIA" class="error-text">{{ errors.DONGIA }}</p>
        </div>

        <div class="field">
          <input
            v-model.number="form.SOQUYEN"
            type="number"
            placeholder="Số quyển (≥ 0)"
            @input="validate"
            :class="{ 'error-input': errors.SOQUYEN }"
          />
          <p v-if="errors.SOQUYEN" class="error-text">{{ errors.SOQUYEN }}</p>
        </div>
      </div>

      <!-- NĂM XB -->
      <div class="field">
        <input
          v-model.number="form.NAMXUATBAN"
          type="number"
          placeholder="Năm xuất bản (≥ 1900)"
          @input="validate"
          :class="{ 'error-input': errors.NAMXUATBAN }"
        />
        <p v-if="errors.NAMXUATBAN" class="error-text">
          {{ errors.NAMXUATBAN }}
        </p>
      </div>

      <!-- NHÀ XUẤT BẢN -->
      <div class="field">
        <select v-model="form.MANXB">
          <option value="">-- Chọn NXB --</option>
          <option v-for="n in nxbList" :key="n.MANXB" :value="n.MANXB">
            {{ n.TENNXB }}
          </option>
        </select>
        <p v-if="errors.MANXB" class="error-text">{{ errors.MANXB }}</p>
      </div>

      <!-- BUTTONS -->
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

      errors: {},
      formMessage: "",
      formMessageType: "",
    };
  },

  async mounted() {
    const res = await axios.get("http://localhost:3000/api/get-all-NXB");
    this.nxbList = res.data.data;
  },

  methods: {
    validate() {
      this.errors = {};

      if (!this.form.TENSACH.trim())
        this.errors.TENSACH = "Không được để trống";
      if (!this.form.TACGIA.trim()) this.errors.TACGIA = "Không được để trống";

      if (!this.form.DONGIA || this.form.DONGIA < 1000)
        this.errors.DONGIA = "Đơn giá phải ≥ 1000";

      if (this.form.SOQUYEN < 0) this.errors.SOQUYEN = "Số quyển không được âm";

      if (!this.form.NAMXUATBAN || this.form.NAMXUATBAN < 1900)
        this.errors.NAMXUATBAN = "Năm xuất bản phải ≥ 1900";

      if (!this.form.MANXB) this.errors.MANXB = "Vui lòng chọn nhà xuất bản";

      return Object.keys(this.errors).length === 0;
    },

    submit() {
      if (!this.validate()) {
        this.formMessage = "Vui lòng sửa các lỗi trước khi lưu!";
        this.formMessageType = "error";
        return;
      }

      this.$emit("submit", {
        ...this.form,
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
}

.modal-box {
  width: 480px;
  background: white;
  padding: 28px;
  border-radius: 14px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

/* Input / Select */
.field input,
.field select {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-bottom: 4px;
  font-size: 15px;
}

/* Error style */
.error-input {
  border: 1px solid #ff4d4d !important;
}

.error-text {
  color: #ff3333;
  font-size: 13px;
  margin-bottom: 10px;
}

/* Message */
.form-message {
  text-align: center;
  padding: 10px;
  border-radius: 8px;
  font-weight: bold;
  margin-bottom: 10px;
}

.form-message.error {
  background: #ffe5e5;
  border: 1px solid #ff9a9a;
  color: #c62828;
}

/* Buttons */
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
  border-radius: 8px;
  border: none;
}

.cancel-btn {
  background: #bbb;
  color: white;
  padding: 10px 22px;
  border-radius: 8px;
  border: none;
}
</style>
