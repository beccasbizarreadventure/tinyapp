const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const app = require('../express_server.js');

chai.use(chaiHttp);

describe("Login and Access Control Test", () => {
  it('should return 403 status code for unauthorized access to "http://localhost:8080/urls/i3BoGr"', () => {
    const agent = chai.request.agent("http://localhost:8080");

    return agent
      .post("/login")
      .send({ email: "user2@example.com", password: "dishwasher-funk" })
      .then((loginRes) => {
        return agent.get("/urls/i3BoGr").then((accessRes) => {
          expect(accessRes).to.have.status(403);
        });
      });
  });
});

describe('GET /urls/NOTEXISTS', () => {
  it('should fail and respond with status code 404', function(done) { 
      chai.request('http://localhost:8080')
      .get('/urls/NOTEXISTS')
      .end(function(err, res) {
        expect(res).to.have.status(404);
        done();                             
      });
    });
  });

describe('GET /urls/new redirect', () => {
  it('should redirect a user who is not logged in to /login', function(done) { 
    chai.request('http://localhost:8080')
    .get('/urls/new')
    .end(function(err, res) {
      expect(res).to.redirectTo('http://localhost:8080/login');;
      done();                             
    });
  });
});

describe('GET / redirect', () => {
  it('should redirect a user who is not logged in to /login', function(done) { 
    chai.request('http://localhost:8080')
    .get('/')
    .end(function(err, res) {
      expect(res).to.redirectTo('http://localhost:8080/login');;
      done();                             
    });
  });
});