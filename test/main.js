var posthtml = require('posthtml')
var fs = require('fs')
var path = require('path')
var expect = require('chai').expect

var webComponent = posthtml().use(require('../index'))

function fixture(filePath) {
  return fs.readFileSync(path.join(__dirname, filePath), 'utf-8')
}

describe('posthtml-web-component', function () {
  it('should parse web component', function (done) {
    var indexHTML = fixture('fixtures/index.html')
    webComponent.process(indexHTML)
      .then(function (result) {
        expect(result.html).to.eql(fixture('fixtures/result.html'))
      }).then(done, done)
  })
})
