var request = require('request')
var fs = require('fs')
exports.load = function(uri) {
  return new Promise(function (resolve, reject) {
    if (/^http:\/\//.test(uri)) {
      request(uri, function(error, response, body) {
        if (error) {
          reject(error)
        } else {
          resolve(body)
        }
      })
    } else {
      fs.readFile(uri, 'utf-8', function (error, data) {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    }
  })
}
