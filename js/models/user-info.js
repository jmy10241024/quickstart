const defaultUser = {
  user: '',
};

export const userInfo = {
  default: defaultUser,
  persist: true,
  actions: {
    UPDATE_USER: {
      inputs: ['user'],
      reducer: (state, { payload }) => ({
        ...state,
        ...payload.user,
      }),
    },
    UPDATE_USER_WITHOUT_TOKEN: {
      inputs: ['user'],
      reducer: (state, { payload }) => ({
        ...state,
        user: payload.user,
      }),
    },
    USER_LOGOUT_NOW: {
      reducer: () => defaultUser,
    },
  },
};
