var posthtml = require('posthtml')
var fs = require('fs')
var path = require('path')
var expect = require('chai').expect

var LinkImport = require('../src/LinkImport')

function fixture(filePath) {
  return fs.readFileSync(path.join(__dirname, filePath), 'utf-8')
}

var indexHTML = fixture('fixtures/index.html')

describe('LinkImport', function () {
  describe('.parse', function () {
    it('should parse LinkImport info from an relative link node', function () {
      var node = {
        tag: 'link',
        attrs: {
          rel: 'import',
          href: 'hello-world.html'
        }
      }
      var linkImport = LinkImport.parse(node, {
        hostURI: path.join(__dirname, './fixtures/index.html')
      })

      expect({
        customElementTagName: linkImport.getCustomElementTagName(),
        originURI: linkImport.originURI,
        uri: linkImport.uri
      }).to.eql({
        customElementTagName: 'hello-world',
        originURI: 'hello-world.html',
        uri: path.join(__dirname, './fixtures/hello-world.html')
      })

    })
    it('should parse LinkImport info from remote link node', function () {
      var node = {
        tag: 'link',
        attrs: {
          rel: 'import',
          href: 'https://google.com/hello-world.html'
        }
      }
      var linkImport = LinkImport.parse(node, {
        hostURI: path.join(__dirname, './fixtures/index.html')
      })

      expect({
        customElementTagName: linkImport.getCustomElementTagName(),
        originURI: linkImport.originURI,
        uri: linkImport.uri
      }).to.eql({
        customElementTagName: 'hello-world',
        originURI: 'https://google.com/hello-world.html',
        uri: 'https://google.com/hello-world.html'
      })
    })
  })
  describe('.prototype.load', function () {
    it('should load file from file system', function (done) {
      var linkImport = new LinkImport('', path.join(__dirname, './fixtures/index.html'), '')
      linkImport.load()
        .then(function () {
          expect(linkImport.source).to.eql(indexHTML)
        }).then(done, done)
    })

    it('should load file from remote server', function(done) {
      var linkImport = new LinkImport('', 'http://island205.com/ReactUnitTesting/Caculator/', '')
      linkImport.load()
        .then(function () {
          expect(linkImport.source).to.eql(fixture('fixtures/Caculator.html'))
        }).then(done, done)
    })
  })

  describe('.prototype.prepare', function () {

    it('should seperate LinkImport source into style script and html parts', function () {
      var linkImport = new LinkImport()
      linkImport.source = fixture('fixtures/hello-world.html')
      linkImport.prepare()
      expect(linkImport.getScripts().length).to.eql(1)
      expect(linkImport.getStyles().length).to.eql(1)
      expect(linkImport.getHTML()).to.not.be.undefined
    })
  })
})
