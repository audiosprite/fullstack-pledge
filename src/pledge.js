'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js deferral-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

var $Promise = function() {
	this._state = 'pending';
	this._value;
}

var Deferral = function() {
	this.$promise = new $Promise();
}

Deferral.prototype.resolve = function(obj) {
	if (this.$promise._state === 'pending') {
		this.$promise._value = obj;
	}
	this.$promise._state = 'resolved';
}

Deferral.prototype.reject = function(reason) {
	if (reason && this.$promise._state === 'pending') {
		this.$promise._value = reason;
	}
	this.$promise._state = 'rejected';

}



var defer = function() {
	return new Deferral();
}







/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = {
  defer: defer,
};

So in a Node-based project we could write things like this:

var pledge = require('pledge');
…
var myDeferral = pledge.defer();
var myPromise1 = myDeferral.$promise;
--------------------------------------------------------*/
