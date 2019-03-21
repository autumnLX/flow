var SDKConfig = {
  appKey: '1531806588000014',
  secretKey: '7cc9d17165053e2fe4c87075638bc931',
  language: 'zh-CN',
  coreTimeout: 200000,
  sigurl: '/api/jssdksign',
  mode: chivox.MODE.HTML5, // SDK 4.0特有的参数
  // mode: chivox.MODE.FLASH,
  onFlashLoad: function (code, message) {
    console.log('onFlashLoad: ' + code);
  },
  onConnectorStatusChange: function (code, msg) {
    console.log('onConnectorStatusChange: ' + code);
  },
  onMicStatusChange: function (code, msg) {
    console.log('onMicStatusChange: ' + code);
  },
  onError: function (code, msg) {
    console.log('onError: ' + code);
  }
}
