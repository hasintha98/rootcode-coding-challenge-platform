const authStore = "jwt";

export const TokenService = {
  getToken: () => {
    return localStorage.getItem(authStore);
  },
  updateToken: (payload: any) => {
    localStorage.setItem(authStore, payload);
  },
  removeToken: () => {
    localStorage.removeItem(authStore);
  },
};
