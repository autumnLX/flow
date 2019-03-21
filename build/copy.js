const arv = process.argv.slice(2)[0]
const fs = require('fs')
const path = require('path')
const rm = require('rimraf')
const config = require('./copy.config')

// 默认情况下，destination.txt 将创建或覆盖
const rooturl = './dist'
const tar = config[arv]

function copy(src, target) {
  fs.copyFile(src, target, err => {
    if (err) throw err
  })
}
function getStatCall(srcroot, targetroot) {
  return function(err, stats) {
    if (err) return
    if (stats.isFile()) {
      copy(srcroot, targetroot)
    } else {
      fs.mkdir(targetroot, err => {
        read(srcroot, targetroot)
      })
    }
  }
}

function read(srcroot, targetroot) {
  fs.readdir(srcroot, { withFileTypes: true }, (err, files) => {
    files.forEach(item => {
      stat(srcroot, targetroot, item)
    })
  })
}

function stat(srcroot, targetroot, item) {
  fs.stat(
    path.join(srcroot, item),
    getStatCall(path.join(srcroot, item), path.join(targetroot, item))
  )
}

function init() {
  if(tar){
    rm(path.join(tar, 'web/static'), err => {
      if (err) throw err
    
      stat(rooturl, tar, '')
    })
  }
}

init()
