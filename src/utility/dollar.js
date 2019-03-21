import config from '@/config/config.js'

/**
 * 扁平化数组，数组里面可以无限嵌套数组，但不可嵌套对象
 * @param {String} key
 * @param {Array} array
 */
const flattenArray = (key, array) => {
  let str = ''

  array.forEach((o, i) => {
    let k = `${key}[${i}]`
    if (typeof o === 'string' || typeof o === 'number') {
      str += `&${k}=${o}`
    } else if (o instanceof Array) {
      str += '&' + flattenArray(k, o)
    } else {
      // 对象和方法都自动忽略
    }
  })

  return str.substring(1)
}

/**
 * 序列化对象，对象可嵌套数组，不可嵌套对象
 * @param {Object} data
 */
const normalize = (data) => {
  let queryString = ''

  if (typeof data === 'object') {
    for (let key in data) {
      if (typeof data[key] === 'string' || typeof data[key] === 'number') {
        queryString += `&${key}=${data[key]}`
      } else if (data[key] instanceof Array) {
        queryString += '&' + flattenArray(key, data[key])
      } else {
        // 对象和方法自动忽�
      }
    }
  }

  return queryString.substring(1)
}

const createRequest = (callback) => {
  let request = new XMLHttpRequest()

  request.onreadystatechange = () => {
    if (request.readyState === XMLHttpRequest.DONE) {
      if (request.status === 200) {
        try {
          let response = JSON.parse(request.responseText)
          callback(response)
        } catch (e) {
          if (window.ConfigNew) {
            alert(e)
          } else {
            const res = {
              status: 1
            }
            callback(res)
          }
        }
      }
    }
  }

  return request
}

