const { assert } = require('chai');

const { findUserByEmail, getUser, urlsForUser, loginState, notLoggedIn, validURL } = require('../functions.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('findUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = findUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert.strictEqual(user.id, expectedUserID);
  });
  it('should return null when an email does not exist in the database', function() {
    const user = findUserByEmail("levi@example.com", testUsers)
    const expectedUserID = null;
    assert.strictEqual(user, expectedUserID);
  });
});