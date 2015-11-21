var posthtml = require('posthtml')
var fs = require('fs')
var path = require('path')
var expect = require('chai').expect

var parser = require('../src/parser')
var loader = require('../src/loader')

function fixture(filePath) {
  return fs.readFileSync(path.join(__dirname, filePath), 'utf-8')
}

var indexHTML = fixture('fixtures/index.html')

describe('loader', function () {
  it('should load file from file system', function (done) {
    loader.load(path.join(__dirname, './fixtures/index.html'))
      .then(function (data) {
        expect(data).to.eql(indexHTML)
      }).then(done, done)
  })

  it('should load file from remote server', function(done) {
    loader.load('http://island205.com/ReactUnitTesting/Caculator/')
      .then(function (data) {
        expect(data).to.eql(fixture('fixtures/Caculator.html'))
      }).then(done, done)
  })
})

describe('parser', function () {
  it('should parse HTMLImport info from an relative link node', function () {
    var node = {
      tag: 'link',
      attrs: {
        rel: 'import',
        href: 'hello-world.html'
      }
    }
    expect(parser.parseHTMLImport(node, {
      uri: path.join(__dirname, './fixtures/index.html')
    })).to.eql({
      name: 'hello-world',
      originURI: 'hello-world.html',
      uri: path.join(__dirname, './fixtures/hello-world.html')
    })
  })
  it('should parse HTMLImport info from remote link node', function () {
    var node = {
      tag: 'link',
      attrs: {
        rel: 'import',
        href: 'https://google.com/hello-world.html'
      }
    }
    expect(parser.parseHTMLImport(node, {
      uri: path.join(__dirname, './fixtures/index.html')
    })).to.eql({
      name: 'hello-world',
      originURI: 'https://google.com/hello-world.html',
      uri: 'https://google.com/hello-world.html'
    })
  })
  it('should seperate HTMLImport source into style script and html parts', function () {
    var HTMLImport = {
      name: 'hello-world',
      originURI: 'hello-world.html',
      uri: path.join(__dirname, './fixtures/hello-world.html'),
      source: fixture('fixtures/hello-world.html')
    }
    parser.prepareHTMLImport(HTMLImport)
    expect(HTMLImport.parts.scripts.length).to.eql(1)
    expect(HTMLImport.parts.styles.length).to.eql(1)
    expect(HTMLImport.parts.template).to.not.be.undefined
  })
})

describe('posthtml-web-component', function () {
  it('should parse web component', function (done) {
    var webComponent = posthtml().use(require('../src/index')({
      uri: path.join(__dirname, './fixtures/index.html')
    }))
    webComponent.process(indexHTML)
      .then(function (result) {
        expect(result.html).to.eql(fixture('fixtures/result.txt'))
      }).then(done, done)
  })
})
