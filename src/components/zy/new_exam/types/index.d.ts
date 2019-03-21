import { type } from 'os'

interface getCompetitionInfo {
  competitionId: string | number
}

interface getPaperInfo {
  competitionId: string | number
  groupId: string | number
  stageId: string | number
  paperId: string | number
}

interface doPlayParams {
  player: any
  audioUrl: string
  startHandle?: function
  stopHandle?: function
}

interface createLoopConfig extends doPlayParams {
  directive: string
}

function render(Vue: vue, parentElementID: string, component, option): any
function getRender(Vue: vue, parentElementID: string, component, option): any
function getSessionName(any): promise
function getCompetitionInfo(getCompetitionInfo): promise
function getPaperInfo(getPaperInfo): any
function doPlay(
  player: any,
  audioUrl: string,
  startHandle: function,
  stopHandle: function
): any
function remove(vueNode): any
function createWait(time: number): promise
function createLoop(
  configList: Array<createLoopConfig>,
  loop: number,
  changeTipHandle: function,
  changeIndexHandle: function
)
export function getAllAudioUrl(data: string)
export function getCreateAudioUrlListFn(AudioUrlList: string[])
export function implementDirctive(any)

export default {
  render,
  getRender,
  getSessionName,
  getCompetitionInfo,
  getPaperInfo,
  doPlay,
  remove,
  createLoop,
  createWait,
  getAllAudioUrl,
  getCreateAudioUrlListFn,
  implementDirctive
}
