<template>
  <div>
    <h2>Kết nối API Node.js</h2>
    <p>{{ message }}</p>
    <button @click="getData">Gọi API GET</button>
    <button @click="sendData">Gửi API POST</button>
    <button @click="count">{{Count}}</button>
    <div>From parent: {{ msg }}</div>
  </div>
</template>

<script>
// import 
import axios from "axios";
//default
export default {
  props: { // props (from parents)
  msg: String
  },
  data() {   // from child
    return {
      message: "",
      Count: 0
    };
  },
  methods: {
    async getData() {
      const res = await axios.get("http://localhost:3000/api/get-all-sach");
      this.message = res.data.data;
    },
    async sendData() {
      const res = await axios.get("http://localhost:3000/api/get-all-staff");
      this.message = res.data;
      console.log(res.data);
    },
    count() {
      this.Count++;
    }
  },
};
</script>