<template lang="pug">
  div(class='container' ref='container')
    div
      div(class='content')
        //- step 0 浏览器检测
        div(class='step0' v-if='step === 0')
          img(src='../../assets/student/guide/img_detection.png' class='img1')
          p(class='text1') 为保证考试的顺利进行，
          p(class='text2') 请按提示进行必要的检测。
          p(class='text3') 正在进行浏览器检测
            span {{dots}}
        //- step 1 flash勾选
        div(class='step1' :class='{mini: step !== 1}')
          img(src='../../assets/student/guide/ic_word.png' class='img1')
          div(class='text-center')
            img(src='../../assets/student/guide/guideAnime.gif' class='img2')
            #recorder
        //- step 2
        div(class='step2' v-if='step === 2')
          img(src='../../assets/student/guide/ic_word2.png' class='img1')
          img(src='../../assets/student/guide/chrome.png' class='img2')
        //- step 3-4
        div(class='step3' v-if='step === 3')
          img(src='../../assets/student/guide/headphone.gif' class='img1')
          p 下面开始耳机检测，请听一段音频。
        div(class='step4' v-if='step === 4')
          img(src='../../assets/student/guide/headphone.gif' class='img1')
          p 你是否可以听清刚才的音频内容。
        //- step 5-7 麦克风检测
        div(class='step5' v-if='step === 5 || step === 6 || step === 7')
          img(src='../../assets/student/guide/headphone.gif' class='img1' v-if='step === 5')
          div(v-if='step === 6')
            div(class='volumeBarBox')
              div(class='volumeBar' ref='volume')
          img(src='../../assets/student/guide/microphone.png' class='img1' v-if='step === 7')
          p 下面开始麦克风检测
          p 请在“叮”声后大声朗读以下内容
          p(style='color:#21bd73') One Two Three
        //- step 8 检测通过
        div(class='step8' v-if='step === 8')
          img(src='../../assets/student/guide/detection_success.png' class='img1')
          p(class='text1') 通过检测，即将进入测评
          p(class='text2') {{countdown}}秒后自动进入测评
        //- step 9 浏览器不支持
        div(class='step9' v-if='step === 9')
          img(src='../../assets/student/guide/ic_failed.png' class='img1')
          p(class='text1') 不支持当前浏览器环境
          p(class='text2') 若当前使用的是QQ或360浏览器，请切换到极速模式
          p(class='text2') 若非以上浏览器，请下载以下推荐浏览器
          div(class='text-center')
            a(href='http://17ks.chivoxapp.com/guide/QQBrowser_Setup_SEM1.exe' target='_blank') 下载QQ浏览器
            a(href='http://17ks.chivoxapp.com/guide/360cse_8.7.0.306.exe' target='_blank') 下载360极速浏览器
        //- step 10 没插麦克风
        div(class='step10' v-if='step === 10')
          img(src='../../assets/student/guide/ic_earphonefailed.png' class='img1')
          p 没有检测到耳机和麦克风
          p 请重新拔插耳机后<span>重启浏览器!</span>
        //- step 11 检测失败
        div(class='step11' v-if='step === 11')
          img(src='../../assets/student/guide/ic_failed.png' class='img1')
          p(class='text1') 检测失败
          p(class='text2') 如拔插耳机请重启浏览器
          p 考场考生请举手示意老师
          p 非考场考生请检查麦克风
        //- step 12 评分超时
        div(class='step12' v-if='step === 12')
          img(src='../../assets/student/guide/ic_failed.png' class='img1')
          p(class='text1') 网络异常，请重试
          p(class='text2') 请确认网络连接正常，能正常访问网络
          p 考场考生请举手示意老师
          p 非考场考生请检查网络
        //- step 13 音量太小
        div(class='step13' v-if='step === 13')
          img(src='../../assets/student/guide/ic_failed.png' class='img1')
          p(class='text1') 录音音量太小
          p(class='text2') 为保证评分效果，请调节录音音量，并大声、准确地朗读
          p 考场考生请举手示意老师
          p 非考场考生请检查麦克风
      div(class='footer' style='text-align:center;')
        button(:class='{disabled: !allowNext, hidden: !showNext}' @click='handleNext($event)' ref='nextBtn') 下一步
        button(class='no' v-if='step === 4') 否
        button(class='yes' v-if='step === 4' @click='handleNext($event)') 是
        button(class='red' v-if='step === 11 || step === 12 || step === 13' @click='handleRetry') 重试
      #player
</template>

<script>
import Config from '@/config/config.js'

