const express = require('express');
const connectToMongo = require('./db');
const cors = require('cors');

const authRoute = require('./routes/auth.js');
const fruitsRoute = require('./routes/fruits.js');
const servicesRoute = require('./routes/services.js');
const profileRoute = require('./routes/profile.js')
const cartRoute = require('./routes/cart.js')
const orderRoute = require('./routes/order.js')
const contactRoute = require('./routes/contact.js')
const app = express();
const port = 5000;

connectToMongo();

app.use(cors()); 
app.use(express.json()); 


app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});
app.use('/', authRoute);
app.use('/', fruitsRoute);
app.use('/', servicesRoute);
app.use('/', profileRoute);
app.use('/', cartRoute);
app.use('/', orderRoute);
app.use('/', contactRoute);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
