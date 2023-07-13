// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const express    = require("express");
const bodyParser = require("body-parser");
const sass       = require("node-sass-middleware");
const morgan     = require('morgan');
const cookieSession = require('cookie-session');
const helpers = require("./public/scripts/helpers.js");

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

const app = express();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));
app.use(
  cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
  })
);

// Routes
const usersRoutes     = require("./routes/users");
const widgetsRoutes   = require("./routes/widgets");
const registerRoutes  = require("./routes/register");
const loginRoutes     = require("./routes/login");
const logoutRoutes    = require("./routes/logout");
const categoryRoutes  = require("./routes/category");
const smartPostRoutes = require("./routes/smartPost");

// Mount all resource routes
app.use("/users", usersRoutes(db));
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
app.use("/register", registerRoutes(db));
app.use("/login", loginRoutes(db));
app.use("/logout", logoutRoutes(db));
app.use("/category", categoryRoutes(db));
app.use("/add", smartPostRoutes(db));

app.get('/', (req, res) => {
  const getUserById = (id) => {
    const queryString = `
      SELECT * FROM users
      WHERE id = $1
    `
    const values = [id];
    return db.query(queryString, values)
      .then(res => {
        return res.rows[0];
      })
  }
    getUserById(req.session.user_id).then(user => {
    const templateVars = {
      user
    };
    res.render("index", templateVars);
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});