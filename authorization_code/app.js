var SpotifyWebApi = require('spotify-web-api-node');
var bodyParser = require('body-parser');
const express = require('express');
const { SpotifyPlaybackSDK } = require("spotify-playback-sdk-node");

const scopes = [
    'ugc-image-upload',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'app-remote-control',
    'user-read-email',
    'user-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-read-private',
    'playlist-modify-private',
    'user-library-modify',
    'user-library-read',
    'user-top-read',
    'user-read-playback-position',
    'user-read-recently-played',
    'user-follow-read',
    'user-follow-modify'
  ];
  
// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: 'b2e6644931a64122a406332d4da0a0b4',
  clientSecret: '779bf5cc47ac46e38eb14935ba2ca3dc',
  redirectUri: 'http://localhost:8888/callback'
});
  const app = express();
  
  app.get('/login', (req, res) => {
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
  });
  
  app.get('/callback', (req, res) => {
    const error = req.query.error;
    const code = req.query.code;
    const state = req.query.state;
  
    if (error) {
      console.error('Callback Error:', error);
      res.send(`Callback Error: ${error}`);
      return;
    }
  
    spotifyApi
      .authorizationCodeGrant(code)
      .then(data => {
        const access_token = data.body['access_token'];
        const refresh_token = data.body['refresh_token'];
        const expires_in = data.body['expires_in'];
  
        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);
  
        //console.log('access_token:', access_token);
       // console.log('refresh_token:', refresh_token);
  
        //console.log(
        //  `Sucessfully retreived access token. Expires in ${expires_in} s.`
        //);
        res.redirect('/');
        
        
        setInterval(async () => {
          const data = await spotifyApi.refreshAccessToken();
          const access_token = data.body['access_token'];
          
          console.log('The access token has been refreshed!');
          console.log('access_token:', access_token);
          spotifyApi.setAccessToken(access_token);
        }, expires_in / 2 * 1000);
        
      })
      .catch(error => {
        console.error('Error getting Tokens:', error);
        res.send(`Error getting Tokens: ${error}`);
      });
      
    });
    
    
    //////////////////////////////////////////////
    const path = require('path');       // for opening .html files after entering url
    app.use(express.static('public'))
    app.use(express.urlencoded({ extended: true }));
    
    app.get('/', function(req, res) {
      res.sendFile(__dirname + "/" + "/public/index.html");
      res.redirect('/request');
    });

    var topArtists;
    var ifTopArtistGot=0;
    
    app.post("/request", (req, res) => {
      spotifyApi.getMyCurrentPlayingTrack()
  .then(function(data) {
    var currentlyPlaying= data.body.item.id;


      spotifyApi.getMyTopArtists()
    .then(function(data) {
      if(ifTopArtistGot==0){
      topArtists = [data.body.items[0].id, data.body.items[1].id, topArtists2 = data.body.items[2].id, topArtists3 = data.body.items[3].id];
      ifTopArtistGot=1;
      }
        spotifyApi.getRecommendations({
          min_energy: 0.4,
          seed_artists: [...topArtists],
          min_popularity: 50
        })
        .then(function(data) {
          let recommendations = data.body;
          //console.log(recommendations);
         topArtists.push(currentlyPlaying);
          topArtists.shift();

          console.log("\n");
          console.log(...topArtists);
          spotifyApi.play
         


        }, function(err) {
          console.log("Something went wrong!", err);
        });

      }, function(err) {
        console.log('Something went wrong!', err);
      }); 



  }, function(err) {
    console.log('Something went wrong!', err);
  });

  });
  
  app.get('/data', function(req, res) {
    spotifyApi.getMyCurrentPlayingTrack()
    .then(function(data) {
      res.send(data)
    }, function(err) {
      console.log('Something went wrong!', err);
    });;
    
  });
  

  app.listen(8888, () =>
  console.log(
    'HTTP Server up. Now go to http://localhost:8888/login in your browser.'
  ));

spotifyApi.p