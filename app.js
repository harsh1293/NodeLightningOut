var nforce = require('nforce');
var express = require('express');
var port = process.env.PORT || 3000;

var org = nforce.createConnection({
  clientId: '3MVG9d8..z.hDcPLEP6C2EcBTo6ks2qqTA8mFZRhqbGV1yL2dVdO6IPKVBGBAO67FVYS.z.67AksJBPXuv1Wq
',
  clientSecret: '68969CDF10DB831A94AA005E585EBD35FE9D8B4CBAE35E5D5F6D9D12F08B4943',
  redirectUri: 'https://aura-app-hp.herokuapp.com/oauth/_callback',
  apiVersion: 'v45.0',  // optional, defaults to current salesforce API version
  environment: 'production',  // optional, salesforce 'sandbox' or 'production', production default
  mode: 'multi' // optional, 'single' or 'multi' user mode, multi default
});

var app = express();

// Require Routes js
var routesHome = require('./routes/home');

// Serve static files
app.use(express.static(__dirname + '/public'));

app.use('/home', routesHome);

app.set('view engine', 'ejs');

app.get('/', function(req,res){
  res.redirect(org.getAuthUri());
});

app.get('/oauth/_callback', function(req, res) {
  org.authenticate({code: req.query.code}, function(err, resp){
    if(!err) {
      console.log('Access Token: ' + resp.access_token);
      app.locals.oauthtoken = resp.access_token;
      app.locals.lightningEndPointURI = "https://harsh1293lightning-dev-ed.my.salesforce.com";
      res.redirect('/home');
    } else {
      console.log('Error: ' + err.message);
    }
  });
});

// Served Localhost
console.log('Served: http://localhost:' + port);
app.listen(port);
