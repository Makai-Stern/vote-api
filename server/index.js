require('dotenv').config();
// Dependencies
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');


// Handlers
const db = require('./models');
const handle = require('./handlers');

// Routes
const routes = require('./routes');

// Initialize Server
const app = express();
const port = process.env.PORT || 4000;

// Initialize Dependencies
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => res.json({msg : "Hello World"}))
app.use('/api/auth', routes.auth)
app.use('/api/polls', routes.poll)

// Middleware
app.use(handle.notFound);
app.use(handle.errors);

app.listen(port, console.log(`Server is running on ${port}`))