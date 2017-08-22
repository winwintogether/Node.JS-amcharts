const express = require('express')
const app = express()
const http = require('http').Server(app);
const path = require('path');
const cron = require('node-cron')
const bodyParser = require('body-parser')
const mysql = require('mysql');
const io = require('socket.io')(http);

const con = mysql.createConnection({
  	host: "localhost",
  	user: "root",
  	password: "",
  	database: "local_data"
});

const sql = "select * from local_table ORDER BY Data_time ASC";

con.connect(function(err) {
  	if (err) throw err;
  	console.log("Connected!");
});

io.on('connection', function(){
	console.log('accepted');
	con.query(sql, function (err, resultData) {
		if (err) throw err;
		io.sockets.emit('broadcast',{ result:resultData});
	});	
});



app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(express.static(__dirname + '/'));


app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname+'/index.html'));
})


http.listen(3000, function () {
	console.log('Example app listening on port 3000!')
})

cron.schedule('*/10 * * * * *', function(){
  	
	con.query(sql, function (err, resultData) {
		if (err) throw err;
		io.sockets.emit('broadcast',{ result:resultData});
	});	
	
});