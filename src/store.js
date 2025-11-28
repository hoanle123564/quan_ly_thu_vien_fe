import { reactive } from "vue";

const state = reactive({
  token: null,
  role: null, // 'user' hoặc 'admin'
});

export default {
  state,
  setAuth(token, role) {
    state.token = token;
    state.role = role;
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
  },
  logout() {
    state.token = null;
    state.role = null;
    localStorage.clear();
  },
};
