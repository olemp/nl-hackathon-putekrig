/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */
// Load variables from .env
require('dotenv').load();

const express = require('express'); // Express web server framework
const request = require('request'); // "Request" library
const https = require('https');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const w3w_secret = process.env.W3W_SECRET;
const redirect_uri = 'https://rocky-spire-1608.herokuapp.com/callback'; // Your redirect uri
const localhost_redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

/**
 * To support local development the argument l local or localhost
 * can be added when starting the server
 */
const validArgs = ['l', 'local', 'localhost'];
const isLocal = process.argv.some(arg => validArgs.includes(arg));

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
function generateRandomString(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const stateKey = 'spotify_auth_state';

const app = express();
app.set('port', process.env.PORT || 8888);

app.use(express.static(__dirname + '/public'))
    .use(cookieParser());

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', (request, response) => {
    response.render('pages/index');
});
app.get('/player', (request, response) => {
    response.render('pages/player');
});
app.get('/guide', (request, response) => {
    response.render('pages/guide');
});
app.get('/history', (request, response) => {
    response.render('pages/history');
});
app.get('/history/:id', (request, response) => {
    response.render('pages/trip');
});

// w3w stuff
app.get('/w3w', (request, response) => {
    https.get('https://api.what3words.com/v2/reverse?key=' + w3w_secret + '&lang=en&coords=' + request.query.lat + ',' + request.query.lon,
        function (res) {
            response.setHeader('Content-Type', 'application/json');
            response.writeHead(res.statusCode);

            let responseBody = '';
            res.on('data', function (chunk) {
                responseBody += chunk;
            });

            res.on('end', function() {
                response.write(responseBody);
                response.end();
            });

        }).on('error', function (e) {
        response.write(e);
    });
});

// Spotify stuff

app.get('/login', (req, res) => {

    const state = generateRandomString(16);
    res.cookie(stateKey, state);

    // your application requests authorization
    const scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: (isLocal ? localhost_redirect_uri : redirect_uri),
            state: state
        }));
});

app.get('/callback', (req, res) => {

    // your application requests refresh and access tokens
    // after checking the state parameter

    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        res.clearCookie(stateKey);
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: (isLocal ? localhost_redirect_uri : redirect_uri),
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, (error, response, body) => {
            if (!error && response.statusCode === 200) {

                const access_token = body.access_token;
                const refresh_token = body.refresh_token;

                const options = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: {'Authorization': 'Bearer ' + access_token},
                    json: true
                };

                // use the access token to access the Spotify Web API
                request.get(options, (error, response, body) => {
                    console.log(body);
                });

                // we can also pass the token to the browser to make requests from there
                res.redirect('/#' +
                    querystring.stringify({
                        access_token: access_token,
                        refresh_token: refresh_token
                    }));
            } else {
                res.redirect('/#' +
                    querystring.stringify({
                        error: 'invalid_token'
                    }));
            }
        });
    }
});

app.get('/refresh_token', (req, res) => {

    // requesting access token from refresh token
    const refresh_token = req.query.refresh_token;
    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))},
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const access_token = body.access_token;
            res.send({
                'access_token': access_token
            });
        }
    });
});


app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
});
