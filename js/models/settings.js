export const settings = {
  default: {
    eyesProtect: false, // 蓝光弱化(护眼模式)
    restRemind: false, // 休息提醒
    remindTime: 15, // 提醒时间 分钟
    sound: true, // 音效
  },
  persist: true,
  actions: {
    UPDATE_EYES_PROTECT: {
      reducer: (state, { payload }) => ({
        ...state,
        eyesProtect: payload,
      }),
    },
    UPDATE_REST_REMIND: {
      reducer: (state, { payload }) => ({
        ...state,
        ...payload,
      }),
    },
    UPDATE_SOUND_STATUS: {
      reducer: (state, { payload }) => ({
        ...state,
        sound: payload,
      }),
    },
  },
};
