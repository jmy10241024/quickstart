import { Platform, DeviceEventEmitter, Alert } from 'react-native';
import Sound from 'react-native-sound';
import Promise from 'bluebird';
import { AudioRecorder, AudioUtils } from 'react-native-audio';
import { store, dispatch } from '~/modules/redux-app-config';
import EventTracking from '~/modules/services/event-tracking';

class SoundManager {
  // 是否具有录音权限
  hasPermission = false;

  // 定义阅读播放速度
  speed = 1;

  // 定义默认播放速度(回放、练习等音频速度)
  defaultSpeed = 1;

  // 定义录音存储文件路径
  AACPATH = `${AudioUtils.DocumentDirectoryPath}/recording.aac`;

  // 当前界面的音频存储路径
  currentAacPath = '';

  isRecording = false;

  async init() {
    const isAuthorised = await AudioRecorder.requestAuthorization();
    this.hasPermission = isAuthorised;
    if (!isAuthorised) {
      return false;
    }
    if (!store.getState().permissionsInfo.recordAduio) {
      EventTracking.track('t0101', 'r0132');
      EventTracking.track('t0105', 'r0132');
      dispatch('SET_PERMISSIONS_INFO', { recordAduio: true });
    }
    AudioRecorder.onFinished = data => {
      if (Platform.OS === 'ios') {
        this.finishRecording(data.status === 'OK', data.audioFileURL, data.audioFileSize);
      }
    };
    return true;
  }

  /**
   * 播放音频
   * @param {string} uri 音频资源路径
   * @param {string} status 触发状态 PLAY: 播放 | REPLAY: 重播
   */
  play(uri, status, playStart, playEnd, isDefault = true) {
    const callback = (error, sound) => {
      if (error) {
        return;
      }
      playStart && playStart(status);
      sound.play(this.playFinished.bind(this, sound, playEnd));
      if (status === 'PLAY') {
        DeviceEventEmitter.emit('playSound', {
          status: 'play',
          end: parseInt(sound.getDuration() * 100),
        });
        this.startSoundPressInterval();
      }
      sound.setSpeed(isDefault ? this.defaultSpeed : this.speed);
    };
    Promise.delay(300).then(() => {
      this.sound && this.sound.release();
      this.sound = new Sound(uri, null, error => callback(error, this.sound));
    });
  }

  startSoundPressInterval() {
    this.clearSoundInterval();
    if (!this.sound) {
      return;
    }
    this.soundInterval = setInterval(() => {
      this.sound.getCurrentTime(seconds => {
        DeviceEventEmitter.emit('playSound', {
          status: 'playing',
          time: Math.ceil(seconds * 100) + 10,
        });
      });
    }, 100);
  }

  playFinished(sound, playEnd) {
    sound.release();
    this.clearSoundInterval();
    playEnd && playEnd();
    Promise.delay(500).then(() => {
      DeviceEventEmitter.emit('playSound', {
        status: 'end',
        time: 0,
      });
    });
  }

  async startRecording() {
    if (!this.hasPermission) {
      Alert.alert("Can't record, no permission granted!");
      return false;
    }
    try {
      if (this.isRecording) {
        await this.stopRecording();
      }
      this.prepareRecordingPath(this.AACPATH);
      DeviceEventEmitter.emit('playSound', {
        status: 'recording',
      });

      AudioRecorder.startRecording();
      this.isRecording = true;
      return true;
    } catch (error) {
      Alert.alert("Can't record, no permission granted!");
      return false;
    }
  }

  async stopRecording() {
    try {
      const filePath = await AudioRecorder.stopRecording();
      if (Platform.OS === 'android') {
        this.finishRecording(true, filePath);
      }
      this.isRecording = false;
      return true;
    } catch (error) {
      return true;
    }
  }

  // 录音结束
  finishRecording(didSucceed, filePath, fileSize) {
    // if (!this._isMounted) return;
    this.currentAacPath = filePath;
  }

  prepareRecordingPath(audioPath) {
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: 'High',
      AudioEncoding: 'aac',
      AudioEncodingBitRate: 32000,
    });
  }

  clearSoundInterval() {
    this.soundInterval && clearInterval(this.soundInterval);
  }

  setCurrentAacPath(path) {
    this.currentAacPath = path;
  }

  getSpeed() {
    return this.speed;
  }

  setSpeed(speed) {
    this.speed = speed;
    this.sound && this.sound.setSpeed(speed);
  }

  release() {
    this.sound && this.sound.release();
    this.isRecording = false;
  }
}

export default new SoundManager();
