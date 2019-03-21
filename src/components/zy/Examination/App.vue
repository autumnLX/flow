<template lang="pug">
  div(class='page' id='examination')
    header
      div
        p(:title='competitionName') {{ competitionName }}
        a(@click='handleConfirmQuit') 退出
    div(class='panel')
      div(class='top' v-if='submit === "submitted"')
        div(class='submitSuccess')
          div.ss-title 考试完毕
          div.ss-content
            img(src='../../../assets/student/examination/avatar.png')
            div
              div
                div.ss-left
                  span.ss-caption 考试姓名
                  span ：{{stuInfo.name}}
                div.ss-right
                  span.ss-caption 性别
                  span ：{{stuInfo.gender == '1' ? '男':'女'}}
              div
                div.ss-left
                  span.ss-caption 准考证号
                  span ：{{passNumber}}
              div
                div.ss-left
                  span.ss-caption 身份证号
                  span ：
              div
                div.ss-left
                  span.ss-caption 考场
                  span ：
                div.ss-right
                  span.ss-caption 座位号
                  span ：
              div
                div.ss-left
                  span.ss-caption 考点
                  span ：{{stuInfo.stuSchool}}
          div.ss-footer
            p(class='ss-green') 提交答卷完成，请等待监考老师指令...
            p(class='ss-grey') 点击 <span @click='handleQuit'>返回首页</span> 体验咔咪英语更多功能！
      div(class='top' v-else)
        div(class='left')
          p(class='topic' v-if='showTopic') {{topic}}
          p(class='desc' v-html='desc' v-if='showDesc')
          div(class='content' v-show='showContent')
            component(
              :is='currentView' 
              :aiPanel='aiPanel'
              :player='player' 
              :recorder='recorder' 
              :data='currentData'
              :index='currentIndex' 
              :phase='currentPhase'
              :loaded='loaded' 
              :onSetRec='handleSetRec' 
              :onSetMyAnswer='handleSetMyAnswer' 
              :onSetKeyValue='handleSetKeyValue' 
              :onLoad='handleLoad' 
              :onStart='handleStart'
              :js_tdhxz_audios_index='js_tdhxz_audios_index'
            )
        div(class='right')
          p(class='title color-21bd73') 考生信息
          img(:src='student.headPicSrc')
          div
            div(class='item') 
              p(class='color-21bd73') 考生姓名：
              p(class='color-666666') {{student.name}}
            div(class='item') 
              p(class='color-21bd73') 准考证号：
              p(class='color-666666') {{passNumber}}
      div(class='bottom')
        div(class='left')
          span(class='tip' :class='{short: recording}') {{tip}}
          span(class='countdown' :class='{hidden: countdown <= 0}') {{countdown}}
          div(class='progress' :class='{hidden: !recording}')
            span <span>{{countdownForRecord}}</span> / {{progressDuration / 1000}}
            div(ref='progress' :style='{width: progressWidth + "px", transitionDuration: progressDuration + "ms"}')
        div(class='right')
          i(class='rec' :class='{highlight: highlightRec}' v-if='showRec')
          i(class='play' :class='{highlight: highlightPlay}' v-if='showPlay')
          i(class='voice' v-if='showVoice')
            i(:style='{width: voice + "px"}')
          div(style='margin-right: -35px;' v-if='showAdjust')
            div(class='adjust rec')
              div(@click='handleAdjustMicVolume($event)' ref='micVolume')
                div(:style='{width: currentMicVolume + "px"}')
                i(:style='{left: currentMicVolume + "px"}' @mousedown='handleDragStart($event, "mic")')
            div(class='adjust play')
              div(@click='handleAdjustPlyVolume($event)' ref='plyVolume')
                div(:style='{width: currentPlyVolume + "px"}')
                i(:style='{left: currentPlyVolume + "px"}' @mousedown='handleDragStart($event, "ply")')
    //- popup
    div(class='popup' v-if='showPopup')
      div
        div(class='body')
          p 确定要退出？
          p 退出后将不保存进度，下次需重新开始测评
        div(class='footer')
          button(@click='handleQuit') 退出
          button(class='secondary' @click='handleCancelQuit') 暂不退出
    div(class='popup' v-if='submit === "submitting"')
      div
        i(class='icon submitting')
        p(class='text-green') 考试结束，正在努力交卷中...
    div(class='popup' v-if='submit === "fail"')
      div
        i(class='icon fail')
        p(class='text-666') 哎呀，网络又调皮了，交不了卷了！
        div(class='footer')
          button(class='secondary' @click='handleQuit') 返回首页
          button(@click='handleSubmit') 重新交卷
    div(id='score'  v-if='submit === "result"')
      div(:class='{red: result.score === 0}')
        <p class='p1'><span>{{result.score}}</span>分</p>
        a(:href='result.report' target='_blank') 查看分数详情&gt
        p(class='p2') {{result.score > 0 ? '恭喜你同学，继续努力哟！' : '哎呀，要加油哦！'}} 
        p(class='p4' v-if='competitionType === "4"')
          span(class='fl') 历史最高分：{{result.highest}}
          span(class='fr') 当前排名：{{result.rank}}
        p(class='p4' style='text-align: center' v-else)
          span(class='fn') 历史最高分：{{result.highest}}
        div(style='display: flex;justify-content: center;margin-top: 30px;')
            button(name='again' @click='handleRetry') 再试一次
            button(name='back' @click='handleQuit') 完成
        span(v-if='result.remain < 11') 还剩{{result.remain}}次机会
    Guide(:onPassed='handlePassed' :max='3' ref='guide' v-if='showGuide')
