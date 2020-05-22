export const loading = {
  default: { visible: false, percentage: '' },
  persist: false,
  actions: {
    SET_LOADING: {
      reducer: 'MERGE',
    },
    SET_LOADING_PERCENTAGE: {
      reducer: (state, { payload }) => ({
        ...state,
        visible: true,
        percentage: payload,
      }),
    },
  },
};
