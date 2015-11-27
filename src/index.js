var LinkImport = require('./LinkImport')

module.exports = function (options) {
  return function webComponent(tree, cb) {
    var LinkImports = []
    tree.walk(function (node) {
      if (node.tag === 'link' &&
          node.attrs.rel === 'import' &&
          node.attrs.href) {
        LinkImports.push(LinkImport.parse(node, options))
        // remove LinkImport from origin html
        return undefined
      }
      return node
    })

    Promise.all(LinkImports.map(function (linkImport) {
      return linkImport.load()
    })).then(onAllLoaded, onAllLoaded)

    function onAllLoaded() {
      var resoures = {
        styles: [],
        scripts: []
      }
      LinkImports.filter(function (linkImport) {
        return linkImport.loaded()
      }).reduce(function (resoures, currentLinkImport) {
        currentLinkImport.prepare()
        resoures.styles.push.apply(resoures.styles, currentLinkImport.getStyles())
        resoures.scripts.push.apply(resoures.scripts, currentLinkImport.getScripts())
        tree.match({tag: currentLinkImport.getCustomElementTagName()}, function (node) {
          return currentLinkImport.getHTML()
        })
      }, resoures)
      tree.walk(function(node) {
        if (node && node.tag === 'head') {
          node.content.push.apply(node.content, resoures.styles)
        }
        if (node && node.tag === 'body') {
          node.content.push.apply(node.content, resoures.scripts)
        }
        return node
      })
      cb(null, tree)
    }
  }
}
