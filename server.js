const express = require('express');
const fs = require('fs');

// HandbleBars - cf. http://npmjs/package/hbs
const hbs = require('hbs');

// Heroku will set this port number as an environment variable
// when the app is running in Heroku.
const port = process.env.PORT || 3000;

var app = express();

// Tell HandbleBars to add support for partials.
// The parameter indicates where the partials will
// be located.
hbs.registerPartials(__dirname + '/views/partials');


hbs.registerHelper('getCurrentYear', ()=> {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.set('view_engine', 'hbs');

// With this line, you can use the following in the
// browser address line:  localhost:3000/help.html
app.use(express.static(__dirname + '/public'));

// Middleware for logging
app.use((req, resp, next) => {
  var now = new Date().toString();
  var log = `${now}:  ${req.method} ${req.url}`;

  console.log(log);
  fs.appendFile('server.log', log + '\n', (err)=>{
    if (err){
      console.log(`${now}:  ERROR:  ${err}`);
    }
  });
  next();
});

// app.use((req,resp, next) => {
//   resp.render('maintenance.hbs');
// });


app.get('/', (req, resp) => {
  resp.render('home.hbs', {
    pageTitle: 'Main Page',
    welcomeMessage: "Welcome to Anthony's page"

  });
});

// Use the port set by Heroku
app.listen(port, () => {
  console.log(`Web server is up and running on port ${port} ...`)
});


app.get('/about', (req, resp) => {
  // resp.send('About page');

  // With hbs
  resp.render('about.hbs', {
    pageTitle: 'About Page',
  });
});

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle:  'Projects Page'
  })
});

app.get('/bad', (req,resp) => {
  resp.send({
    errorMessage: 'Bad Request. Cannot bring up the page.'
  });
});
