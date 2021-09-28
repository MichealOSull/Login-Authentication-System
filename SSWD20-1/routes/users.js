var express = require('express');
var router = express.Router();

var session = require('express-session');
var FileStore = require('session-file-store')(session);



router.get('/logout', (req, res) => {
  if(req.session) {
  req.session.destroy();
  res.clearCookie('session-id');

  res.redirect('/');
}
else {
  res.end('Not logged in')
}
  

});

router.use(session({
  name: 'session-id',
  secret: '12345-67890-98765-43210',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()

}));


module.exports = router;
