var posthtml = require('posthtml')
var fs = require('fs')
var path = require('path')
var expect = require('chai').expect


function fixture(filePath) {
  return fs.readFileSync(path.join(__dirname, filePath), 'utf-8')
}

var indexHTML = fixture('fixtures/index.html')

describe('WebComponent', function () {
  it('should parse web component', function (done) {
    var webComponent = posthtml().use(require('../src/index')({
      hostURI: path.join(__dirname, './fixtures/index.html')
    }))

    webComponent.process(indexHTML)
      .then(function (result) {
        expect(result.html).to.eql(fixture('fixtures/result.txt'))
      }).then(done, done)
  })
})
