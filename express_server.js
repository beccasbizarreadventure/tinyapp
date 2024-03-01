const { generateRandomString, findUserByEmail, getUser, urlsForUser, loginState, notLoggedIn, validURL } = require("./helpers");
const { urlDatabase, users } = require("./data");
const express = require("express");
const bcrypt = require("bcryptjs");
const cookieSession = require('cookie-session');
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(cookieSession({ 
  name: "session",
  secret: "secretCookieKey"
}));

/*
HOMEPAGE 
*/

app.get("/", notLoggedIn);

/*
USER REGISTRATION 
*/

app.get("/register", loginState, (req, res) => {
  const user = getUser(users, req.session.user_id);
  res.render("register", { user });
});

app.post("/register", (req, res) => {
  const userID = generateRandomString();
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password);
  const user = {
    id: userID,
    email: req.body.email,
    hashedPass: hashedPassword
  };
  if (req.body.email.length === 0 || password.length === 0) {
    return res.status(400).send("Invalid input");
  };
  const currentUser = findUserByEmail(user.email, users)
    if (currentUser) {
      return res.status(400).send("Email already in use");
    };
  users[userID] = user;
  req.session.user_id = userID;
  res.redirect("/urls");
});

/*
USER LOGIN / USER LOGOUT 
*/

app.get("/login", loginState, (req, res) => {
  const user = getUser(users, req.session.user_id);
  res.render("login", { user });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  let user = findUserByEmail(email, users);
  if (!user) {
    return res.status(400).send("Email not found");
  }
  if (!bcrypt.compareSync(password, user.hashedPass)) {
    return res.status(400).send("Invalid password");
  }
  req.session.user_id = user.id;
  res.redirect("/urls");
});
  
app.post("/logout", (req, res) => {
  req.session.user_id = null;
  res.redirect("/login");
});

/*
URLs
*/
 
// Edit URL path 

app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = req.body.longURL;
  urlDatabase[id].longURL = longURL;
  if (!req.session.user_id) {
    res.status(403).send('Please login first');
  }
  if (req.session.user_id !== urlDatabase[id].userID || urlDatabase[id] === undefined) {
    return res.status(403).send("This URL does not belong to you or does not exist");
  }
  res.redirect("/urls");
});

// New Tiny URL creation page

app.get("/urls/new", notLoggedIn, (req, res) => {
  const user = getUser(users, req.session.user_id);
  res.render("urls_new", { user });
});

// URL index page

app.get("/urls", notLoggedIn, (req, res) => {
  const templateVars = { 
    urls: urlsForUser(urlDatabase, req.session.user_id),
    user: getUser(users, req.session.user_id) };
  res.render("urls_index", templateVars);
});

// Delete URL path

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  const user = getUser(users, req.session.user_id);
  if (user === undefined || user.id !== urlDatabase[id].userID || urlDatabase[id] === undefined) {
    return res.status(403).send("This URL does not belong to you or does not exist");
  }
  delete urlDatabase[id];
  res.redirect("/urls");
});

// Create New Tiny URL path

app.post("/urls", (req, res) => {
  if (!req.session.user_id) {
    res.status(403).send('Please login first');
  };
  const id = generateRandomString();
  urlDatabase[id] = {
    longURL: req.body.longURL,
    userID: req.session.user_id
  };
  res.redirect(`/urls/${id}`);
});

// Page for specific Tiny URL ID and edit URL 

app.get("/urls/:id", notLoggedIn, (req, res) => {
  const id = req.params.id;
  validURL(req, res, urlDatabase);
  if (req.session.user_id !== urlDatabase[id].userID) {
    return res.status(403).send("This URL does not belong to you. Please login to the correct account first");
  }
  const templateVars = { 
    id: req.params.id, 
    longURL: urlDatabase[id].longURL, 
    user: getUser(users, req.session.user_id)
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