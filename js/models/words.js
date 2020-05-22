import _ from 'lodash';

// 生词本
export const words = {
  default: {
    words: {
      ebbinghaus_hosts: {},
      word_list: [],
    },
    alreadyReadList: [],
  },
  persist: true,
  actions: {
    UPDATE_NEW_WORDS: {
      reducer: (state, { payload }) => ({
        ...state,
        words: payload,
      }),
    },
    ADD_WORDS_TO_LOCAL: {
      reducer: (state, { payload }) => {
        const list = state.alreadyReadList;
        const word = _.find(list, ({ id }) => id === payload.id);
        if (word) {
          return state;
        }
        list.unshift(payload);
        return {
          ...state,
          alreadyReadList: list,
        };
      },
    },
  },
};
