// import $ from '@/utility/dollar.js'
// import mock from './mock.json'
class Answer {
  constructor(answer) {
    this.answer = answer || []
  }

  handleSetMyAnswer(data, topicIndex, questionIndex) {
    // 设置文本答案

    this.answer[topicIndex][questionIndex].audioAnswerList = []
    this.answer[topicIndex][questionIndex].myAnswer = data
    return Answer.of(this.answer)
  }

  handleSetAudioAnswerList(data, recParams, topicIndex, questionIndex, optionIndex = 0) {
    // 设置录音答案

    let currentQuestion = this.answer[topicIndex][questionIndex]
    currentQuestion.isAudio = true

    let aal = currentQuestion.audioAnswerList[optionIndex]

    if (data) {
      aal.coreType = recParams.coreType
      aal.attributes = data.result
      aal.recordId = data.uuid
      aal.standardAudio = this.standardAudio

      if (recParams.coreType === 'en.sent.recscore') {
        const statusCode = data.result.recscore.status_code

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
    return Answer.of(this.answer)
  }

  change(fn) {
    return Answer.of(fn(this.answer))
  }

  getData() {
    return this.answer
  }

  initSubmitData(config) {
    return Answer.of(initSubmitData(this.answer, config))
  }

  flat(arr) {
    let y = []
    for (let i = 0; i < arr.length; i++) {
      y = y.concat([...arr[i]])
    }
    return y
  }

  // 提交答案
  submit(post, groupId, stageId, paperId, cpUrl, competitionId) {
    return new Promise((resolve, reject) => {
      post('/postAssessment/post', {
        postAssessmentUrl: cpUrl + '/SubmitCompetition/submit',
        competitionId: competitionId,
        groupId,
        stageId,
        paperId,
        answerJSON: JSON.stringify(this.flat(this.answer))
      }, (res) => {
        resolve(res)
      })
      // resolve({
      //   data: {
      //     remain_times: 10
      //   },
      //   status: 1
      // })
    })
  }
}

Answer.of = function (examData) {
  return new Answer(examData)
}

function initSubmitData(examData, config) {
  const _length = examData.length
  const audioAnswerContent = {
    coreType: '',
    score: '',
    audioUrl: '',
    standardAudio: '',
    recordId: '',
    attributes: ''
  }

  function a(i) {
    let y = []
    if (i < _length) {
      let examContent = examData[i].topicList
      let topicOption = []
      for (let j = 0; j < examContent.length; j++) {
        let content = examContent[j]

        topicOption = content.topicOption

        let audioAnswerList = []

        if (Object.prototype.toString.call(topicOption) === '[object Array]') {
          for (let k = 0; k < topicOption.length; k++) {
            audioAnswerList.push(Object.assign({}, audioAnswerContent))
          }
        } else {
          audioAnswerList.push(Object.assign({}, audioAnswerContent))
        }
        console.log(content)
        y[j] = {
          topicId: content.topicID,
          topicTypeId: content.topicType,
          paperTopicScore: content.topicScore,
          standardAudio: content.topicAttachment.length > 0
            ? config.res + content.topicAttachment[0].attachmentUrl : '',
          standardAnswer: '',
          myAnswer: '',
          isAudio: false,
          audioAnswerList: audioAnswerList
        }
      }
      y = [y]
      return y.concat(a(i + 1))
    } else {
      return []
    }
  }
  return a(0)
}

export default Answer
