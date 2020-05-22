import _ from 'lodash';

export const lesson = {
  default: {
    grade: 0,
    shelf: {
      book_hosts: {},
      book_list: [],
    },
  },
  persist: true,
  actions: {
    UPDATE_LOCAL_GRADE: {
      reducer: (state, { payload }) => ({ ...state, grade: payload.grade }),
    },
    UPDATE_LESSON_STATUS: {
      reducer: (state, { payload }) => {
        const { index, read_over } = payload;
        const bookList = state.shelf.book_list;

        if (index >= 0 && bookList.length > 0) {
          bookList[index].read_over = read_over;
          return {
            ...state,
            shelf: {
              ...state.shelf,
              book_list: [...bookList],
            },
          };
        }
        return state;
      },
    },
    UPDATE_LOCAL_SHELF: {
      reducer: (state, { payload }) => {
        return {
          grade: state.grade,
          shelf: _.cloneDeep(payload.result),
        };
      },
    },
  },
};
