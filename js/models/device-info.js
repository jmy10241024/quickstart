import DeviceInfo from 'react-native-device-info';

export const deviceInfo = {
  default: {
    uniqueId: DeviceInfo.getUniqueId(),
    isFirstOpen: true,
  },
  persist: true,
  actions: {
    SET_FIRST_OPEN_STATE: {
      reducer: (state, { payload }) => ({
        ...state,
        isFirstOpen: payload,
      }),
    },
  },
};
