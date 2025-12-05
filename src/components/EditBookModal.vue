<template>
  <div class="modal" v-if="show">
    <div class="modal-box">
      <h3>Chỉnh sửa thông tin sách</h3>

      <!-- THÔNG BÁO CHUNG -->
      <p v-if="formMessage" :class="['form-message', formMessageType]">
        {{ formMessage }}
      </p>

      <!-- TÊN + TÁC GIẢ -->
      <div class="grid-2">
        <div class="field">
          <input
            v-model="form.TENSACH"
            placeholder="Tên sách"
            :class="{ 'error-input': errors.TENSACH }"
          />
          <p class="error-text" v-if="errors.TENSACH">{{ errors.TENSACH }}</p>
        </div>

        <div class="field">
          <input
            v-model="form.TACGIA"
            placeholder="Tác giả"
            :class="{ 'error-input': errors.TACGIA }"
          />
          <p class="error-text" v-if="errors.TACGIA">{{ errors.TACGIA }}</p>
        </div>
      </div>

      <!-- ĐƠN GIÁ + SỐ QUYỂN -->
      <div class="grid-2">
        <div class="field">
          <input
            type="number"
            v-model.number="form.DONGIA"
            placeholder="Đơn giá (≥ 1000)"
            @input="validate"
            :class="{ 'error-input': errors.DONGIA }"
          />
          <p class="error-text" v-if="errors.DONGIA">{{ errors.DONGIA }}</p>
        </div>

        <div class="field">
          <input
            type="number"
            v-model.number="form.SOQUYEN"
            placeholder="Số quyển (≥ 0)"
            @input="validate"
            :class="{ 'error-input': errors.SOQUYEN }"
          />
          <p class="error-text" v-if="errors.SOQUYEN">{{ errors.SOQUYEN }}</p>
        </div>
      </div>

      <!-- NĂM XB + NXB -->
      <div class="grid-2">
        <div class="field">
          <input
            type="number"
            v-model.number="form.NAMXUATBAN"
            placeholder="Năm xuất bản (≥ 1900)"
            @input="validate"
            :class="{ 'error-input': errors.NAMXUATBAN }"
          />
          <p class="error-text" v-if="errors.NAMXUATBAN">
            {{ errors.NAMXUATBAN }}
          </p>
        </div>

        <div class="field">
          <select v-model="form.MANXB">
            <option value="">-- Chọn NXB --</option>
            <option v-for="n in nxbList" :key="n.MANXB" :value="n.MANXB">
              {{ n.TENNXB }}
            </option>
          </select>
          <p class="error-text" v-if="errors.MANXB">{{ errors.MANXB }}</p>
        </div>
      </div>

      <div class="image-grid">
        <div class="image-col" style="padding-top: 45px">
          <label class="img-label">Ảnh hiện tại</label>
          <img v-if="form.ANH" :src="form.ANH" class="preview-img" />
        </div>

        <div class="image-col">
          <label class="img-label">Đổi ảnh</label>
          <input
            type="file"
            accept="image/*"
            @change="toBase64"
            class="file-input"
          />
          <img v-if="newImage" :src="newImage" class="preview-img" />
        </div>
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
        ANH: "",
      },

      newImage: "",
      errors: {},
      formMessage: "",
      formMessageType: "",
    };
  },

  watch: {
    bookData: {
      immediate: true,
      handler(val) {
        if (val) {
          this.form = {
            MASACH: val.MASACH,
            TENSACH: val.TENSACH,
            TACGIA: val.TACGIA,
            DONGIA: val.DONGIA,
            SOQUYEN: val.SOQUYEN,
            NAMXUATBAN: val.NAMXUATBAN,
            MANXB: val.MANXB,
            ANH: val.ANH || "",
          };
        }
        this.newImage = "";
        this.errors = {};
      },
    },
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

    toBase64(event) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.newImage = reader.result;
        this.form.ANH = reader.result; // gán base64
      };

      if (file) reader.readAsDataURL(file);
    },

    submit() {
      if (!this.validate()) {
        this.formMessage = "Vui lòng sửa các lỗi trước khi lưu!";
        this.formMessageType = "error";
        return;
      }

      this.$emit("update", {
        ...this.form,
        DONGIA: Number(this.form.DONGIA),
        SOQUYEN: Number(this.form.SOQUYEN),
        NAMXUATBAN: Number(this.form.NAMXUATBAN),
        MANXB: Number(this.form.MANXB),
        ANH: this.form.ANH || null,
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
  width: 500px;
  background: white;
  padding: 28px;
  border-radius: 14px;
}

/* 2 CỘT */
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.field input,
.field select {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-bottom: 4px;
  font-size: 15px;
}

.preview-img {
  width: 100px;
  height: 140px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #ddd;
  margin-top: 10px;
}

.error-input {
  border-color: #ff4d4d !important;
}

.error-text {
  color: red;
  font-size: 13px;
  margin-bottom: 8px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 18px;
}

.save-btn {
  background: #4caf50;
  color: white;
  padding: 10px 22px;
  border-radius: 8px;
}

.cancel-btn {
  background: #bbb;
  color: white;
  padding: 10px 22px;
  border-radius: 8px;
}
.image-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px; /* tạo khoảng cách đều */
  align-items: start; /* ép cả 2 cột thẳng hàng từ trên xuống */
  margin: 20px 0;
}

.image-col {
  display: flex;
  flex-direction: column;
}

.img-label {
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

.file-input {
  margin-bottom: 12px;
  width: 100%;
}

.preview-img {
  width: 130px;
  height: 170px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid #ccc;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}
</style>