const handleRefText = (text) => {
  text = text.replace(/\u2014/g, '-').replace(/([^0-9A-Za-z-,.;:?!"'()[\]{}<>@\s]|\n)/g, ' ').replace(/<[^>]*>/g, ' ')
  return text.replace(/\s+/g, ' ')
}

const getUrlParam = (name, method) => {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) {
    if (method === 'decodeURIComponent') {
      return decodeURIComponent(r[2])
    } else if (method === 'decodeURI') {
      return decodeURI(r[2])
    } else {
      return unescape(r[2])
    }
  } else {
    return null
  }
}

function getType(obj) {
  // tostring会返回对应不同的标签的构造函数
  const toString = Object.prototype.toString;
  if (obj instanceof Element) {
    return 'element';
  }
  return toString.call(obj).match(/\w+(?=])/g)[0].toLowerCase();
}

function clone(isDeep = false, target, ...source) {
  function a(target, source) {
    if (isDeep) {
      for (let i in source) {
        const type = getType(source[i])
        if (type === 'array') {
          target[i] = a(target[i] || [], source[i])
        } else if (type === 'object') {
          target[i] = a(target[i] || {}, source[i])
        } else {
          target[i] = source[i]
        }
      }
    } else {
      for (let i in source) {
        target[i] = source[i]
      }
    }
    return target
  }
  let i = source.length - 1
  for (; i >= 0; i--) {
    a(target, source[i])
  }
  return target
}

// 将对象里的json字符串变为对象
function parse(source) {
  for (let i in source) {
    const type = getType(source[i])
    if (type === 'array' || type === 'object') {
      source[i] = parse(source[i])
    } else if (type === 'string') {
      try {
        source[i] = JSON.parse(source[i])
      } catch (e) {}
    }
  }
  return source
}

export default {
  getUrlParam,
  get(url, data, callback) {
    let request = createRequest(callback)
    let _url = config.proxy + url

    request.open('GET', _url + '?' + normalize(data))
    request.setRequestHeader('Accept', 'application/json')
    request.send()
  },
  jsonp(url, data, callback) {
    if (window.ConfigNew && window.ConfigNew.jdcpIP) {
      const _url = window.ConfigNew.jdcpIP + config.proxy + url
      window.$.ajax({
        method: 'GET',
        url: _url,
        dataType: 'jsonp',
        data: data,
        jsonp: 'callback',
        success: (data) => {
          callback(data)
        }
      })
    } else {
      let request = createRequest(callback)

      request.open('GET', config.proxy2 + url + '?' + normalize(data))
      request.setRequestHeader('Accept', 'application/json')
      request.send()
    }
  },
  post(url, data, callback, type = 'form') {
    let request = createRequest(callback)
    let _url = config.proxy + url

    request.open('POST', _url)

    if (type === 'form') {
      request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8')
      request.send(normalize(data))
    } else if (type === 'json') {
      request.setRequestHeader('Content-Type', 'application/json; charset=utf-8')
      request.send(JSON.stringify(data))
    } else {
      request.send(data)
    }
  },
  mock(url, data, callback) {
    let request

    url = '/mock' + url

    if (arguments.length === 3) {
      request = createRequest(callback)
      url = url + '?' + normalize(data)
    } else {
      request = createRequest(arguments[1])
    }

    request.open('GET', url)
    request.setRequestHeader('Accept', 'application/json')
    request.send()
  },
  now() {
    return (new Date()).toISOString().replace('T', ' ').replace(/\s(\d\d):/, (str, $1) => {
      return ' ' + (parseInt($1) + 8) + ':'
    }).split('.')[0]
  },
  getServerParams(params) {
    /**
     * 根据参数获取对应的评分配�
     * params
     *   type - hitalk | comm（模仿朗读）| oesy（口头作文） | auto（单词，句子，段落）
     *   refText - 送评文本
     *   standardAudio - 模仿朗读才有
     *   keyWords - 关键词，用于开放题�
     */
    let userId = ''
    let refText = params.refText

    // if (/;\sid=\d+;/.test(document.cookie)) {
    //   userId = document.cookie.match(/;\sid=(\d+);/)[1]
    // }
    userId = getUrlParam('user')

    if (typeof refText === 'string') {
      refText = handleRefText(refText)
    } else if (typeof refText === 'object') {
      if (typeof refText.lm === 'string') {
        refText.lm = handleRefText(refText.lm)
      } else if (typeof refText.lm === 'object') {
        refText.lm.forEach(item => {
          item.text = handleRefText(item.text)
        })
      }
    }

    let defaultServerParams = {
      userId: userId,
      rank: 100,
      precision: 0.5,
      attachAudioUrl: 1,
      refText: refText
    }

    let serverParams = {}
    let refTextLength = refText instanceof Array ? 1 : refText.split(' ').length

    if (refTextLength === 0) {
      alert('错误：送评文本为空')
    } else if (params.type === 'auto') {
      if (refTextLength === 1) {
        serverParams = Object.assign({}, defaultServerParams, {
          coreType: 'en.word.child'
        })
      } else if (refTextLength <= 15) {
        serverParams = Object.assign({}, defaultServerParams, {
          coreType: 'en.sent.child',
        })
      } else {
        serverParams = Object.assign({}, defaultServerParams, {
          coreType: 'en.pred.exam',
          refText: {
            lm: refText,
            qid: config.qid
          },
          client_params: {
            ext_subitem_rank4: 0,
            ext_word_details: 1,
            ext_phn_details: 1,
            ext_cur_snt: 1
          }
        })
      }
    } else if (params.type === 'word') {
      serverParams = Object.assign({}, defaultServerParams, {
        coreType: 'en.word.child'
      })
    } else if (params.type === 'sent') {
      serverParams = Object.assign({}, defaultServerParams, {
        coreType: 'en.sent.child',
      })
    } else if (params.type === 'pred') {
      serverParams = Object.assign({}, defaultServerParams, {
        coreType: 'en.pred.exam',
        refText: {
          lm: refText,
          qid: config.qid
        },
        client_params: {
          ext_subitem_rank4: 0,
          ext_word_details: 1,
          ext_phn_details: 1,
          ext_cur_snt: 1
        }
      })
    } else if (params.type === 'hitalk') {
      serverParams = Object.assign({}, defaultServerParams, {
        coreType: 'en.sent.recscore',
        keyWords: params.keyWords,
        result: {
          use_details: 1
        }
      })
    } else if (params.type === 'oesy') {
      serverParams = Object.assign({}, defaultServerParams, {
        coreType: 'en.oesy.exam',
        refText: {
          lm: refText,
          qid: config.qid
        },
        client_params: {
          ext_rec: 1,
          ext_rec_score: 1
        }
      })
    } else if (params.type === 'comm') {
      serverParams = Object.assign({}, defaultServerParams, {
        coreType: 'en.comm.cont',
        standard: {
          type: 'mp3',
          url: params.standardAudio
        },
        result: {
          use_wrd_list: 1,
          use_dim_score: 1
        }
      })
    } else if (params.type === 'scne') {
      serverParams = Object.assign({}, defaultServerParams, {
        coreType: 'en.scne.exam',
        refText: {
          qid: config.qid,
          role: 'b',
          lm: refText,
        }
      })
    } else if (params.type === 'prtl') {
      serverParams = Object.assign({}, defaultServerParams, {
        coreType: 'en.prtl.exam',
        refText: {
          qid: config.qid,
          lm: [{
            text: refText,
            answer: 1,
          }],
        }
      })
    } else {
      alert(`不能识别的送评内核[${params.type}]`)
    }

    return serverParams
  },
  initSubmitData(examData) {
    let submitData = []
    const transKey = ['topicInstruction', 'topicAttachment', 'topicOption']
    const audioAnswerContent = {
      coreType: '',
      score: '',
      audioUrl: '',
      standardAudio: '',
      recordId: '',
      attributes: ''
    }

    for (let i = 0; i < examData.length; i++) {
      submitData[i] = []
      let examContent = examData[i].topicList
      let topicOption = []
      for (let j = 0; j < examContent.length; j++) {
        let content = examContent.concat([])[j]
        if (typeof content.topicOption === 'string' && content.topicOption !== '') {
          topicOption = JSON.parse(content.topicOption)
        } else {
          topicOption = content.topicOption
        }
        let audioAnswerList = []

        for (let k = 0; k < transKey.length; k++) {
          if (content[transKey[k]] && typeof content[transKey[k]] === 'string') {
            content[transKey[k]] = JSON.parse(content[transKey[k]])
          }
        }

        if (Object.prototype.toString.call(topicOption) === '[object Array]') {
          for (let k = 0; k < topicOption.length; k++) {
            audioAnswerList.push(Object.assign({}, audioAnswerContent))
          }
        } else {
          audioAnswerList = [Object.assign({}, audioAnswerContent)]
        }

        submitData[i][j] = {
          topicId: content.topicID,
          topicTypeId: content.topicType,
          paperTopicScore: content.topicScore,
          standardAudio: content.topicAttachment.length > 0 ? config.res + content.topicAttachment[0].attachmentUrl : '',
          standardAnswer: '',
          myAnswer: '',
          isAudio: false,
          audioAnswerList: audioAnswerList.concat([])
        }
      }
    }

    return submitData
  },
  getType,
  clone,
  parse
}
