import Config from 'react-native-config';

class Global {
  API_URL = Config.API_URL;
  ENV = Config.ENV;

  getApiUrl() {
    return this.API_URL;
  }

  getEnv() {
    return this.ENV;
  }

  setApiUrl(url) {
    this.API_URL = url;
  }

  setEnv(env) {
    this.ENV = env;
  }
}

export default new Global();
