var express = require('express');
var app = express();
var PORT = process.env.PORT || 23333;

app.use(express.static(__dirname + '/public'));
app.get('/*', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

var Pinger = function(url, interval) {
  var self = this;
  var request = require('request');

  self.url = url;
  self.interval = interval;

  self.start = function(url) {
    request(url, function(error, response, body) {
      var time = (new Date()).toISOString();
      var status = 'live';
      if (error || response.statusCode !== 200) {
        status = 'down';
      }
      console.log(time + " - " + "[" + status + "] " + url);
      setTimeout(function() {
        self.start(self.url);
      }, self.interval);
    });
  };

  self.start(self.url);
};

var ping_interval = 1000*60; // 1-minute interval
var pingers = {
  pinger_daimyo: new Pinger('https://codelads.herokuapp.com', ping_interval)
};

app.listen(PORT, function() {
  console.log('Listening on port %d', PORT);
});
