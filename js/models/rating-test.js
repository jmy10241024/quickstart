const defaultRating = {
  hasTest: false,
  laterUnix: 0,
};

export const ratingTest = {
  default: defaultRating,
  persist: true,
  actions: {
    REMIND_LATER: {
      reducer: (state, { payload }) => ({
        ...state,
        laterUnix: payload.laterUnix,
      }),
    },
    FINISH_RATING_TEST: {
      reducer: state => ({
        ...state,
        laterUnix: 0,
        hasTest: true,
      }),
    },
  },
};
