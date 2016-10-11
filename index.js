// Setup packages
const express = require('express');
const ejs = require('ejs');
const path = require('path');
const pg = require('pg');
const bodyParser = require('body-parser');
const _ = require('lodash');
const formidable = require('express-formidable');
const util = require('util');

//see some stats on the server
require('./app/hardware');

// Create the app
const app = express();
const port = process.env.PORT || 8080;

//set up a connection pool
const config = {
  user: 'postgres',
  password: 'postgres',
  database: 'example_app_db',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000
};
const pool = new pg.Pool(config);

// Setup helpers for Express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));

//set up view and templating and form processing
app.use(express.static(__dirname + '/views'));
app.use(formidable());
app.set('view engine', 'ejs');

//routes
//The home page
app.get('/home', (req, res) => {
  console.log(`Hit the GET /home endpoint!`);
  res.render('index.ejs');
});

app.get('/back', (req, res) => {
  console.log(`Hit the GET /back endpoint!`);
  res.render('index.ejs');
});

//Get a list of contacts
app.get('/list', (req, res, next) => {
  console.log(`Hit the GET /list endpoint!`);
  pool.connect(function (err, client, done) {
      if (err) {
        return next(err);
      }
      client.query('SELECT * from contacts;', function (err, result) {
        done();

        if (err) {
          console.log('something bad happened', err);
          return next(err);
        }

        console.log('Retrieved ' + result.rowCount + ' records');
        _.forEach(result.rows, function(row) {
          console.log(row);
        });
        var contacts = result.rows;
        var count = result.rowCount;
        res.render('listcontact', {
          count: count,
          contacts: contacts
        });
        res.end();
      })
    });
});

//Add a contact
app.post('/add', function (req, res, next) {
  console.log(`Hit the POST /add endpoint!`);

  var fname = req.fields.fname;
  var lname = req.fields.lname;
  var email = req.fields.email;

  pool.connect(function (err, client, done) {
      if (err) {
        return next(err);
      }
      client.query('INSERT INTO contacts (fname, lname, email) VALUES ($1, $2, $3);', [fname, lname, email ], function (err, result) {
        done();

        if (err) {
          console.log('something bad happened', err);
          return next(err);
        }
      })
    });

    console.log('Saved the contact: ' + fname + ' ' + lname + ' - ' + email );

    res.render('index');
    res.end();
});

// start the server
app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log(`server is listening on ${port}`);
});
