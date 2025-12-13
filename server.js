require('dotenv').config();
require('./config/database.js');

const express = require('express');
const path = require('path');

const app = express();
// Sessions
const session = require('express-session');
const { MongoStore } = require('connect-mongo');

// Middleware
const methodOverride = require('method-override');
const morgan = require('morgan');
const passUserToView = require('./middleware/pass-user-to-view.js');
const isSignedIn = require('./middleware/is-signed-in');
const isAdmin = require('./middleware/is-admin');

// Controllers
const authCtrl = require('./controllers/auth');
const BooksCtrl = require('./controllers/Books');

const port = process.env.PORT ? process.env.PORT : '3000';

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

// Locals
app.use(passUserToView);

// ---------- PUBLIC ROUTES ----------

app.get('/', async (req, res) => {
  res.render('index.ejs');
});

app.use('/auth', authCtrl);

// ---------- PROTECTED ROUTES ----------
app.use(isSignedIn);
app.use('/Books', BooksCtrl);



app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
