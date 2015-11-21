var parser = require('./parser')
var loader = require('./loader')

module.exports = function (options) {
  return function webComponent(tree, cb) {
    debugger
    var HTMLImports = []
    tree.walk(function (node) {
      if (node.tag === 'link' &&
          node.attrs.rel === 'import' &&
          node.attrs.href) {
        HTMLImports.push(parser.parseHTMLImport(node, options))
        return undefined
      }
      return node
    })
    Promise.all(HTMLImports.map(function (HTMLImport) {
      return loader.load(HTMLImport.uri).then(function (data) {
        HTMLImport.source = data
        return Promise.resolve(data)
      }, function (error) {
        return Promise.resolve(error)
      })
    })).then(function () {
      HTMLImports.forEach(parser.prepareHTMLImport)
      var styles = []
      var scripts = []
      HTMLImports.forEach(function (HTMLImport) {
        if (HTMLImport.source) {
          styles = styles.concat(HTMLImport.parts.styles)
          scripts = scripts.concat(HTMLImport.parts.scripts)
          tree.match({tag: HTMLImport.name}, function (node) {
            return HTMLImport.parts.template
          })
        }
      })
      tree.match({tag: 'head'}, function (node) {
        node.content = node.content.concat(styles)
        return node
      })
      tree.match({tag: 'body'}, function(node) {
        node.content = node.content.concat(scripts)
        return node
      })
      debugger
      cb(null, tree)
    })
  }
}
