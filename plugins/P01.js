function P01(options) {
  this.options = options
}

P01.prototype.apply = function (compiler) {
  compiler.plugin('emit', function (compilation, callback) {
    console.log('This is emit hook.')
    callback()
  })
}

module.exports = P01
