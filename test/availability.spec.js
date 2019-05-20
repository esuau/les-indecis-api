var chai = require('chai')
var chaiHttp = require('chai-http');
var expect = chai.expect;
var app = require('../app')

chai.use(chaiHttp);

describe('Check availability method', () => {
  it('should return 400 error if userId and commandId are null', function (done) {
    chai.request(app)
      .post('/checkavailability')
      .end(function(err, res) {
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal('Bad request: accountId and commandId are required.');
        done();
      });
  });
  it('should return object if userId and commandId are sent', function (done) {
    chai.request(app)
      .post('/checkavailability')
      .type('application/json')
      .send({
				userId: 1,
				commandId: 1
			})
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });
});
