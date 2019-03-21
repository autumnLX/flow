<template lang="pug">
  div.exam
    top(:competitionName="competitionName" :submit="submit")
    div(class='panel')
      div.top
        div.left
          p.topic(v-html="topic")
          p.desc(v-html="desc")
          div.content
            attention(@load="load" @success="start_the_exam" v-if="showCheck" :player="player" :recorder="recorder" :loaded="loaded")
            component(:is="currentComponent" :data="currentData")
          result(:competitionType="competitionType" v-if="submit" :submit="submit" :result="result" :passNumber="passNumber" @resubmit="resubmit" @handleRetry="handleRetry")
        div.right
          right(:student="student")
      bottom(:recorder="recorder")
    Guide(:onPassed='handlePassed' :max='3' ref='guide')
</template>
<script>
import $ from '@/utility/dollar.js'
import Config from '@/config/config.js'
import Guide from '@/components/zy/Guide'
import process1 from '../'
import functor from '../functor.js'
import Answer from '../answer.js'
import top from '../header'
import bottom from '../bottom'
import attention from './attention'
import mixins from '../mixins.js'
import result from '../result'
import right from '../right'
import tddhhd from './tddhhd.vue'
import tcdhhd from './tcdhhd.vue'
import tdwhd from './tdwhd'
import ld from './ld'
import qjwd from './qjwd'
import htjs from './htjs'

export default {
  data () {
    return {
      mode: -1,
      competitionType: '',
      player: '',
      recorder: '',
      index: -1,
      topic: '',
      desc: '',
      currentComponent: '',
      currentData: '',
      pp: '',
      showCheck: false,
      loaded: false,
      PaperInfo: '',
      answer: '',
      topicIndex: '',
      submit: '',
      result: '',
      passNumber: '',
      student: ''
    }
  },
  mixins: [mixins],
  components: { Guide, bottom, top, attention, result, right, tddhhd, tcdhhd, tdwhd, ld, qjwd, htjs },

  methods: {
    start_the_exam: async function () {
      this.showCheck = false
      const PaperInfo = this.PaperInfo

      // 获取所有音频地址
      const AllAudioUrl = functor
        .of(process1.getAllAudioUrl($.parse($.clone(true, {}, PaperInfo)), {
          3: 'all'
        }, 0))
        .map((audioUrl) => {
          // 格式化地址
          return (window.ConfigNew ? window.ConfigNew.resUrl : Config.res) + audioUrl
        })
        .getData()

      this.pp = process1.pp()
      this.pp.set('configJson', this.flow)
        .set('PaperInfo', $.parse($.clone(true, {}, PaperInfo)))
        // .change('PaperInfo', (PaperInfo) => {
        //   return PaperInfo
        // })
        .set('AllAudioUrl', AllAudioUrl)
        .set('eventbus', this.$eventbus)
        .set('player', this.player)
        .set('recorder', this.recorder)
        .set('renders', {
          // sy_thhd: (PaperInfo) => {
          //   this.currentComponent = 'sy_thhd'
          //   this.currentData = PaperInfo.data[4].topicList[0]
          //   this.topicIndex = 4
          // },
          default: (PaperInfo, component, componentId) => {
            this.currentComponent = component
            this.currentData = PaperInfo.data.filter((item, index) => {
              if (item.topicTypeId === +componentId) {
                this.topicIndex = index
                return item
              }
            })[0].topicList
          }
        })
        .addDirectiveHandle('enter', () => {
          this.currentComponent = ''
        })
        .on('topic', (topic) => {
          this.topic = topic
        })
        .on('desc', (desc) => {
          this.desc = desc
        })
        .on('recordStop', (a) => {
          // y.handleSetAudioAnswerList(a, this.topicIndex, subTopicIndex)
        })
        .addHandle('start', () => {
          return process1.startCompetition(this.cpUrl, this.groupId, this.stageId)
        })
        .addHandle('initSubmitData', () => {
          this.submit = ''
          this.answer = Answer
            .of(PaperInfo.data)
            .change(() => $.clone(true, [], PaperInfo.data))
            .change($.parse)
            .initSubmitData(Config)
        })
        .addHandle('createDirectiveList', process1.createDirectiveList)
        .addHandle('start_test', process1.start_test)
        .addHandle('submit', () => {
          this.submit = 'submitting'
          return this.answer.submit($.post, this.groupId, this.stageId, this.paperId, this.cpUrl, $.getUrlParam('competitionId'))
        })
        .addHandle('getResult', this.getResult)
        .start()
    },
    // 重新提交
    resubmit: function () {
      this.pp.start('submit')
    },
    // 再考一次
    handleRetry: function () {
      this.pp.start('start')
    }
  }
}
</script>
<style lang="less" scoped>
@import url("../style.less");
</style>