</template>

<script>
import $ from '@/utility/dollar.js'
import Config from '@/config/config.js'
import Guide from '@/components/zy/Guide'
import Beijing from '@/components/guides/Beijing' // 北京
import Yinchuan from '@/components/guides/Yinchuan' // 银川
import KuaiLeMaiTian from '@/components/guides/KuaiLeMaiTian' // 快乐麦田
import Shenyang from '@/components/guides/Shenyang' // 沈阳
import Newshengyang from '@/components/guides/new_shengyang' // 沈阳
import JiangSuZhongKao from '@/components/guides/JiangSuZhongKao' // 江苏中考
import Ningbo from '@/components/guides/Ningbo' // 宁波中考
import BJ_Topics from './Beijing/index'
import YC_Topics from './Yinchuan/index'
import SY_Topics from './Shenyang/index'
import JSZK_Topics from './JiangSuZhongKao/index'
import NB_Topics from './Ningbo/index'
// import _flow from './JiangSuZhongKao.json'
// import _flow from './Ningbo.json'
import event from '@/eventbus'
const textKeys = ['topic', 'desc', 'tip']
let flow
// mock:start
// mock:end
let childToParent = new WeakMap()
let topicIndex = -1 // 大题序号
let subTopicIndex = -1 // 小题序号
let lastQuestionIndex // 上一小题的序号
let flowIndex = []

