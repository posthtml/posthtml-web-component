var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/navigator', function(req, res) {
  res.render('index', {
    title: 'Express',
    current: req.query.current || 'home'
  });
});

module.exports = router;
