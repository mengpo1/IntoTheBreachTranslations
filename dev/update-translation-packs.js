'use strict'

const fs = require('fs')
const shared = require(__dirname + '/shared')
const iconv = require('iconv-lite')
const zip = require('node-zip')
const md5 = require('md5')

let gameFiles = {}
let filesChanged = {}

function loadGameFileSrc (file) {
  if (typeof gameFiles[file] === 'undefined') {
    gameFiles[file] = fs.readFileSync(shared.config.gamesrc + '/' + file).toString()
  }
  return gameFiles[file]
}

const langDir = __dirname + '/../languages'
const templateFileData = JSON.parse(fs.readFileSync(langDir + '/template.json').toString())
const languageFiles = fs.readdirSync(langDir)
const luaFiles = shared.getLuaFiles(shared.config.gamesrc)

languageFiles.forEach(function (file) {
  const fileSplit = file.split('.')
  if (fileSplit[1] !== 'json' || file === 'template.json') {
    return
  }
  gameFiles = {}
  filesChanged = {}
  const language = fileSplit[0]
  if (language !== 'de') {
    return
  }
  const languageFileData = JSON.parse(fs.readFileSync(langDir + '/' + file).toString())
  for (let id in languageFileData) {
    const languageData = languageFileData[id]
    const templateData = templateFileData[id]
    if (!templateData) continue
    // convert specific files
    if (templateData.files) {
      templateData.files.forEach(function (file) {
        let search = templateData.text.replace(/\n/g, '\\n').replace(/"/g, '\\"')
        gameFiles[file] = loadGameFileSrc(file).replace(new RegExp('"' + shared.escapeRegex(search) + '"', 'g'), `"${languageData.text}"`)
        filesChanged[file] = true
      })
    }
  }
  // go through all files via contexts
  luaFiles.forEach(function (fileAbsolute) {
    const file = fileAbsolute.substr(shared.config.gamesrc.length + 1)
    let fileData = loadGameFileSrc(file)
    for (let id in languageFileData) {
      const templateData = templateFileData[id]
      if (!templateData.contexts) continue
      const languageData = languageFileData[id]
      templateData.contexts.forEach(function (context) {
        let regexFull = context.regex.replace(/%s/, shared.escapeRegex(templateData.text))
        let regexText = templateData.text
        let replaceText = languageData.text
        if (context.replace) {
          context.replace.forEach(function (str, i) {
            regexFull = regexFull.replace(new RegExp('%%' + i), '(' + str + ')')
            regexText = regexFull.replace(new RegExp('%%' + i), '(' + str + ')')
            replaceText = regexFull.replace(new RegExp('%%' + i), '(' + str + ')')
          })
        }
        regexFull = new RegExp(regexFull, 'g')
        let match = null
        do {
          match = regexFull.exec(fileData)
          if (match) {
            match[0] = match[0].replace(regexText, replaceText)
          }
        }
        while (match)
        filesChanged[file] = true
      })
    }
    if (typeof filesChanged[file] !== 'undefined') {
      gameFiles[file] = fileData
    }
  })
  // create new game files
  const zipArchive = new zip()
  for (let file in gameFiles) {
    let fileData = gameFiles[file]
    fileData = iconv.encode(new Buffer(fileData), 'latin1')
    zipArchive.file(file, fileData)
    // also save into gamedir if set
    if (shared.config.langInGameDir && shared.config.langInGameDir === language) {
      fs.writeFileSync(shared.config.gamedir + '/' + file, fileData)
    }
  }

})