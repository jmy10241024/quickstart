export const downloading = {
  default: { visible: false, percentage: '' },
  persist: false,
  actions: {
    SET_DOWNLOADING: {
      reducer: 'MERGE',
    },
    SET_DOWNLOADING_PERCENTAGE: {
      reducer: (state, { payload }) => ({
        ...state,
        visible: true,
        percentage: payload,
      }),
    },
  },
};
