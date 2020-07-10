const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const fs = require('fs');
const config = require('./config.json')

const app = express();
app.engine('handlebars', handlebars({ defaultLayout: 'base' }));
app.set('views', './views');
app.set('view engine', 'handlebars');


app.get('/', (req, res) => {
  var files_list = [];
  var app_list = [];
  fs.readdir(config.path, function (err, files) {
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }
    for (var i = 0; i < files.length; i++) {
      app_list.push(files[i].split('-')[0]);
      files_list.push(files[i]);
    }

    var app_unique = Array.from(new Set(app_list));
    res.render('home', {title: 'Log Viewer', app_list: app_unique});
  });
});

app.get('/getLogFiles', (req, res) => {
  app_filter = req.query.app
  var files_list = [];
  fs.readdir(config.path, function (err, files) {
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }
    for (var i = 0; i < files.length; i++) {
      if (files[i].split('-')[0] == app_filter) {
        files_list.push(files[i]);
      }

    }
    res.json({ "files_list": files_list });
  });
});

app.get('/getLogContent', (req, res) => {
  selected_file = req.query.file
  fs.readFile(config.path + '/' + selected_file, 'utf8', function (err, data) {
    if (err) throw err;
    res.json({ 'file_content': data });
  });
});

app.listen(config.port, function () {
  console.log('Log Viewer is listening on port ' + config.port);
});