var path = require('path')
var posthtml = require('posthtml')

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

exports.prepareHTMLImport = function (HTMLImport) {
  if (!HTMLImport.source) {
    return HTMLImport
  }
  HTMLImport.parts = {
    styles: [],
    scripts: [],
    html: {}
  }
  posthtml().use(function(tree) {
    tree.walk(function (node) {
      if (node.tag === 'script') {
        HTMLImport.parts.scripts.push(node)
        return undefined
      } else if (node.tag === 'style' || (node.tag === 'link' && node.attrs.rel ==='stylesheet')) {
        HTMLImport.parts.styles.push(node)
        return undefined
      } else if (node.tag === 'template') {
        HTMLImport.parts.template = node.content
        return undefined
      }
      return node
    })
    HTMLImport.parts.template || (HTMLImport.parts.template = tree)
  }).process(HTMLImport.source, {sync: true})
  return HTMLImport

}
