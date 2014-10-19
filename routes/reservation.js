var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/reservation', function(req, res) {
  res.render('reservation', { title: 'Reservation' });
});

module.exports = router;
