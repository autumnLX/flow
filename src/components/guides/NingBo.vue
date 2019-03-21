/**
 * Phase  7: 确认检测完成
 * Phase  8: 音量太小
 * Phase  9：加载试卷
 * Phase 10：欢迎页面
 * Phase 11: 录完音以后的播放音频
 */
<template lang="pug">
  div(class='container')
    //- 主引导流程
    div(class='flow' v-if='phase < 9 || phase === 11')
      p(class='text1') 请按照图示佩戴耳机
      img(src='./assets/Beijing/pic_headset.png')
      p(class='text1') 录音、放音测试
      p(class='text2') 朗读任意一段试音内容，并在界面右下角调节录（放）音音量。
      div(class='content')
        div
          p(class='text3') 生活就像海洋，只有意志坚强的人，才能到达彼岸。
          p(class='text3') This is an apple, I like apples. Apples are good for our health.
        div
          i(class='play-btn' :class='{disabled: phase === 1 || phase === 5, playing: phase === 3 || phase === 11}' @click='handlePlay')
      div(class='btns')
        button(class='btn' :class='{disabled: phase === 1 || phase === 3}' @click='handleRecord' v-if='phase < 5') 开始录音
        button(class='btn' v-if='phase >= 5' :class='{disabled: phase ===  5 || phase ===  11}' @click='handleClear($event)') 清晰
        button(class='btn' v-if='phase >= 5' :class='{disabled: phase ===  5 || phase ===  11}' @click='handleUnclear($event)') 不清晰
        button(class='btn' v-if='phase >= 5' :class='{disabled: phase ===  5 || phase ===  11}' @click='handleReplay($event)') 录音回放
    //- 加载试卷
    div(v-if='phase === 9')
      p(class='text4') {{loaded ? '下载试卷成功，考试准备就绪' : '正在下载试卷...'}}
      i(class='loading' :class='{loaded: loaded}')
      p(class='text5') 不要再乱动耳机、键盘、鼠标等设备，请安静等待考试！
    //- 开始考试
    div(class='welcome' v-if='phase === 10') 同学们，欢迎参加宁波高级中等学校招生考试英语听说考试。试题共包含六部分，下面请看第一部分。
    //- popup
    div(class='popup' v-if='phase === 7 || phase === 8')
      div(v-if='phase === 8')
        div(class='body')
          p 请根据界面提示内容重新朗读试音，若该问题一直存在，请联系监考老师。
        div(class='footer')
          button(@click='handleRetry') 确定
      div(v-if='phase === 7')
        div(class='body')
          p 请确定您的录音、放音音量大小是否调整至合适位置？
          p 点击【确定】完成试音，等待考试正式开始
          p 点击【取消】可返回重新试音
        div(class='footer')
          button(@click='handleDownload') 确定
          button(class='secondary' @click='handleCancel') 取消
</template>

