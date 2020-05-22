const defaultBanner = {
  banners: [],
};

export const banner = {
  default: defaultBanner,
  persist: true,
  actions: {
    STORE_BANNER: {
      reducer: 'SET',
    },
  },
};
