const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080;

const generateRandomString = () => {
 const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < chars.length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result.slice(0, 6);
};

/*
HELPER FUNCTIONS 
*/

const findUserByEmail = (email, users) => {
  for (let userId in users) {
    if (users[userId].email === email) {
      return users[userId]; 
    }
  }
  return null;
};

const getUser = (userCookie) => {
  const thisCurrentUser = userCookie;
  const currentUser = users[thisCurrentUser];
  return currentUser;
};

app.set("view engine", "ejs");

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

/*
STORAGE OBJECTS 
*/

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  }
};

/*
TEMPORARY HOMEPAGE 
*/

app.get("/", (req, res) => {
  res.send("Hello!");
});

/*
USER REGISTRATION 
*/

app.get("/register", (req, res) => {
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

app.get("/login", (req, res) => {
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
  const longURL = req.body.longURL;
  const id = req.params.id;
  urlDatabase[id] = longURL;
  res.redirect("/urls");
});

// New Tiny URL creation page

app.get("/urls/new", (req, res) => {
  const user = getUser(req.cookies["user_id"]);
  res.render("urls_new", { user });
});

// URL index page

app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    user: getUser(req.cookies["user_id"]) };
  res.render("urls_index", templateVars);
});

// Delete URL path

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect("/urls");
});

// Create New Tiny URL path

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const id = generateRandomString();
  urlDatabase[id] = longURL;
  res.redirect(`/urls/${id}`);
});

// Page for specific Tiny URL ID

app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const templateVars = { 
    id: id, 
    longURL: urlDatabase[id],
    user: getUser(req.cookies["user_id"])
  };
  res.render("urls_show", templateVars);
});

// Redirect to Long URL from Tiny URL ID 

app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  res.redirect(longURL);
});

/*
CONNECTION
*/

app.listen(PORT, () => {
  console.log(`Tiny app listening on port ${PORT}!`);
});