<script>
export default {
  name: 'GuideOfBeijing',
  props: ['player', 'recorder', 'loaded', 'onSetKeyValue', 'onLoad', 'onStart'],
  data() {
    return {
      phase: 1,
      voiceInterval: -1
    }
  },
  methods: {
    finishPlay() {
      clearInterval(this.voiceInterval)
      this.onSetKeyValue('tip', '')
      this.onSetKeyValue('voice', 0)
      this.onSetKeyValue('highlightPlay', false)
    },
    handlePlay() {
      const phase = this.phase

      if (phase === 2 || phase === 6) {
        if (phase === 2) {
          this.phase = 3
        } else {
          this.phase = 11
        }

        this.player.load({
          url: '/web/static/examination/BJ_GUIDE_SAMPLE.mp3',
          success: () => {
            this.player.play({
              onStart: () => {
                this.onSetKeyValue('highlightPlay', true)
                this.onSetKeyValue('tip', '听指令')
                this.voiceInterval = setInterval(() => {
                  this.onSetKeyValue('voice', 40 + Math.random() * 30)
                }, 50)
              },
              onStop: () => {
                this.finishPlay()
                this.phase = 2
              }
            })
          }
        })
      } else if (phase === 3 || phase === 11) {
        this.player.stop({
          onStop: () => {
            this.finishPlay()

            if (phase === 3) {
              this.phase = 2
            } else {
              this.phase = 6
            }
          }
        })
      }
    },
    handleRecord() {
      if (this.phase === 2) {
        let vlInterval
        // let vlMax = 0

        this.onSetKeyValue('showAdjust', false)
        this.phase = 1

        this.player.load({
          url: '/web/static/examination/BJ_THHD_start.mp3',
          success: () => {
            this.onSetKeyValue('tip', '听指令')
            this.player.play({
              // onStart: () => {
              //   this.onSetKeyValue('highlightPlay', true)
              //   this.voiceInterval = setInterval(() => {
              //     this.onSetKeyValue('voice', 40 + Math.random() * 30)
              //   }, 50)
              // },
              onStop: () => {
                const duration = 10 * 1000
                this.finishPlay()
                console.info('开始录音')
                this.recorder.record({
                  duration: duration,
                  serverParams: {
                    coreType: 'en.sent.child',
                    userId: 'temp001',
                    rank: 100,
                    refText: 'This is an apple, I like apple. Apples are good for our health.'
                  },
                  onRecordIdGenerated: (code, message) => {
                    this.lastRecordId = message.recordId;
                  },
                  onStart: () => {
                    this.onSetKeyValue('tip', '录音中')
                    this.onSetKeyValue('highlightRec', true)
                    this.onSetKeyValue('recording', true)
                    this.onSetKeyValue('progressDuration', duration)
                    setTimeout(() => {
                      this.onSetKeyValue('progressWidth', 456)
                    }, 10)

                    // vlInterval = setInterval(() => {
                    //   let vl = this.recorder.getMicActivityLevel()

                    //   if (vl > vlMax) {
                    //     vlMax = vl
                    //   }
                    // }, 100)
                  },
                  onStop: () => {
                    clearInterval(vlInterval)

                    this.onSetKeyValue('highlightRec', false)
                    this.onSetKeyValue('recording', false)
                    this.onSetKeyValue('progressWidth', 0)

                    // if (vlMax > 10) {
                    this.recorder.getScores({
                      recordId: this.lastRecordId,
                      success: (data) => {
                        try {
                          console.log('replay start')
                          this.onSetKeyValue('tip', '听语音')
                          this.phase = 5
                          this.recorder.startReplay({
                            recordId: 'recorder',
                            // onStart: () => {
                            // },
                            onStop: () => {
                              console.log('replay stop')
                              this.onSetKeyValue('tip', '')
                              this.onSetKeyValue('showAdjust', true)
                              this.phase = 6
                            }
                          })
                        } catch (e) {
                          console.info(e)
                          this.onSetKeyValue('tip', '')
                          this.onSetKeyValue('showAdjust', true)
                          this.phase = 6
                        }
                      }
                    })
                    // } else {
                    //   this.onSetKeyValue('tip', '')
                    //   this.phase = 8
                    // }
                  }
                })
              }
            })
          }
        })
      }
    },
    handleReplay() {
      if (event.target.classList.contains('disabled')) {
        return
      }

      this.phase = 5
      this.recorder.startReplay({
        onStart: () => {
          this.onSetKeyValue('tip', '听语音')
          this.onSetKeyValue('showAdjust', false)
        },
        onStop: () => {
          this.onSetKeyValue('tip', '')
          this.onSetKeyValue('showAdjust', true)
          this.phase = 6
        }
      })
    },
    handleClear(event) {
      if (event.target.classList.contains('disabled')) {
        return
      }

      // if (this.recorder.getRecorderStatus() === 'recorder.replaying') {
      //   this.recorder.stopReplay({
      //     onStop: () => {
      //       this.phase = 7
      //     }
      //   })
      // } else {
      //   this.phase = 7
      // }

      this.phase = 7
      this.onSetKeyValue('tip', '')
    },
    handleUnclear() {
      if (event.target.classList.contains('disabled')) {
        return
      }

      // if (this.recorder.getRecorderStatus() === 'recorder.replaying') {
      //   this.recorder.stopReplay({
      //     onStop: () => {
      //       this.phase = 2
      //     }
      //   })
      // } else {
      //   this.phase = 2
      // }

      this.phase = 2
      this.onSetKeyValue('tip', '')
    },
    handleCancel() {
      this.phase = 6
    },
    handleRetry() {
      this.phase = 2
    },
    handleDownload() {
      this.onSetKeyValue('showAdjust', false)
      this.phase = 9
      this.onLoad()
    }
  },
  watch: {
    loaded: function (newVal, oldVal) {
      if (newVal && !oldVal) {
        this.loaded = true

        setTimeout(() => {
          this.phase = 10
          this.onSetKeyValue('tip', '请等待')
          this.onSetKeyValue('showRec', true)
          this.onSetKeyValue('showPlay', true)
          this.onSetKeyValue('showVoice', true)
          this.onSetKeyValue('highlightPlay', true)
          this.finishPlay()
          this.onStart()
        }, 1000)
      }
    }
  },
  mounted() {
    this.onSetKeyValue('tip', '请等待')
    this.onSetKeyValue('countdown', '5')

    let cd = 4

    const countdownInterval = setInterval(() => {
      this.onSetKeyValue('countdown', cd)
      cd -= 1
      if (cd === -1) {
        clearInterval(countdownInterval)
        this.onSetKeyValue('countdown', '')
        this.onSetKeyValue('tip', '听语音')

        this.player.load({
          url: '/web/static/examination/BJ_GUIDE_PDEJ.mp3',
          success: () => {
            this.player.play({
              onStart: () => {
                this.onSetKeyValue('highlightPlay', true)
                this.voiceInterval = setInterval(() => {
                  this.onSetKeyValue('voice', 40 + Math.random() * 30)
                }, 50)
              },
              onStop: () => {
                this.finishPlay()
                this.onSetKeyValue('showRec', false)
                this.onSetKeyValue('showPlay', false)
                this.onSetKeyValue('showVoice', false)
                this.onSetKeyValue('showAdjust', true)
                this.phase = 2
              }
            })
          }
        })
        // this.phase = 2
      }
    }, 1000)
  }
}
</script>

