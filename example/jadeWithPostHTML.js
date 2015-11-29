var posthtml = require('posthtml')
module.exports = function (path, options, callback) {

    var html = require('ejs').renderFile(path, options, function(err, html) {
      if (err) {
        return callback(err)
      }
      posthtml([
        require('../src/index')({
          hostURI:path
        })
      ])
          .process(html)
          .then(function (result) {
              if (typeof callback === 'function') {
                  var res;
                  try {
                      res = result.html;
                  } catch (ex) {
                      return callback(ex);
                  }
                  return callback(null, res);
              }
          });
    });
}
