const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080;

const generateRandomString = function() {
 const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < chars.length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result.slice(0, 6);
};

app.set("view engine", "ejs");

app.use(cookieParser());

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

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/register", (req, res) => {
  const currentUser = req.cookies["user_id"];
  const user = users[currentUser]
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
  for (currentUser in users) {
    if (users[currentUser].email === user.email) {
      res.send("Error 400: E-mail already in use")
    }
  };
  users[userID] = user;
  res.cookie('user_id', userID);
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  const longURL = req.body.longURL;
  const id = req.params.id;
  urlDatabase[id] = longURL;
  res.redirect("/urls");
});

app.get("/urls/new", (req, res) => {
  const currentUser = req.cookies["user_id"];
  const user = users[currentUser]
  res.render("urls_new", { user });
});

app.get("/urls", (req, res) => {
  const currentUser = req.cookies["user_id"];
  const templateVars = { 
    urls: urlDatabase,
    user: users[currentUser] };
  res.render("urls_index", templateVars);
});

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const id = generateRandomString();
  urlDatabase[id] = longURL;
  res.redirect(`/urls/${id}`);
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  res.cookie('name', username);
  res.redirect("/urls");
})

app.post("/logout", (req, res) => {
  res.clearCookie('name');
  res.redirect("/urls");
})

app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const currentUser = req.cookies["user_id"];
  const templateVars = { 
    id: id, 
    longURL: urlDatabase[id],
    user: users[currentUser],
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Tiny app listening on port ${PORT}!`);
});