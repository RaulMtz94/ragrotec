var express = require('express');

var app = express();

var port = 3100;
app.listen(port, function() {
  console.log('listening on port ' + port);
});

/* public routes */
app.get('/', function(req, res, end) {
  res.status(200).send('Hello, world');
})
app.get('/login', function(req, res, end) {
  res.status(200).send('login here');
})

app.use(function(req, res, next) {
  console.log('req.url', req.url);
  res.redirect('/login');
});

/* routes protected by login */
app.get('/profile', function(req, res, end) {
  res.status(200).send('my protected profile');
})