export default {
  name: 'Examination',
  components: { Guide, Beijing, Yinchuan, KuaiLeMaiTian, Shenyang, JiangSuZhongKao, Ningbo, ...BJ_Topics, ...YC_Topics, ...SY_Topics, ...JSZK_Topics, Newshengyang, ...NB_Topics },
  data () {
    return {
      isSkip: $.getUrlParam('isSkip') === '1', // 跳过引导
      mode: 1, // 1定时显示成绩，3实时显示成绩
      showGuide: false,
      showPopup: false,
      showTopic: false,
      showDesc: false,
      showContent: true,
      showRec: true,
      showPlay: true,
      showVoice: true,
      showAdjust: false,
      submit: '', // 提交状态：submitting | submitted | fail
      currentView: '',
      currentIndex: 1,
      currentData: {},
      currentPhase: 1,
      currentMicVolume: 9, // 麦克风音量progress偏移量
      currentPlyVolume: 9, // 回放音量progress偏移量
      loaded: false, // 试卷是否加载完成
      student: {
        headPicSrc: '/web/static/pic_head.png',
        name: $.getUrlParam('name', 'decodeURIComponent'),
        id: '',
      },
      passNumber: '', // 准考证号
      aiPanel: '',
      player: '',
      recorder: '',
      topic: '',
      desc: '',
      tip: '',
      countdown: 0,
      countdownForRecord: 0,
      voice: 0,
      progressDuration: 0,
      progressWidth: 0,
      highlightRec: false,
      highlightPlay: false,
      recording: false,
      currentFlow: null,
      answer: [],
      recParams: {}, // 内核评分参数
      competitionName: '',
      competitionType: '',
      paperId: '',
      submitData: [],
      standardAudio: '',
      result: {
        score: 0,
        rank: 2,
        highest: 40,
        remain: 999,
        report: '#'
      },
      stuInfo: {
        name: $.getUrlParam('name', 'decodeURIComponent'),
        gender: $.getUrlParam('gender', 'decodeURIComponent'),
        stuSchool: $.getUrlParam('stuSchool', 'decodeURIComponent')
      },
      js_tdhxz_audios () {
        return () => { }
      },
      js_tdhxz_audios_index: -2
    }
  },
  methods: {
    doPlay (audioUrl, callback = function () { }) { // 播放音频
      this.player.load({
        url: audioUrl,
        success: () => {
          let voiceInterval
          this.player.play({
            onStart: () => {
              this.highlightPlay = true
              voiceInterval = setInterval(() => {
                this.voice = 40 + Math.random() * 30
              }, 50)
            },
            onStop: () => {
              clearInterval(voiceInterval)
              this.voice = 0
              this.highlightPlay = false
              callback()
            }
          })
        }
      })
    },
    handleRetry () { // 再试一次
      if (this.result.remain > 0) {
        // 初始化辅助参数
        this.submit = ''
        this.js_tdhxz_audios_index = -2
        this.handleLoad(() => {
          this.handleStart()
        })
      } else {
        alert('已经没有多余练习机会了！')
      }
    },
    handleCountdownForRecord (time) { // 录音倒计时数字显示
      this.countdownForRecord = time
      const countdownForRecordInterval = setInterval(() => {
        if (this.countdownForRecord <= 0) {
          clearInterval(countdownForRecordInterval)
        } else {
          this.countdownForRecord -= 1
        }
      }, 1000)
    },
    handleConfirmQuit () {
      if (this.submit !== 'submitted' && this.submit !== 'result') {
        this.showPopup = true
      } else {
        this.handleQuit()
      }
    },
    handleCancelQuit () {
      this.showPopup = false
    },
    handleQuit () {
      let fromUrl = $.getUrlParam('fromUrl', 'decodeURIComponent') || ''
      window.location.href = fromUrl ? fromUrl.replace(/{{q}}/g, '?').replace(/{{a}}/g, '&') : '/stu'
    },
    handlePassed (aiPanel, player, recorder) { // 设备检测通过，开始内部检测流程
      const mid = this.modelId
      const mids = {
        2: 'Beijing',
        3: 'Yinchuan',
        4: 'KuaiLeMaiTian',
        5: 'Shenyang',
        8: 'JiangSuZhongKao',
        9: 'Newshengyang',
        10: 'Ningbo'
      }
      let guideName = mids[mid]
      if (guideName) {
        console.log(aiPanel)
        this.aiPanel = aiPanel
        this.player = player
        this.recorder = recorder
        if (this.isSkip) {
          this.handleLoad()
          let startTimeout = setInterval(() => {
            if (this.exam) {
              clearInterval(startTimeout)
              this.handleStart()
            }
          }, 500)
        } else this.currentView = guideName
        // this.currentMicVolume = this.recorder.getMicVolume() * 146 + 9
        // this.currentPlyVolume = this.recorder.getVolume() * 146 + 9
      } else {
        alert('modelId[' + mid + ']不存在')
      }
    },
    handleSetKeyValue (key, value) { // 子修改父data
      if (key === 'progressDuration') {
        this.handleCountdownForRecord(value / 1000)
      }

      this[key] = value
    },
    handleAdjustMicVolume (event) { // 调节麦克风音量
      if (this.isDragFinish) {
        return
      }

      const rect = event.target.getBoundingClientRect()
      let volume = event.clientX - rect.left

      if (volume < 9) {
        volume = 9
      } else if (volume > 155) {
        volume = 155
      }

      this.currentMicVolume = volume
      this.recorder.setMicVolume((volume - 9) / 146)
    },
    handleAdjustPlyVolume (event) { // 调节放音音量
      if (this.isDragFinish) {
        return
      }

      const rect = event.target.getBoundingClientRect()
      let volume = event.clientX - rect.left

      if (volume < 9) {
        volume = 9
      } else if (volume > 155) {
        volume = 155
      }

      this.currentPlyVolume = volume
      // console.info((volume - 9) / 146)
      this.recorder.setVolume((volume - 9) / 146)
    },
    handleDragStart (event, type) { // 拖动调节
      this.dragTarget = event.target
      this.startPoint = event.clientX
      this.adjustType = type
    },
    handleLoad (callback = function () {}) { // 加载试题
      $.jsonp('/WebCompetition/getPaperInfo', {
        competitionId: $.getUrlParam('competitionId'),
        groupId: $.getUrlParam('groupId'),
        stageId: $.getUrlParam('stageId'),
        paperId: $.getUrlParam('paperId')
      }, (res) => {
        if (res.status === 1) {
          if (res.data.length > 0) {
            this.paperId = res.data[0].paperId
            this.submitData = $.initSubmitData(res.data).concat([])
            this.loaded = true

            if (this.modelId === '5' || this.modelId === '9') { // 沈阳考试需要对【短对话理解】做合并处理
              const ddhljDataList = []
              for (let i = 0; i < 3; i++) {
                const ddhljData = {
                  topicAttachment: res.data[0].topicList[i].topicAttachment,
                  topicOption: res.data[0].topicList.map(t => {
                    return {
                      topicStem: t.topicContent,
                      options: t.topicOption
                    }
                  })
                }
                ddhljDataList.push(ddhljData)
              }
              res.data[0].topicList = ddhljDataList
              // res.data = [res.data[4]]
            }
            this.exam = this.modelId === '8' ? this.get_jszk_data(res.data) : res.data
            if (this.modelId === '8') {
              let js_tdhxz_audios = function* (exam) {
                const list = exam[0].topicList
                for (let index in list) {
                  yield list[index]
                  yield list[index]
                }
              }
              this.js_tdhxz_audios = js_tdhxz_audios(this.exam)
            }
            // 跳过流程
            // for (let i = 0; i < 1; i++) {
            //   this.exam.shift()
            //   flow.shift()
            //   this.submitData.shift()
            // }
            callback()
          } else {
            alert('作业内容为空')
          }
        } else {
          alert('哎呀，网络又调皮了！')
        }
      })
    },
    handleStart () { // 开始考试
      $.post('/postAssessment/post', {
        postAssessmentUrl: this.cpUrl + '/SubmitCompetition/startCompetition',
        groupId: $.getUrlParam('groupId'),
        stageId: $.getUrlParam('stageId')
      }, (res) => {
        if (res.status === 1) {
          this.answer = []
          this.showTopic = true
          this.showDesc = true
          // flowIndex.unshift(0)
          childToParent = new WeakMap()
          topicIndex = -1
          subTopicIndex = -1
          lastQuestionIndex = -1
          flowIndex = [0]
          this.next(flow)
        } else {
          alert(res.info)
        }
      })
    },
    handleSetRec (param) { // 设置录音送评参数
      this.recParams = param
    },
    handleSetMyAnswer (data, index) { // 设置文本答案
      const questionIndex = index !== undefined ? index : subTopicIndex // childToParent.get(this.currentFlow)[flowIndex[1] - 1].past - 1

      if (!(this.answer[topicIndex] instanceof Array)) {
        this.answer[topicIndex] = []
      }

      if (!this.answer[topicIndex][questionIndex]) {
        this.answer[topicIndex][questionIndex] = {}
      }

      this.answer[topicIndex][questionIndex].myAnswer = data
    },
    handleSetAudioAnswerList (data) { // 设置录音答案
      // const questionIndex = subTopicIndex // childToParent.get(this.currentFlow)[flowIndex[1] - 1].past - 1
      if (!(this.answer[topicIndex] instanceof Array)) {
        this.answer[topicIndex] = []
      }
      let currentsubTopicIndex = subTopicIndex
      if (['js_qjwd', 'nb_qjwd'].indexOf(this.currentView) >= 0) currentsubTopicIndex = 0
      if (!this.answer[topicIndex][currentsubTopicIndex]) {
        this.answer[topicIndex][currentsubTopicIndex] = {}
      }

      let currentQuestion = this.answer[topicIndex][currentsubTopicIndex]
      currentQuestion.isAudio = true

      let aal = {}

      if (!currentQuestion.audioAnswerList) {
        currentQuestion.audioAnswerList = []
      }

      if (data) {
        aal.coreType = this.recParams.coreType
        aal.attributes = data.result
        aal.recordId = data.uuid
        aal.standardAudio = this.standardAudio

        if (this.recParams.coreType === 'en.sent.recscore') {
          const statusCode = data.result.recscore.status_code
          aal.audioUrl = data.audioUrl

          if (statusCode === 20000 || statusCode === 20002) {
            aal.score = data.result.conf
          } else {
            aal.score = 0
          }
        } else {
          aal.score = data.result.overall
          aal.audioUrl = data.audioUrl
        }
      }

      currentQuestion.audioAnswerList.push(aal)
    },
    handleJSZKData () {
      let answerDataList = this.answer.concat([])
      let dataList = [[], [], [], [], []]
      let answerList = answerDataList[0][0].myAnswer.split(',').concat(answerDataList[1][0].myAnswer.split(','))
      let len = answerList.length
      for (let m = 0; m < len; m++) {
        let currneData = answerList[m]
        if (m >= 0 && m < 4) {
          dataList[0].push(currneData)
        } else if (m >= 4 && m < 10) {
          dataList[1].push(currneData)
        } else if (m >= 10 && m < 12) {
          dataList[2].push(currneData)
        } else if (m >= 12 && m < 15) {
          dataList[3].push(currneData)
        } else {
          dataList[4].push(currneData)
        }
      }
      for (let i = 0; i < dataList.length; i++) {
        if (i <= 1) {
          for (let n = 0; n < dataList[i].length; n++) {
            dataList[i][n] = {
              myAnswer: dataList[i][n]
            }
          }
        } else {
          dataList[i] = [{
            myAnswer: dataList[i].join(',')
          }]
        }
      }
      dataList[5] = answerDataList[2]
      dataList[6] = answerDataList[3]
      dataList[7] = answerDataList[4]
      return dataList
    },
    handleSubmit () { // 提交答案
      let _data = ''
      if (this.modelId === '8') { // 数据特殊处理
        _data = this.handleJSZKData()
      } else {
        _data = this.answer.concat([])
      }
      let _submitData = []
      let groupId = $.getUrlParam('groupId')
      let stageId = $.getUrlParam('stageId')
      let paperId = this.paperId
      for (let i = 0; i < this.submitData.length; i++) {
        for (let j = 0; j < this.submitData[i].length; j++) {
          let sData = this.submitData[i][j]
          let dData = _data[i][j]
          if (!dData) {
            dData = {}
          }

          if (dData.isAudio) {
            for (let key in dData) {
              if (key !== 'audioAnswerList') {
                sData[key] = dData[key]
              }
            }

            for (var k = 0; k < sData.audioAnswerList.length; k++) {
              for (let key in dData.audioAnswerList[k]) {
                sData.audioAnswerList[k][key] = dData.audioAnswerList[k][key]
              }
            }

            sData.audioAnswerList.length = dData.audioAnswerList.length
          } else {
            for (let key in dData) {
              sData[key] = dData[key]
            }
            sData.audioAnswerList = []
          }

          _submitData.push(JSON.parse(JSON.stringify(sData)))
        }
      }

      $.post('/postAssessment/post', {
        postAssessmentUrl: this.cpUrl + '/SubmitCompetition/submit',
        competitionId: $.getUrlParam('competitionId'),
        groupId,
        stageId,
        paperId,
        answerJSON: JSON.stringify(_submitData)
      }, (res) => {
        if (res.status === 1) {
          /**
           * show_time_flag =  3 实时显示分数
           * show_time_flag = -1 为自学（by 陈维），自学也应该是实时显示成绩 for bug#14507
           */
          console.info(res)
          if (this.mode === 3 || this.mode === -1) {
            const resData = res.data || {}
            this.submit = 'result'
            this.result = {
              score: resData.total_score || 0,
              rank: resData.current_ranking || 1,
              highest: resData.highest_score || 0,
              remain: resData.remain_times || 0,
              report: window.ReportMapping.getReportUrl('rt', stageId, groupId, paperId) || '#'
            }
          } else {
            this.submit = 'submitted'
          }
        } else {
          this.submit = 'fail'
        }
      })
    },
    get_jszk_data (data) { // 江苏中考需要合并处理的题型
      data[0].topicList = data[0].topicList.concat(data[1].topicList)
      data[1].topicList = data[2].topicList.concat(data[3].topicList, data[4].topicList)
      return [data[0], data[1], ...data.slice(5)]
    },
    next (current) { // 流程下一步
      this.currentFlow = current

      const parent = childToParent.get(current)
      if (flowIndex[0] === current.length) {
        if (parent) {
          if (parent[flowIndex[1] - 1].loop > 0) {
            parent[flowIndex[1] - 1].loop -= 1
            parent[flowIndex[1] - 1].past += 1
            flowIndex[0] = 0
            this.next(current)
          } else {
            parent[flowIndex[1] - 1].loop = parent[flowIndex[1] - 1].past
            parent[flowIndex[1] - 1].past = 0
            flowIndex.shift()
            this.next(parent)
          }
        } else {
          this.tip = '考试结束'
          this.submit = 'submitting'
          this.handleSubmit()
        }
      } else {
        let step = current[flowIndex[0]]

        let loop = step.loop

        if (step.type === 'gdymfLoop') { // 跟读与模仿 改写loop的值为句子数
          loop = step.loop = this.exam[topicIndex].topicList[subTopicIndex].topicOption.length
        }

        flowIndex[0] += 1

        textKeys.forEach((key) => {
          if (step[key]) {
            let text = step[key]
            if (/\$\{[^}]+\}/.test(text)) {
              text = text.replace(/\$\{([^}]*)\}/g, (str, $1) => {
                return eval($1.replace(/loop/g, childToParent.get(current)[flowIndex[1] - 1].past))
              })
            }
            this[key] = text
          }
        })

        if (typeof loop === 'number') {
          if (loop > 0) {
            const parent = current
            const child = step.flow
            childToParent.set(child, parent)
            flowIndex.unshift(0)
            step.past = 1
            step.loop -= 1
            this.next(child)
          } else {
            this.next(current)
          }
        } else {
          let directive = step.directive
          let duration = step.duration
          let audio = step.audio

          if (directive === 'enter') {
            topicIndex += 1
            subTopicIndex = -1 // Add
            lastQuestionIndex = -1
            this.tdhdwdtLoopCount = -1
            this.showContent = false
            this.currentView = step.type
            if (step.type === 'nb_tddhdt') {
              this.currentData = this.exam[topicIndex].topicList
            } else if (!(step.type === 'js_tdhxz')) {
              this.currentData = this.exam[topicIndex].topicList[0]
            }
            this.$nextTick(() => this.next(current))
          } else if (directive === 'render') {
            if (this.modelId === '8' && topicIndex === 0) {
              this.currentData = this.exam[0].topicList
              this.showContent = true
              this.next(current)
            } else {
              let past = childToParent.get(current)[flowIndex[1] - 1].past - 1
              let topicList = this.exam[topicIndex].topicList
              let question = topicList[past] || topicList[0] // 如果是一页上完成一整道大题

              if (step.type === 'gdymf' && !step.audioIdx) this.gdymfLoopCount = -1
              if (step.type === 'nb_tcdhdt' && step.prerender) this.tcdhdtLoopCount = -1
              this.standardAudio = ''
              if (past === lastQuestionIndex) {
                // console.info('同一小题的下一个部分')
                question.phase += 1
              } else {
                question.phase = 1
                this.currentData = question
                if (!step.prerender) {
                  subTopicIndex += 1 // Add
                }
              }

              if (current[0] && current[0].type === 'gdymf') {
                this.currentPhase = -1
                if (current[0].audioIdx === 'single') {
                  this.gdymfLoopCount += 1
                }
                this.currentIndex = this.gdymfLoopCount
              } else if (step.type === 'tdhdwdt' && step.prerender) {
                this.tdhdwdtLoopCount += 1
                this.currentIndex = this.tdhdwdtLoopCount
                this.currentData = this.exam[topicIndex].topicList[this.tdhdwdtLoopCount]
              } else if (step.type === 'nb_tcdhdt' && !step.prerender) {
                this.tcdhdtLoopCount += 1
                this.currentIndex = this.tcdhdtLoopCount
              } else {
                this.currentPhase = question.phase
                this.currentIndex = step.prerender ? -1 : past
              }
              this.showContent = true

              if (!step.prerender) lastQuestionIndex = past

              let nextStep = current[flowIndex[0] + 1]

              if (nextStep && nextStep.directive === 'record') {
                setTimeout(() => this.next(current))
              } else {
                this.next(current)
              }
            }
          } else if (directive === 'record') {
            let vlInterval
            // let maxVolume = 0

            this.recorder.record({
              duration: duration,
              serverParams: this.recParams,
              onRecordIdGenerated: (code, message) => {
                this.lastRecordId = message.recordId
              },
              onStart: () => {
                this.progressDuration = duration
                this.progressWidth = 0
                this.recording = true
                this.highlightRec = true
                setTimeout(() => {
                  this.progressWidth = 456
                }, 100)

                this.handleCountdownForRecord(duration / 1000)

                // vlInterval = setInterval(() => {
                //   let voice = this.recorder.getMicActivityLevel()
                //   voice > maxVolume && (maxVolume = voice)
                //   voice += 7
                //   if (voice > 100) {
                //     voice = 100
                //   }
                //   this.voice = voice
                // }, 50)
              },
              onStop: () => {
                clearInterval(vlInterval)

                this.recording = false
                this.highlightRec = false
                this.progressWidth = 0

                // if (maxVolume > 10) {
                this.recorder.getScores({
                  recordId: this.lastRecordId,
                  success: (data) => {
                    try {
                      const res = data[this.lastRecordId]

                      if (res.errId || res.result.errID) {
                        this.handleSetAudioAnswerList(null)
                      } else {
                        this.handleSetAudioAnswerList(res)
                      }

                      this.next(current)
                    } catch (e) {
                      console.info(e)
                      this.handleSetAudioAnswerList(null)
                    }
                  }
                })
                // }
              }
            })
          } else if (directive === 'play') {
            if (this.modelId === '8' && topicIndex === 0 && audio) {
              this.js_tdhxz_audios_index += 1
            }
            if (this.modelId === '8' && topicIndex === 0 && !audio) {
              audio = this.js_tdhxz_audios.next().value.topicAttachment[0].attachmentUrl
              audio = this.standardAudio = (window.ConfigNew ? window.ConfigNew.resUrl : Config.res) + audio
            } else {
              let past = childToParent.get(current)[flowIndex[1] - 1].past
              if (!audio) { // 如果流程里面没有音频，则去题目中取音频
                const currentTopics = this.exam[topicIndex].topicList
                let currentTopic = ''
                if (current[0] && current[0].type === 'tdhdwdt') {
                  currentTopic = currentTopics[this.tdhdwdtLoopCount]
                } else {
                  currentTopic = currentTopics[current[0].audioIdx === 'total' ? 0 : this.currentIndex]
                }
                if (current[0] && current[0].type === 'gdymf') {
                  if (current[0].audioIdx === 'total') {
                    audio = currentTopic.topicAttachment[0] ? currentTopic.topicAttachment[0].attachmentUrl : ''
                  } else {
                    audio = currentTopics[0].topicOption[this.currentIndex].audio.attachmentUrl
                  }
                } else if (currentTopic && currentTopic.topicAttachment[0]) {
                  audio = currentTopic.topicAttachment[0].attachmentUrl
                } else { // 如果是在一页上把所有
                  audio = currentTopics[0].topicOption[this.currentIndex].audio.attachmentUrl
                }

                audio = this.standardAudio = (window.ConfigNew ? window.ConfigNew.resUrl : Config.res) + audio
              } else if (/\$\{loop\}/.test(audio)) {
                audio = audio.replace(/\$\{loop\}/g, past)
              }
            }
            this.doPlay(audio, () => {
              this.next(current)
            })
          } else if (directive === 'wait') {
            if (duration instanceof Array) {
              duration = duration[this.currentIndex]
            }

            if (duration && duration > 0) {
              this.countdown = duration / 1000
              let countdownInterval = setInterval(() => {
                duration -= 1000
                this.countdown = duration / 1000

                if (duration === 0) {
                  clearInterval(countdownInterval)
                  this.next(current)
                }
              }, 1000)
            } else {
              this.next(current)
            }
          } else if (directive === 'event') {
            event.$emit(step.name)
            this.next(current)
          } else {
            alert(`未知指令[${directive}]`)
          }
        }
      }
    }
  },

  // beforeMount () {
  //   flow = _flow
  // },
  mounted () {
    this.cpUrl = window.ConfigNew ? window.ConfigNew.jdcpIP : Config.cpUrl
    const modelId = this.modelId = $.getUrlParam('modelId')

    document.body.addEventListener('mousemove', (event) => {
      if (this.dragTarget) {
        const rect = this.$refs.micVolume.getBoundingClientRect()
        let volume = event.clientX - rect.left

        if (volume < 9) {
          volume = 9
        } else if (volume > 155) {
          volume = 155
        }

        const vol = (volume - 9) / 146
        // console.info(vol)
        if (this.adjustType === 'mic') {
          this.currentMicVolume = volume
          this.recorder.setMicVolume(vol)
        } else {
          this.currentPlyVolume = volume
          this.recorder.setVolume(vol)
        }
      }
    })

    document.body.addEventListener('mouseup', (event) => {
      if (this.dragTarget) {
        this.dragTarget = null
        this.adjustType = ''
        this.isDragFinish = true
        setTimeout(() => {
          this.isDragFinish = false
        })
      }
    })

    $.post('/students/getSessionName', {}, (res) => {
      if (res.status !== 1) {
        window.alert(res.info)
        window.location.href = '/login'
      } else {
        if (res.data.headPic) this.$set(this.student, 'headPicSrc', res.data.headPic)
        this.$set(this.student, 'name', res.data.name)
        this.showGuide = true

        $.jsonp('/MEnglishCompetition/getCompetitionInfo', { // 获得考试相关信息
          competitionId: $.getUrlParam('competitionId')
        }, (res) => {
          const data = res.data
          const endDate = data.competitionRange ? data.competitionRange[data.stageFlag - 1].endDate : '2088-1-1'
          let competitionEndFlag = new Date() > new Date(endDate)

          if (competitionEndFlag || data.isDelete === '1' || data.status === '1') {
            alert('该阶段已过期')
            window.location.href = '/stu'
          } else {
            this.mode = Number(data.show_time_flag)
            this.competitionName = data.competitionName
            this.competitionType = data.competition_type
          }
        })
      }
    })

    if (!flow) {
      $.jsonp('/paperProcedures/getProcedureForWeb', { // 获取考试流程
        modelId
      }, (res) => {
        flow = res.data
      })
    }
  }
}
</script>

