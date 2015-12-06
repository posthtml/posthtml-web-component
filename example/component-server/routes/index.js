var express = require('express');
var router = express.Router();

/* GET navigator component. */
router.get('/navigator', function(req, res) {
  res.render('navigator', {
    current: req.query.current || 'home'
  });
});

/* GET clock component. */
router.get('/clock', function(req, res) {
  res.render('clock');
});

module.exports = router;
