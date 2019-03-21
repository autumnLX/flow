module.exports = function (source) {
  if (/\/\/\smock:start[^/]+\/\/\smock:end/.test(source)) {
    source = source.replace(/\/\/\smock:start([^/]+)\/\/\smock:end/g, '')
  }

  return source
}
