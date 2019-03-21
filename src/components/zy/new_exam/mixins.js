import $ from '@/utility/dollar.js'
import Config from '@/config/config.js'
import process1 from './'
export default {
  data() {
    return {
      groupId: '',
      cpUrl: '',
      competitionName: '',
      paperId: '',
      stageId: ''
    }
  },
  props: {
    flow: {
      default () {
        return {}
      }
    }
  },
  methods: {
    start_check: async function () {
      const student = await process1.getSessionName()
      this.showGuide = true
      this.student = student.data
      const data = await process1.getCompetitionInfo($.getUrlParam('competitionId'))
      this.mode = Number(data.show_time_flag)
      this.competitionName = data.competitionName
      this.competitionType = data.competition_type
    },
    load: async function () {
      // 加载试题
      this.PaperInfo = await process1.getPaperInfo({
        competitionId: $.getUrlParam('competitionId'),
        groupId: $.getUrlParam('groupId'),
        stageId: $.getUrlParam('stageId'),
        paperId: $.getUrlParam('paperId')
      })
      this.paperId = this.PaperInfo.data[0].paperId
      this.loaded = true
    },
    handlePassed(aiPanel, player, recorder) {
      this.player = player
      this.recorder = recorder
      this.showCheck = true
      this.test()
    },
    getResult(a, res) {
      if (res.status === 1) {
        /**
         * show_time_flag =  3 实时显示分数
         * show_time_flag = -1 为自学（by 陈维），自学也应该是实时显示成绩 for bug#14507
         */
        if (this.mode === 3 || this.mode === -1) {
          const resData = res.data || {}
          this.submit = 'result'
          this.result = {
            score: resData.total_score || 0,
            rank: resData.current_ranking || 1,
            highest: resData.highest_score || 0,
            remain: resData.remain_times || 0,
            report: (window.ReportMapping && window.ReportMapping.getReportUrl('rt', this.stageId, this.groupId, this.paperId)) || '#'
          }
        } else {
          this.submit = 'submitted'
        }
      } else {
        this.submit = 'fail'
      }
    },
    test: async function () {
      if ($.getUrlParam('isSkip')) {
        this.showCheck = false
        await this.load()
        await this.start_the_exam()
      }
    }
  },
  created() {
    this.cpUrl = window.ConfigNew ? window.ConfigNew.jdcpIP : Config.cpUrl
    this.groupId = $.getUrlParam('groupId')
    this.stageId = $.getUrlParam('stageId')
    this.$eventbus.$on('SetRec', (a, questionIndex = 0, optionIndex = 0) => {
      const recParams = $.getServerParams(a)
      console.log(recParams)
      this.pp.set('recParams', recParams)
      this.$eventbus.$once('recordStop', (res) => {
        this.answer.handleSetAudioAnswerList(res, recParams, this.topicIndex, questionIndex, optionIndex)
      })
    })
    this.$eventbus.$on('setAnswer', (data, questionIndex) => {
      this.answer.handleSetMyAnswer(data, this.topicIndex, questionIndex)
    })
    this.start_check()
      .catch((error) => {
        this.$alert(error.info)
      })
  }
}
