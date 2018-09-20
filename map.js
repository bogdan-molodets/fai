const express = require('express');
const path=require('path');
const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use(express.static(__dirname));
app.use('/countries',express.static(__dirname+'/countries'));
app.use('/font',express.static(__dirname+'/font'));
app.listen(process.env.PORT || 9000);

