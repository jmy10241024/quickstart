export const settings = {
  default: {
    checkInReminder: false, // 打卡提醒
    checkInTime: {
      // 提醒时间
      hour: 12,
      minute: 0,
    },
  },
  persist: true,
  actions: {
    UPDATE_CHECKIN_REMINDER: {
      reducer: (state, { payload }) => ({
        ...state,
        checkInReminder: payload.reminder,
      }),
    },
    UPDATE_CHECKIN_TIME: {
      reducer: (state, { payload }) => ({
        ...state,
        ...payload,
      }),
    },
  },
};
