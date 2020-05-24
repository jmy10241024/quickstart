import Sound from 'react-native-sound';

class AudioManager {
  /**
   * 播放高分音频
   */
  scoreHigh() {
    this.play('score_high.mp3');
  }

  /**
   * 播放低分音频
   */
  scoreLow() {
    this.play('score_low.mp3');
  }

  /**
   * 乱读音频
   */
  misread() {
    this.play('misread.mp3');
  }

  /**
   * 点击音频
   */
  click() {
    this.play('click.mp3');
  }

  /**
   * 不能点击音频
   */
  canNotClick() {
    this.play('cannot_click.mp3');
  }

  /**
   * 翻页音效
   */
  flipPage() {
    this.play('flip_page.mp3');
  }

  /**
   * 翻书音效
   */
  flipBook() {
    this.play('flip_book.mp3');
  }

  /**
   * 习题答对
   */
  quizRight() {
    this.play('quiz_right.mp3');
  }

  /**
   * 习题答错
   */
  quizWrong() {
    this.play('quiz_wrong.mp3');
  }

  play(audio) {
    if (!audio) {
      return;
    }
    const callback = (error, sound) => {
      if (error) {
        return;
      }
      sound.play(() => {
        sound.release();
      });
    };
    const sound = new Sound(audio, Sound.MAIN_BUNDLE, error => callback(error, sound));
  }
}

export default new AudioManager();
