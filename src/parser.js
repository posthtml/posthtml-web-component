var path = require('path')

exports.parseHTMLImport = function (node, options) {
  if (!(options && options.uri)) {
    throw new Error('The base uri is need in options')
  }
  var HTMLImport = {}
  HTMLImport.originURI = node.attrs.href
  if (/^(http|https):\/\//.test(HTMLImport.originURI)) {
    HTMLImport.uri = HTMLImport.originURI
  } else {
    HTMLImport.uri = path.resolve(path.dirname(options.uri), HTMLImport.originURI)
  }
  var file = path.parse(HTMLImport.uri)
  HTMLImport.name = file.name
  return HTMLImport
}