<style>
#examination .top .desc > p {
  margin: 0;
  line-height: 24px;
}
</style>

<style lang="less" scoped>
@width: 1014px;
@image-base-url: "../../../assets/student/examination";

.color-21bd73 {
  color: #21bd73;
}

.color-999999 {
  color: #999999;
}

.color-666666 {
  color: #666666;
}

.color-bababa {
  color: #bababa;
}

.hidden {
  display: none !important;
}

.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f0f2ef url("@{image-base-url}/bg_test.png") no-repeat center
    bottom;

  header {
    background-color: #21bd73;

    & > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: @width;
      height: 61px;
      margin: 0 auto;

      * {
        color: #fff;
        font-size: 18px;
        font-style: normal;
      }

      p {
        width: 468px;
        margin: 0;
        font-size: 20px;
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      a {
        padding-left: 30px;
        background: url("@{image-base-url}/icon_quit.png") no-repeat left center;
        cursor: pointer;
      }
    }
  }

  .panel {
    display: flex;
    flex-direction: column;
    width: @width;
    min-height: 540px;
    max-height: 680px;
    flex: 1;
    margin: 30px auto;
    border-radius: 7px;
    box-shadow: 0px 1px 3px #dddedc;
    background-color: #f9f9f9;
    overflow: hidden;

    .top {
      position: relative;
      display: flex;
      flex: 1;
      border-bottom: 1px solid #ededed;

      .left {
        display: flex;
        flex-direction: column;
        width: 814px;
        // height: 460px;
        border-right: 1px solid #ededed;
        background-color: #fff;

        .topic {
          height: 59px;
          margin: 0 50px;
          border-bottom: 1px solid #ededed;
          color: #333;
          font-size: 22px;
          font-weight: bold;
          font-family: "宋体";
          line-height: 59px;
        }

        .desc {
          padding: 0 50px;
          margin: 10px 0 0 0;
          color: #333;
          font-size: 18px;
          font-family: "宋体";
        }

        .content {
          display: flex;
          flex: 1;
          overflow-y: auto;

          & > div {
            width: 100%;
            padding: 10px 50px;
            box-sizing: border-box;
          }
        }
      }

      .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 30px 0;

        .title {
          margin: 0;
          margin-bottom: 30px;
          font-size: 18px;
        }

        img {
          margin-bottom: 30px;
        }

        div {
          flex: 1;

          .item {
            padding: 0 40px;
            margin-bottom: 30px;

            p {
              margin: 0;
              font-size: 18px;
              font-family: "宋体";
              line-height: 27px;
            }
          }
        }
      }

      .submitSuccess {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: #fff;

        .ss-title {
          box-sizing: border-box;
          width: 560px;
          padding-left: 36px;
          color: #fff;
          font-size: 20px;
          line-height: 44px;
          background-color: #21bd73;
        }

        .ss-content {
          display: flex;
          align-items: center;
          box-sizing: border-box;
          width: 560px;
          padding: 40px 0 0 36px;
          background-color: #f5fff9;

          img {
            width: 120px;
            height: 120px;
            margin: 0;
          }

          & > div {
            flex: 1;
          }

          & > div > div {
            display: flex;
            margin: 20px 0 20px 32px;

            .ss-left {
              flex: 1;
            }

            .ss-right {
              width: 133px;
            }

            span {
              color: #333;
            }

            span.ss-caption {
              color: #21bd73;
            }
          }
        }

        .ss-footer {
          justify-content: center;
          align-items: center;
          width: 560px;
          height: 110px;
          background-color: #d9fce9;

          p {
            width: 100%;
            text-align: center;
          }

          .ss-green {
            height: 22px;
            line-height: 22px;
            margin: 32px auto 16px;
            color: #21bd73;
            font-size: 22px;
          }

          .ss-grey {
            color: #999;
            font-size: 14px;
            line-height: 14px;
            height: 14px;

            span {
              color: #21bd73;
              text-decoration: underline;
              cursor: pointer;
            }
          }
        }
      }
    }

    .bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 75px;
      padding: 0 40px 0 52px;
      background-color: #21bd73;

      .left {
        display: flex;
        align-items: center;

        .tip {
          width: 430px;
          color: #fff;
          font-size: 20px;

          &.short {
            width: 180px;
          }
        }

        .countdown {
          color: #fff;
          font-size: 30px;
          font-weight: bold;
        }

        .progress {
          position: relative;
          width: 456px;
          height: 14px;
          background-image: url("@{image-base-url}/pic_rec_null.png");

          div {
            position: absolute;
            top: 0;
            left: 0;
            width: 0;
            height: 14px;
            background-image: url("@{image-base-url}/pic_rec_full.png");
            transition-property: width;
            transition-timing-function: linear;
          }

          & > span {
            position: absolute;
            top: -24px;
            left: 50%;
            color: #fff;
            font-size: 16px;
            transform: translateX(-50%);

            span {
              color: #fbc564;
              font-size: 16px;
            }
          }
        }
      }

      .right {
        display: flex;

        i {
          height: 40px;

          &.rec {
            width: 45px;
            border-right: 1px solid #4dc98f;
            background-image: url("@{image-base-url}/icon_rec_n.png");
            &.highlight {
              background-image: url("@{image-base-url}/icon_rec_y.png");
            }
          }

          &.play {
            width: 45px;
            background-image: url("@{image-base-url}/icon_play_n.png");
            &.highlight {
              background-image: url("@{image-base-url}/icon_play_y.png");
            }
          }

          &.voice {
            position: relative;
            width: 100px;
            margin-left: 15px;
            background-image: url("@{image-base-url}/pic_voice_null.png");

            i {
              position: absolute;
              top: 0;
              left: 0;
              height: 40px;
              background-image: url("@{image-base-url}/pic_voice_full.png");
            }
          }
        }

        .adjust {
          display: flex;
          align-items: center;
          height: 37px;
          padding-left: 30px;
          background-repeat: no-repeat;
          background-position: left center;

          &.rec {
            background-image: url("@{image-base-url}/pic_smallmic.png");
          }

          &.play {
            background-image: url("@{image-base-url}/pic_smallvoice.png");
          }

          & > div {
            position: relative;
            width: 165px;
            height: 19px;
            background-image: url("@{image-base-url}/pic_smallline_null.png");
            cursor: pointer;

            & > div {
              width: 0;
              height: 19px;
              background-image: url("@{image-base-url}/pic_smallline_full.png");
              background-repeat: no-repeat;
            }

            & > i {
              position: absolute;
              top: 0;
              left: 0;
              width: 19px;
              height: 19px;
              background-image: url("@{image-base-url}/pic_holdcircle.png");
              transform: translateX(-9px);
            }
          }
        }
      }
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
        width: 100px;
        padding: 0;
        margin: 0 25px;
        border: 1px solid #f76260;
        border-radius: 2px;
        color: #fff;
        font-size: 16px;
        line-height: 38px;
        background-color: #f76260;
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
          margin: 0;
          color: #666;
          font-size: 16px;
          text-align: center;
          line-height: 30px;
        }
      }

      .footer {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 97px;
      }
    }

    p.text-green {
      margin: 0;
      color: #21bd73;
      font-size: 18px;
      font-weight: bold;
      text-align: center;

      &:last-child {
        margin-bottom: 60px;
      }
    }

    p.text-gray {
      margin: 25px 0 35px;
      color: #999;
      text-align: center;
    }

    p.text-666 {
      margin: 0;
      color: #666;
      font-size: 16px;
      text-align: center;
    }

    i.icon {
      display: block;
      width: 60px;
      height: 60px;

      &.submitting {
        margin: 50px auto 20px;
        background-image: url("@{image-base-url}/pic_download.gif");
      }

      &.submitted {
        margin: 35px auto 20px;
        background-image: url("@{image-base-url}/pic_finish.png");
      }

      &.fail {
        width: 101px;
        height: 81px;
        margin: 30px auto 10px;
        background-image: url("@{image-base-url}/pic_neterror.png");
      }
    }
  }
}