<style lang="less" scoped>
@image-base-url: "./assets/Beijing";

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;

  img {
    display: block;
    margin: 8px auto 30px;
  }

  p {
    margin: 0;
  }

  .text1 {
    color: #fd9e2d;
    font-size: 18px;
    font-weight: bold;
    line-height: 26px;
    text-align: center;
  }

  .text2 {
    padding-left: 20px;
    color: #999;
    line-height: 40px;
  }

  .text3 {
    color: #21bd73;
    font-size: 18px;
    line-height: 60px;

    &:first-child {
      border-bottom: 1px dashed #ccc;
    }
  }

  .text4 {
    color: #21bd73;
    font-size: 18px;
    font-weight: bold;
    line-height: 36px;
    text-align: center;
  }

  .text5 {
    width: 614px;
    margin: 0 auto;
    border-radius: 10px;
    color: #999;
    font-size: 16px;
    text-align: center;
    line-height: 60px;
    background-color: #f3f4f6;
  }

  .welcome {
    width: 614px;
    height: 340px;
    padding: 30px;
    border-radius: 10px;
    color: #21bd73;
    font-size: 18px;
    font-weight: bold;
    line-height: 36px;
    background-color: #f3f4f6;
  }

  .content {
    display: flex;
    padding-left: 20px;
    border-radius: 10px;
    background-color: #f3f4f6;

    .play-btn {
      display: block;
      width: 50px;
      height: 50px;
      margin-left: 10px;
      margin-top: 35px;
      background-image: url("@{image-base-url}/pic_do_y.png");
      cursor: pointer;

      &.playing {
        background-image: url("@{image-base-url}/pic_doing.png");
      }

      &.disabled {
        background-image: url("@{image-base-url}/pic_do_n.png");
        cursor: not-allowed;
      }
    }
  }

  .btns {
    display: flex;
    margin-top: 20px;
    justify-content: center;
  }

  .btn {
    width: 150px;
    height: 50px;
    padding: 0;
    margin: 0 10px;
    border: 0;
    border-radius: 5px;
    color: #fff;
    font-size: 18px;
    line-height: 50px;
    background-color: #fd9e2d;

    &.disabled {
      background-color: #ededed;
      cursor: not-allowed;
    }
  }

  .loading {
    display: block;
    width: 60px;
    height: 60px;
    margin: 50px auto;
    background-image: url("@{image-base-url}/pic_download.gif");

    &.loaded {
      background-image: url("@{image-base-url}/pic_finish.png");
    }
  }

  .popup {
    position: fixed;
    top: 61px;
    left: 0;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.3);

    & > div {
      display: flex;
      flex-direction: column;
      width: 400px;
      border-radius: 6px;
      background-color: #fff;
      overflow: hidden;
      transform: translateY(-91px);

      button {
        width: 120px;
        margin: 0 25px;
        border: 1px solid #3ebd7d;
        border-radius: 4px;
        color: #fff;
        font-size: 16px;
        line-height: 35px;
        background-color: #3ebd7d;
        cursor: pointer;

        &.secondary {
          border: 1px solid #ccc;
          color: #666;
          background-color: #fff;
        }
      }

      .body {
        padding: 40px 40px 0;

        p {
          color: #666;
          font-size: 16px;
          line-height: 24px;
        }
      }

      .footer {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 97px;
      }
    }
  }
}
</style>
