const express = require('express');
const app = express();
const path = require('path');
const args = require('yargs').argv;
const fs = require('fs');

let https = require('https');
let http = require('http');

// Config on conmmand line
app.set('port', args.port || 8080);
app.set('mode', args.mode || 'development');

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'))
app.use(express.static(path.resolve(__dirname, 'public')));

app.get('*', (req, res, next) => {
    // render maintenance page
    res.render('maintenance-page/main');
})


if (args.mode == 'development') {
    // Run development mode
    http.createServer(app).listen(app.get('port'), () => {
        console.log(`Server running on port ${app.get('port')} as ${app.get('mode')} mode`);
    });
} else if (args.mode == 'production') {
    // Run production mode
    let options = {
        key: fs.readFileSync('/etc/letsencrypt/live/prolacciocosmetics.com/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/prolacciocosmetics.com/cert.pem'),
        ca: fs.readFileSync('/etc/letsencrypt/live/prolacciocosmetics.com/chain.pem'),
        rejectUnauthorized: false,
    };
    https.createServer(options, app).listen(app.get('port'), () => {
        console.log(`Server running on port ${app.get('port')} as ${app.get('mode')} mode`);
    });
}