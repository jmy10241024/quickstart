const defaultLoading = {
  visible: false,
};

export const contentLoading = {
  default: defaultLoading,
  persist: false,
  actions: {
    SET_CONTENT_LOADING: {
      reducer: 'MERGE',
    },
  },
};
