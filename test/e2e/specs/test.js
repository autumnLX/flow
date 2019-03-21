// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'test student': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer)
      .waitForElementVisible('body', 3000)
      // .assert.elementPresent('.hello')
      .assert.containsText('span', '账号：', '通过，登录页面已打开')
      .setValue('input[type=text]', '18818818818')
      .setValue('input[type=password]', '123')
      .click('button')
      .waitForElementVisible('#app', 3000)
      .assert.containsText('#personal span', 'Kim', '通过，登录的用户名为Kim')
      .assert.elementCount('#nav li', 6, '通过，主菜单数量为6个')
      .end()
  }
}
