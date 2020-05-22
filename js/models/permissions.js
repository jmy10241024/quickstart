export const permissionsInfo = {
  default: {
    readStorage: false,
    readPhoneState: false,
    recordAduio: false,
  },
  persist: true,
  actions: {
    SET_PERMISSIONS_INFO: {
      reducer: 'MERGE',
    },
  },
};
