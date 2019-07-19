const app = require('express')();
const routes = require('./routes');
var bodyParser = require('body-parser')

app.use(bodyParser.json())


//  Connect all our routes to our application
app.use('/', routes);

// Turn on that server!
app.listen(3000, () => {
  console.log('App listening on port 3000');
});