const helper = require('../helper.js');


var assert = require('assert');
describe('#generateToken()', function() {
  it('should return 64 characters string', function() {
    var token = helper.generateToken();
    var length = Buffer.byteLength(token, 'utf8');
	length=token.length;
    assert.equal(length, 64);
  });
   it('should return random string', function() {
    var token = helper.generateToken();
    var length = Buffer.byteLength(token, 'utf8');
	length=token.length;
	var isRandom=true
	var tokenTab= [];
	for (var k=0 ; k<10; k++) {
		tokenTab[k]=helper.generateToken();
	}
	for (var i=0 ; i<10; i++){
		for (var j=0 ; j<10; j++){
			if (i!=j){
				if (tokenTab[i] == tokenTab[j]){
					console.log("i  : "+i);
					console.log("j  : "+j);
					console.log("i  value : "+tokenTab[i]);
					console.log("j  value : "+tokenTab[j]);
					
					isRandom=false;
					break;
				}
			}
		}
	}
	
    assert.equal(isRandom, true);
  });
});
