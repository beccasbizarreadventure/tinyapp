const { generateRandomString, findUserByEmail, getUser, urlsForUser, loginState, notLoggedIn, validURL } = require("./functions");
const { urlDatabase, users } = require("./data");
const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

/*
TEMPORARY HOMEPAGE 
*/

app.get("/", (req, res) => {
  res.send("Hello!");
});

/*
USER REGISTRATION 
*/

app.get("/register", loginState, (req, res) => {
  const user = getUser(req.cookies["user_id"]);
  res.render("register", { user });
});

app.post("/register", (req, res) => {
  const userID = generateRandomString();
  const user = {
    id: userID,
    email: req.body.email,
    password: req.body.password
  };
  if (user.email.length === 0 || user.password.length === 0) {
    res.send("Error 400: Invalid Input");
  };
  const currentUser = findUserByEmail(user.email, users)
    if (currentUser) {
      return res.status(400).send("Email already in use.");
    };
  users[userID] = user;
  res.cookie('user_id', userID);
  res.redirect("/urls");
});

/*
USER LOGIN / USER LOGOUT 
*/

app.get("/login", loginState, (req, res) => {
  const user = getUser(req.cookies["user_id"]);
  res.render("login", { user });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  let user = Object.values(users).find(user =>
    user.email === email);
  if (user === undefined) {
    res.status(403).send("Email not found");
  }
  if (user && user.password !== password) {
    res.status(403).send("Invalid password");
  }
  if (user && user.password === password) {
    res.cookie('user_id', user.id);
    res.redirect("/urls");
  }
  });
  
app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/login");
});

/*
URLs
*/
 
// Edit URL path 

app.post("/urls/:id", (req, res) => {
  if (!req.cookies['user_id']) {
    res.status(403).send('Please login first');
  };
  const longURL = req.body.longURL;
  const id = req.params.id;
  urlDatabase[id].longURL = longURL;
  res.redirect("/urls");
});

// New Tiny URL creation page

app.get("/urls/new", notLoggedIn, (req, res) => {
  const user = getUser(req.cookies["user_id"]);
  res.render("urls_new", { user });
});

// User not logged in redirect page

app.get("/noLogin", (req, res) => {
});

// URL index page

app.get("/urls", notLoggedIn, (req, res) => {
  const templateVars = { 
    urls: urlsForUser(req.cookies['user_id']),
    user: getUser(req.cookies["user_id"]) };
  res.render("urls_index", templateVars);
});

// Delete URL path

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  const user = getUser(req.cookies["user_id"]);
  if (user === undefined || user.id !== urlDatabase[id].userID || urlDatabase[id] === undefined) {
    return res.status(403).send("This URL does not belong to you or does not exist");
  }
  delete urlDatabase[id];
  res.redirect("/urls");
});

// Create New Tiny URL path

app.post("/urls", (req, res) => {
  if (!req.cookies['user_id']) {
    res.status(403).send('Please login first');
  };
  const id = generateRandomString();
  urlDatabase[id] = {
    longURL: req.body.longURL,
    userID: req.cookies["user_id"]
  };
  res.redirect(`/urls/${id}`);
});

// Page for specific Tiny URL ID and edit URL 

app.get("/urls/:id", notLoggedIn, (req, res) => {
  const id = req.params.id;
  validURL(req, res, urlDatabase);
  if (req.cookies['user_id'] !== urlDatabase[id].userID) {
    return res.status(403).send("This URL does not belong to you. Please login to the correct account first");
  }
  const templateVars = { 
    id: req.params.id, 
    longURL: urlDatabase[id].longURL, 
    user: getUser(req.cookies["user_id"])
  };
  res.render("urls_show", templateVars);
});

// Redirect to Long URL from Tiny URL ID 

app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  validURL(req, res, urlDatabase);
  const longURL = urlDatabase[id].longURL;
  res.redirect(longURL);
});

/*
CONNECTION
*/

app.listen(PORT, () => {
  console.log(`Tiny app listening on port ${PORT}!`);
});