const defaultShelf = {
  book_hosts: {},
  book_list: [],
  current_level_count: 0,
};
export const shelf = {
  default: defaultShelf,
  persist: false,
  actions: {
    UPDATE_SHELF: {
      reducer: (state, { payload }) => {
        const { result } = payload;
        return {
          book_hosts: payload.result.book_hosts,
          book_list: [...state.book_list, ...result.book_list],
          current_level_count: result.current_level_count,
        };
      },
    },
    UPDATE_BOOK_STATUS: {
      reducer: (state, { payload }) => {
        const { index, read_over } = payload;
        const bookList = state.book_list;
        if (index >= 0 && bookList.length > 0) {
          bookList[index].read_over = read_over;
          return {
            ...state,
            book_list: [...bookList],
          };
        }
        return state;
      },
    },
    REFRESH_SHELF: {
      reducer: (state, { payload }) => {
        const { result } = payload;
        return {
          book_hosts: payload.result.book_hosts,
          book_list: [...result.book_list],
          current_level_count: result.current_level_count,
        };
      },
    },
  },
};