export default {
  name: 'Guide',
  props: ['onPassed', 'changeInitStatus', 'max'],
  data() {
    return {
      player: null,
      recorder: null,
      step: 0,
      allowNext: false,
      showNext: false,
      countdown: 3,
      dots: '',
      prevMicStatusCode: '',
      sdkInitStatus: 'idle', // sdk初始化状态 error - sdk回调onError  success - sdk回调onInitSuccess  idle - 没有任何回调
    }
  },
  methods: {
    testRecord() {
      this.player.load({
        url: 'http://17ks.chivoxapp.com/guide/guide_3.mp3',
        success: () => {
          this.player.play({
            onStop: () => {
              this.step += 1

              let vlInterval
              let lastRecordId
              // let vlMax = 0

              this.recorder.record({
                duration: 4 * 1000,
                serverParams: {
                  coreType: 'en.sent.child',
                  refText: 'one two three',
                  rank: 100,
                  userId: 'temp001'
                },
                onRecordIdGenerated: (code, message) => {
                  lastRecordId = message.recordId
                },
                onStart: () => {
                  // vlInterval = setInterval(() => {
                  //   let vl = parseFloat(this.recorder.getMicActivityLevel()) * 1.5 / 100
                  //   if (vl > vlMax) vlMax = vl;
                  //   this.$refs.volume.style.height = (vl > 1 ? 1 : vl) * 65 + 'px'
                  // }, 10)
                },
                onStop: () => {
                  clearInterval(vlInterval)
                  this.step += 1

                  let timeout = false
                  let timeoutNo

                  // if (vlMax < 0.1) {
                  //   this.step = 13
                  //   this.showNext = false
                  //   return
                  // }

                  // console.log('开始评分')
                  this.recorder.getScores({
                    recordId: lastRecordId,
                    success: (data) => {
                      if (!timeout) {
                        clearTimeout(timeoutNo)

                        let _data = data[lastRecordId];
                        // console.log(_data)

                        if (_data.errId || _data.result.errID || _data.result.overall < 5) {
                          // console.log('评分出错')
                          this.step = 11
                          this.showNext = false
                        } else {
                          // console.log('检测通过')
                          this.step += 1

                          let countdownInterval = setInterval(() => {
                            if (this.countdown === 1) {
                              clearInterval(countdownInterval)
                              // console.log('关闭引导')
                              this.$refs.container.classList.add('mini')
                              this.onPassed(this.aiPanel, this.player, this.recorder, this.sdkInitStatus)
                            } else {
                              this.countdown -= 1
                            }
                          }, 1000)
                        }
                      }
                    }
                  })

                  timeoutNo = setTimeout(() => {
                    timeout = true;
                    // console.log('评分超时')
                    this.step = 12
                    this.showNext = false
                  }, 10000)
                }
              });
            }
          })
        }
      })
    },
    handleNext(evt) {
      if (this.allowNext) {
        this.step += 1
      } else {
        return
      }

      if (typeof this.max === 'number' && this.step === this.max) {
        this.$refs.container.classList.add('mini')
        this.onPassed(this.aiPanel, this.player, this.recorder, this.sdkInitStatus)
      } else if (typeof this.max === 'number' && this.step === this.max - 1) {
        this.$refs.nextBtn.innerHTML = '确定'
      } else {
        let step = this.step

        if (step === 3) {
          this.showNext = false
          this.player.load({
            url: 'http://17ks.chivoxapp.com/guide/guide_1.mp3',
            success: () => {
              this.player.play({
                onStop: () => {
                  this.step += 1
                  this.player.load({
                    url: 'http://17ks.chivoxapp.com/guide/guide_2.mp3',
                    success: () => {
                      this.player.play()
                    }
                  })
                }
              })
            }
          })
        } else if (step === 5) {
          this.player.stop()
          this.testRecord()
        }
      }
    },
    handleRetry() {
      this.step = 5
      this.testRecord()
    }
  },
  mounted() {
    let dotInterval = setInterval(() => {
      if (this.dots.split('').length < 3) {
        this.dots += '.'
      } else {
        this.dots = ''
      }
    }, 700)

    const cfg = Object.assign({}, Config.chivox, (window.ConfigNew ? window.ConfigNew.sdk : {}))
    const aiPanel = this.aiPanel = new window.chivox.AiPanel(cfg)

    this.player = aiPanel.player
    this.recorder = aiPanel.recorder

    setTimeout(() => {
      clearInterval(dotInterval)
      this.step = 2
      this.allowNext = true
      this.handleNext()
    }, 2400)
  }
}
</script>

<style>
#recorder {
  position: static;
}
</style>

