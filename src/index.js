var parser = require('./parser')
var loader = require('./loader')

module.exports = function (options) {
  return function webComponent(tree, cb) {
    var HTMLImports = []
    tree.walk(function (node) {
      if (node.tag === 'link' &&
          node.attrs.rel === 'import' &&
          node.attrs.href) {
        var HTMLImport =
        HTMLImports.push(parser.parseHTMLImport(node, options))
      }
    })
    cb(null, tree)
  }
}
