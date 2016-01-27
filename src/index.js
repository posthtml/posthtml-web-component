var LinkImport = require('./LinkImport')
var debug = require('debug')('posthtml-web-component:index')

module.exports = function (options) {
  options = options || {}
  return function webComponent(tree, cb) {
    var LinkImports = []
    tree.walk(function (node) {
      if (node.tag === 'link' &&
          node.attrs.rel === 'import' &&
          node.attrs.href) {
        LinkImports.push(LinkImport.parse(node, {
          hostURI: options.hostURI || tree.options.path || ''
        }))
        // remove LinkImport from origin html
        return undefined
      }
      return node
    })
    debug('parse all LinkImports', LinkImports)
    Promise.all(LinkImports.map(function (linkImport) {
      return linkImport.load()
    })).then(onAllLoaded, onAllLoaded)

    function onAllLoaded() {
      debug('onAllLoaded')
      var resources = {
        styles: [],
        scripts: []
      }
      LinkImports.filter(function (linkImport) {
        return linkImport.loaded()
      }).reduce(function (resources, currentLinkImport) {
        currentLinkImport.prepare()
        resources.styles.push.apply(resources.styles, currentLinkImport.getStyles())
        resources.scripts.push.apply(resources.scripts, currentLinkImport.getScripts())
        tree.match({tag: currentLinkImport.getCustomElementTagName()}, function (node) {
          return currentLinkImport.getHTML()
        })
        return resources
      }, resources)
      debug('prepare all resources', resources, 'done')
      tree.walk(function(node) {
        if (node && node.tag === 'head') {
          node.content.push.apply(node.content, resources.styles)
        }
        if (node && node.tag === 'body') {
          node.content.push.apply(node.content, resources.scripts)
        }
        return node
      })
      cb(null, tree)
    }
  }
}
