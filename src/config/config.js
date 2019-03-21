export default {
  proxy: '/api', // -> ''
  proxy2: '/cp', // -> http://cp.kami.com
  model: 3, // 1仅作业，2仅测评，3作业+测评
  res: 'https://17ks.chivoxapp.com/', // 资源地址
  qid: 'PAPER-130601-QT-000101',
  cpUrl: 'https://cp.kami.com/',
  chivox: {
    appKey: '1531806588000014',
    secretKey: '7cc9d17165053e2fe4c87075638bc931',
    language: 'zh-CN',
    coreTimeout: 20 * 1000,
    sigurl: '/api/jssdksign',
    mode: 3, // 1：FLASH；2：FLASH_FIRST；3：HTML5
  }
}
