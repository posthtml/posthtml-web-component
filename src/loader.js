var request = require('request')
var fs = require('fs')
exports.load = function(uri, callback) {
  if (/^http:\/\//.test(uri)) {
    request(uri, function(error, response, body) {
      callback(error, body)
    })
  } else {
    fs.readFile(uri, 'utf-8', callback)
  }
}
