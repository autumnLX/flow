import $ from '@/utility/dollar.js'

function getSessionName() {
  return new Promise((resolve, reject) => {
    $.post('/students/getSessionName', {}, res => {
      if (res.status !== 1) {
        reject(res)
      } else {
        resolve(res)
      }
    })
  })
}
// 开始考试接口
function startCompetition(cpUrl, groupId, stageId) {
  return new Promise((resolve, reject) => {
    $.post(
      '/postAssessment/post', {
        postAssessmentUrl: cpUrl + '/SubmitCompetition/startCompetition',
        groupId: groupId,
        stageId: stageId
      },
      res => {
        if (res.status === 1) {
          resolve(1)
        } else {
          alert(res.info)
        }
      }
    )
  })
}
// 获取数据
function getCompetitionInfo(competitionId) {
  return new Promise((resolve, reject) => {
    $.jsonp(
      '/MEnglishCompetition/getCompetitionInfo', {
        competitionId
      },
      res => {
        const data = res.data
        const endDate = data.competitionRange ? data.competitionRange[data.stageFlag - 1].endDate : '2088-1-1'
        let competitionEndFlag = new Date() > new Date(endDate)
        if (
          competitionEndFlag ||
          data.isDelete === '1' ||
          data.status === '1'
        ) {
          reject(new Error('该阶段已过期'))
        } else {
          resolve(data)
        }
      }
    )
  })
}
// 渲染
function render(Vue, parentElementID, component, option) {
  const constructor = Vue.extend(component)
  const a = new constructor({
    el: document.createElement('div'),
    ...option
  })
  document.getElementById(parentElementID).appendChild(a.$el)
  return a
}
// 配置渲染函数
function getRender(Vue, parentElementID, component, option) {
  return render.bind(
    Object.create(null),
    Vue,
    parentElementID,
    component,
    option
  )
}
// 移除组件及其相关联系
function remove(vueNode) {
  if (!vueNode) return
  vueNode.$destroy()
  vueNode.$el.parentElement.removeChild(vueNode.$el)
}
// 下载音频
function audio_load(player, audioUrl) {
  return new Promise((resolve, reject) => {
    player.load({
      url: audioUrl,
      success: () => {
        resolve(player)
      }
    })
  })
}
// 播放
function play(player, startHandle = () => {}, stopHandle = () => {}) {
  return new Promise((resolve, reject) => {
    player.play({
      onStart: startHandle,
      onStop: () => {
        stopHandle()
        resolve(true)
      }
    })
  })
}

async function doPlay(config) {
  const {
    player,
    audio,
    eventbus
  } = config
  await audio_load(player, audio)
  await play(
    player,
    () => {
      eventbus.$emit('playStart')
    },
    () => {
      eventbus.$emit('playStop')
    }
  )
  return Promise.resolve(true)
}

function getPaperInfo(params) {
  // 加载试题
  return new Promise((resolve, reject) => {
    $.jsonp('/WebCompetition/getPaperInfo', params, res => {
      if (res.status === 1) {
        if (res.data.length > 0) {
          resolve(res)
        } else {
          reject(new Error('作业内容为空'))
        }
      } else {
        reject(new Error('哎呀，网络又调皮了！'))
      }
    })
  })
}
// 创建等待命令
export function createWait(arg) {
  return new Promise((resolve, reject) => {
    arg.eventbus.$emit('countdown', arg.duration, 'num')
    setTimeout(() => {
      resolve(1)
    }, arg.duration)
  })
}

// 创建录音指令
export function createRecord(arg) {
  return new Promise((resolve, reject) => {
    let lastRecordId
    arg.recorder.record({
      duration: arg.duration,
      serverParams: arg.recParams,
      onRecordIdGenerated: (code, message) => {
        lastRecordId = message.recordId
      },
      onStart: () => {
        arg.eventbus.$emit('recordStart', arg.duration)
      },
      onStop: () => {
        arg.recorder.getScores({
          recordId: lastRecordId,
          success: data => {
            const res = data[lastRecordId]
            if (res.errId || res.result.errID) {
              arg.eventbus.$emit('recordStop', null)
            } else {
              arg.eventbus.$emit('recordStop', res)
            }
            resolve()
          }
        })
      }
    })
  })
}

// 获取接口数据中所有的音频路径
export function getAllAudioUrl(data, ignoreIds = {}, srartPartyIndex = 0) {
  // return JSON.stringify(data)
  //   .match(/["|\\\\/|\d|\w|.]*,\\"attachmentType\\":1/g)
  //   .map(url =>
  //     url.replace(/\\",\\"attachmentType\\":1/, '').replace(/["|\\]*/g, '')
  //   )
  let list = []
  data.data.forEach((i, partyIndex) => {
    const ignoreType = ignoreIds[partyIndex]
    if (partyIndex >= srartPartyIndex && ignoreType !== 'all') {
      i.topicList.forEach(i => {
        if (ignoreType !== 'topicAttachment' && i.topicAttachment && i.topicAttachment[0] && i.topicAttachment[0].attachmentType === 1) {
          list.push(i.topicAttachment[0].attachmentUrl)
        }
        if (i.topicOption && ignoreType !== 'attachmentType') {
          i.topicOption.forEach(item => {
            const y = item.attachment && item.attachment[0].attachmentType === 1 && item.attachment[0].attachmentUrl
            y && list.push(y)
          })
        }
      })
    }
  })
  console.log(list)
  return list
}