<style lang="less" scoped>
.container {
  position: fixed;
  top: 61px;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);

  &.mini {
    transform: scale(0.0001);
    transform-origin: center;
    transition: transform 400ms;
  }

  & > div {
    width: 480px;
    height: 334px;
    border-radius: 6px;
    background-color: #fff;
    overflow: hidden;
    transform: translateY(-91px);

    .content {
      box-sizing: border-box;
      height: 237px;
    }

    .footer {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 97px;
    }

    button {
      width: 120px;
      margin: 0 10px;
      border: 1px solid #3ebd7d;
      border-radius: 4px;
      color: #fff;
      line-height: 35px;
      background-color: #3ebd7d;
      cursor: pointer;

      &.hidden {
        display: none !important;
      }

      &.yes {
        width: 110px;
        margin: 30px 11px;
      }

      &.no {
        width: 110px;
        margin: 30px 11px;
        border-color: #ddd;
        color: #616161;
        background-color: #f0f0f0;
      }

      &.red {
        border-color: #e75b4f;
        background-color: #e75b4f;
      }

      &.disabled {
        border-color: #ddd;
        color: #616161;
        background-color: #f0f0f0;
        cursor: not-allowed;
      }
    }

    .step0 {
      padding-top: 60px;

      .img1 {
        display: block;
        margin: 0 auto 20px;
      }

      p {
        color: #999999;
        font-size: 16px;
        text-align: center;
        margin: 0;

        &.text2 {
          margin-top: 10px;
        }

        &.text3 {
          position: relative;
          margin-top: 20px;
          color: #3ebd7d;
          font-size: 14px;

          span {
            position: absolute;
            left: 306px;
          }
        }
      }
    }

    .step1 {
      &.mini {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
      }

      padding-top: 43px;

      .img1 {
        display: block;
        margin: 0 auto 34px;
      }

      .img2 {
        position: relative;
        top: -45px;
        left: -10px;
      }
    }

    .step2 {
      padding-top: 20px;

      .img1 {
        display: block;
        margin: 0 auto 15px;
      }

      .img2 {
        width: 100%;
      }
    }

    .step3,
    .step4 {
      padding-top: 60px;

      .img1 {
        display: block;
        margin: 0 auto 20px;
      }

      p {
        margin: 0;
        color: #999;
        font-size: 16px;
        text-align: center;
      }
    }

    .step5 {
      padding-top: 60px;

      & > div {
        position: relative;
        height: 130px;
        margin-bottom: 20px;
        background: url("../../assets/student/guide/microphone_active.png")
          no-repeat center;

        .volumeBarBox {
          position: absolute;
          top: 33px;
          left: 260px;
          width: 21px;
          height: 65px;
          line-height: 65px;
        }

        .volumeBarBox .volumeBar {
          display: inline-block;
          width: 100%;
          height: 0;
          vertical-align: bottom;
          background: url("../../assets/student/guide/pic_voice.png") no-repeat
            center bottom;
        }
      }

      .img1 {
        display: block;
        margin: 0 auto 20px;
      }

      p {
        margin: 0 0 5px;
        color: #999;
        font-size: 16px;
        text-align: center;
      }
    }

    .step8 {
      padding-top: 60px;

      .img1 {
        display: block;
        margin: 0 auto 20px;
      }

      p {
        text-align: center;

        &.text1 {
          margin-top: 14px;
          color: #21bd73;
          font-size: 16px;
          font-weight: bold;
        }

        &.text2 {
          margin-top: 5px;
          color: #919191;
          font-size: 12px;
        }
      }
    }

    .step9 {
      padding-top: 60px;

      .img1 {
        display: block;
        margin: 0 auto 20px;
      }

      p {
        margin: 0;
        font-size: 16px;
        text-align: center;

        &.text1 {
          margin: 15px 0;
          color: #e75b4f;
          font-weight: bold;
        }

        &.text2 {
          color: #999;
          line-height: 26px;
        }
      }

      a {
        display: inline-block;
        width: 140px;
        margin: 30px 10px;
        border: 1px solid #3ebd7d;
        border-radius: 4px;
        color: #fff;
        line-height: 35px;
        text-decoration: none;
        background-color: #3ebd7d;
        cursor: pointer;
      }
    }

    .step10 {
      padding-top: 60px;

      .img1 {
        display: block;
        margin: 0 auto 30px;
      }

      p {
        margin: 0;
        color: #999;
        font-size: 16px;
        text-align: center;
        line-height: 26px;

        span {
          color: #ec9c5d;
          font-weight: bold;
        }
      }
    }

    .step11,
    .step12,
    .step13 {
      padding-top: 60px;

      .img1 {
        display: block;
        margin: 0 auto 10px;
      }

      p {
        margin: 0;
        color: #999;
        font-size: 16px;
        text-align: center;
        line-height: 26px;

        &.text1 {
          color: #e75b4f;
          font-weight: bold;
        }

        &.text2 {
          margin: 5px 0;
          color: #ec9c5d;
        }
      }
    }
  }
}
</style>
