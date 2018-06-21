let express = require('express')
let request = require('request')
let querystring = require('querystring')
var https = require('https');
var fs = require('fs');

var RoomUtils = require('./src/roomUtils');
var roomUtils = new RoomUtils()

let app = express()

let redirect_uri = 
  process.env.REDIRECT_URI || 
  'http://localhost:8888/callback'

var server = https.createServer(app)

app.get('/login', function(req, res) {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: 'user-library-read user-read-email',
      redirect_uri
    }))
})

app.get('/callback', function(req, res) {
  let code = req.query.code || null
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
      ).toString('base64')) 
    },
    json: true
  }
  request.post(authOptions, function(error, response, body) {
    var access_token = body.access_token
    let uri = process.env.FRONTEND_URI || 'http://localhost:3000/play'
    res.redirect(uri + '?access_token=' + access_token)
  })
})

// Chargement de socket.io
var iop = require('socket.io').listen(server);


// Quand un client se connecte, on le note dans la console
iop.sockets.on('connection', function (socket) {
  console.log('Un client est connecté !');

  roomUtils.addPlayer(socket)

  socket.on('ready', function() {
    roomUtils.onPlayerReady(socket)
  })

  socket.on('answer', function(data) {
    console.log("Answered")
    roomUtils.onPlayerAnswer(socket)
  })

});


let port = process.env.PORT || 8888
console.log(process.env.SPOTIFY_CLIENT_ID)
console.log(`Listening on port ${port}. Go /login to initiate authentication flow.`)

server.listen(port)