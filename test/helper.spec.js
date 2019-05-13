var assert = require('chai').assert
var helper = require('../util/helper');

describe('helper', function () {
	it('should generate token correctly', function () {
		var token = helper.generateToken();
		var length = Buffer.byteLength(token, 'utf8');
		length = token.length;
		assert.equal(length, 64);
  });
  
	it('should generate token randomly', function () {
		var token = helper.generateToken();
		var length = Buffer.byteLength(token, 'utf8');
		length = token.length;
		var isRandom = true
		var tokenTab = [];
		for (var k = 0; k < 10; k++) {
			tokenTab[k] = helper.generateToken();
		}
		for (var i = 0; i < 10; i++) {
			for (var j = 0; j < 10; j++) {
				if (i != j) {
					if (tokenTab[i] == tokenTab[j]) {
						console.log("i  : " + i);
						console.log("j  : " + j);
						console.log("i  value : " + tokenTab[i]);
						console.log("j  value : " + tokenTab[j]);

						isRandom = false;
						break;
					}
				}
			}
		}

		assert.equal(isRandom, true);
	});
});