/*
HELPER FUNCTIONS 
*/

const {urlDatabase, users} = require("./data");

const generateRandomString = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
   let result = "";
   for (let i = 0; i < chars.length; i++) {
     result += chars.charAt(Math.floor(Math.random() * chars.length));
   }
   return result.slice(0, 6);
 };
 
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
 
 const urlsForUser = (id) => {
   let usersURLs = {}; 
   for (let urlID in urlDatabase) { 
     const currentURL = urlDatabase[urlID];
     if (currentURL.userID === id) { 
       usersURLs[urlID] = currentURL;
     }
   }
   return usersURLs;
 };
 
 const loginState = (req, res, next) => {
   if (req.session.user_id) {
     res.redirect('/urls')
   } else {
     next();
   }
 };
 
 const notLoggedIn = (req, res, next) => {
   if (!req.session.user_id) {
    const user = getUser(users, req.session.user_id);
    res.status(401).render("noLogin", { user });
   } else {
     next();
   }
 };
 
 const validURL = (req, res, urlDatabase) => {
   const id = req.params.id;
   if (urlDatabase[id] === undefined) {
     res.send("This is not a valid TinyURL")
   }
 };

 module.exports = {
  generateRandomString,
  findUserByEmail,
  getUser,
  urlsForUser,
  loginState,
  notLoggedIn,
  validURL
 };