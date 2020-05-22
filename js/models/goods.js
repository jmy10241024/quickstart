export const goods = {
  default: { member_list: [] },
  persist: true,
  actions: {
    STORE_GOODS_LIST: {
      reducer: (state, { payload }) => ({
        ...state,
        member_list: payload.member_list,
      }),
    },
  },
};