function getCreateAudioUrlListFn(AudioUrls) {
  return function* () {
    for (let i = 0; i < AudioUrls.length; i++) {
      yield AudioUrls[i]
    }
  }
}
// enter指令
function enter() {
  let index = -1
  return function (arg) {
    arg.eventbus.$emit('topicIndex', ++index)
  }
}
// 创建指令列表
export function createDirectiveArray(AllAudioUrl) {
  return function create(flow, _loop = 1, loop = 1, total = []) {
    if (loop > _loop) {
      return total
    }
    let audio
    flow &&
      flow.forEach(item => {
        if (item.flow) {
          total = create(item.flow, item.loop, 1, total)
        } else {
          let _item = JSON.parse(
            JSON.stringify(item).replace(/\$\{[^}]*\}/g, str => {
              return eval('`' + str + '`')
            })
          )
          // 在一次loop中限制只取一个audiourl, _item.next 代表强制取下一个音频
          _item.directive === 'play' &&
            !_item.audio &&
            (_item.audio = audio = (!_item.next && audio) || AllAudioUrl.next().value)
          // 如果发现跳过就不添加
          total = _item.skip === 'true' ? total : total.concat(_item)
        }
      })
    return create(flow, _loop, loop + 1, total)
  }
}

export function implementDirctive(
  DirectiveArray,
  ProcessArguments,
  recordCall = () => {}
) {
  return async function () {
    let item
    // 记录当前渲染的组件
    // let current_render_component
    for (let i in DirectiveArray) {
      item = DirectiveArray[i]
      item.topic && ProcessArguments.eventbus.$emit('topic', item.topic)
      item.desc && ProcessArguments.eventbus.$emit('desc', item.desc)
      item.tip !== undefined && ProcessArguments.eventbus.$emit('tip', item.tip)
      // 循序获取指令对应的处理函数
      for (let index in ProcessArguments.directives[item.directive]) {
        await ProcessArguments.directives[item.directive][index]({
          ...item,
          ...ProcessArguments
        })
      }
    }
  }
}

async function start_test(arg, directiveArray) {
  await implementDirctive(directiveArray, arg)()
}

function createDirectiveList(arg) {
  return createDirectiveArray(getCreateAudioUrlListFn(arg.AllAudioUrl)())(
    arg.configJson
  )
}

const symbol_handle = Symbol('handle')

class Process {
  constructor(ProcessArguments) {
    ProcessArguments &&
      $.clone(
        true,
        this,
        ProcessArguments
      )
  }
  addDirectiveHandle(directive, handle) {
    this.directives[directive] = this.directives[directive] || []
    this.directives[directive].push(handle)
    return this
  }

  removeDirectiveHandle(directive, handle) {
    const list = this.directives[directive]
    if (handle) {
      this.directives[directive] = list.filter(_handle => _handle !== handle)
    } else {
      this.directives[directive] = []
    }
    return this
  }

  async start(name) {
    const handles = this[symbol_handle]
    let params
    let flag = false
    if (name === undefined) {
      flag = true
    }
    for (let i in handles) {
      if (flag || handles[i].name === name) {
        flag = true
        params = await handles[i].handle(this, params)
      }
    }
    return this
  }

  map(key, fn) {
    if (this[key] instanceof Array) {
      return this.of(key, this[key].map(fn))
    } else {
      return this.of(key, fn(this[key]))
    }
  }

  set(key, value) {
    return this.of(key, value)
  }

  change(key, fn) {
    return this.of(key, fn(this[key]))
  }

  on(key, handel) {
    this.eventbus.$on(key, handel)
    return this
  }

  addHandle(name, handle) {
    this[symbol_handle] = this[symbol_handle] || []
    this[symbol_handle].push({
      name,
      handle
    })
    return this
  }

  clearHandle() {
    this[symbol_handle] = []
    return this
  }

  static of (ProcessArguments) {
    return new Process(ProcessArguments)
  };

  of (key, value) {
    this[key] = value
    return this
  }
}

const pp = function () {
  const process = Process.of({
    directives: {}
  })
  return process
    .addDirectiveHandle('play', doPlay)
    .addDirectiveHandle('wait', createWait)
    .addDirectiveHandle('emitEvent', function (arg) {
      arg.eventbus.$emit(arg.name, arg.message)
    })
    .addDirectiveHandle('record', createRecord)
    .addDirectiveHandle('enter', enter())
    .addDirectiveHandle('render', arg => {
      ;
      (arg.renders[arg.component] || arg.renders.default)(
        arg.PaperInfo,
        arg.component,
        arg.id
      )
    })
}

export default {
  pp,
  Process,
  getSessionName,
  start_test,
  getCompetitionInfo,
  getPaperInfo,
  doPlay,
  render,
  getRender,
  remove,
  createWait,
  getAllAudioUrl,
  createDirectiveArray,
  implementDirctive,
  getCreateAudioUrlListFn,
  startCompetition,
  createDirectiveList
}