#score {
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
    position: relative;
    box-sizing: border-box;
    width: 386px;
    height: 417px;
    padding-top: 70px;
    background-image: url("@{image-base-url}/score_green.png");
    transform: translateY(-61px);

    .p1 {
      margin-bottom: 0;
      color: #fff;
      font-size: 18px;
      text-align: center;

      span {
        width: 60px;
        font-size: 68px;
      }
    }

    .p2 {
      margin-top: 30px;
      color: #fff;
      font-size: 18px;
      font-weight: bold;
      text-align: center;
    }

    .p3 {
      margin-top: 16px;
      color: #fff;
      font-size: 12px;
      text-align: center;
      height: 18px;
      line-height: 18px;

      span {
        color: #f9c911;
        font-size: 14px;
        font-weight: bold;
      }

      a {
        color: #fff;
        text-decoration: underline;
      }
    }

    .p4 {
      margin-top: 40px;
      padding: 0 40px;
      overflow: hidden;

      span {
        padding-left: 24px;
        color: #9e9e9e;
        font-size: 16px;
        background-repeat: no-repeat;
        background-position: left center;

        &.fl,
        &.fn {
          background-image: url("@{image-base-url}/score_history.png");
        }

        &.fr {
          background-image: url("@{image-base-url}/score_rank.png");
        }
      }
    }

    button {
      width: 100px;
      height: 35px;
      margin: 0 20px;
      border: 0;
      border-radius: 8px;
      background-color: #fff;
      cursor: pointer;

      &[name="again"] {
        border-color: 1px solid #3ebe7d;
        color: #fff;
        background-color: #3ebe7d;
      }

      &[name="back"] {
        border: 1px solid #616161;
        color: #616161;
      }
    }

    a {
      display: block;
      width: 100px;
      margin: 0 auto;
      color: #fff21c;
      text-decoration: underline;
    }

    & > span {
      position: absolute;
      bottom: 18px;
      left: 73px;
      width: 100px;
      color: #c1c1c1;
      font-size: 12px;
      text-align: center;
    }

    &.red {
      background-image: url("@{image-base-url}/score_red.png");

      button[name="again"] {
        border-color: #ea492c;
        background-color: #ea492c;
      }
    }
  }
}
</style>
