import DeviceInfo from 'react-native-device-info';

export const deviceInfo = {
  default: {
    uniqueId: DeviceInfo.getUniqueId(),
    acceptPrivacy: false,
    wordPreview: false, // 单词预览界面新手教程是否完成, 可用于某个模块是否第一次打开, 以加载新手用户引导页面
  },
  persist: true,
  actions: {
    SET_ACCEPT_PRIVACY_STATUS: {
      reducer: (state, { payload }) => ({
        ...state,
        acceptPrivacy: payload,
      }),
    },
    SET_WORD_PREVIEW: {
      reducer: (state, { payload }) => ({
        ...state,
        wordPreview: payload,
      }),
    },
  },
};
