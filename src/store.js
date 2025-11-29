import { reactive } from "vue";

const state = reactive({
  token: null,
  role: null,
});

export default {
  state,

  setAuth(token, role) {
    state.token = token;
    state.role = role;

    // Tạo key riêng theo từng role
    const tokenKey = `${role}_token`;
    const roleKey = `${role}_role`;

    localStorage.setItem(tokenKey, token);
    localStorage.setItem(roleKey, role);
  },

  loadAuth(role) {
    // Tự load đúng token theo role
    const tokenKey = `${role}_token`;
    const roleKey = `${role}_role`;

    state.token = localStorage.getItem(tokenKey);
    state.role = localStorage.getItem(roleKey);
  },

  logout(role) {
    const tokenKey = `${role}_token`;
    const roleKey = `${role}_role`;

    localStorage.removeItem(tokenKey);
    localStorage.removeItem(roleKey);

    state.token = null;
    state.role = null;
  },
};
