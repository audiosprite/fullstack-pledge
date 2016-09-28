'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js deferral-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

var $Promise = function() {
	this._state = 'pending';
	this._value;
	this._handlerGroups = [];
}

$Promise.prototype.then = function(successHandler, errorHandler){
	if (typeof(successHandler) !== "function"){
		successHandler = null;
	}
	if (typeof(errorHandler) !== "function"){
		errorHandler = null;
	}
	var handlersObj = {
		successCb: successHandler,
		errorCb: errorHandler,
		downstream: new Deferral()
	}
	this._handlerGroups.push(handlersObj);
	if(this._state === 'resolved' || this._state === 'rejected'){
		this.callHandlers();
	}
	// console.dir(handlersObj.downstream);
	return handlersObj.downstream.$promise;
}

$Promise.prototype.callHandlers = function(){
	var handler = this._handlerGroups.shift();
	if (this._state === 'resolved'){
		if (handler.successCb){
			try {
				var result = handler.successCb(this._value);
				if (result instanceof $Promise){
					console.dir(handler.downstream.$promise);
					// console.log(handler.downstream.$promise._state);
					handler.downstream.$promise = result;
					console.dir(handler.downstream.$promise);
					handler.downstream.resolve();
				} else {
				handler.downstream.resolve(result);
				}
			} catch(e) {
				handler.downstream.reject(e);
			}
		} else {
			handler.downstream.resolve(this._value);
		}
	}
	if (this._state === 'rejected'){
		if (handler.errorCb){
			try {
				var result = handler.errorCb(this._value);
				handler.downstream.resolve(result);
			} catch(e) {
				handler.downstream.reject(e);
			}
		} else {
			handler.downstream.reject(this._value);
		}
	}
}

$Promise.prototype.catch = function(errorHandler){
	return this.then.call(this, null, errorHandler);
}

var Deferral = function() {
	this.$promise = new $Promise();
}

Deferral.prototype.resolve = function(obj) {
	if (this.$promise._state === 'pending') {
		this.$promise._value = obj;
		this.$promise._state = 'resolved';
		while (this.$promise._handlerGroups.length){
			this.$promise.callHandlers();
		}
	}
}

Deferral.prototype.reject = function(reason) {
	if (this.$promise._state === 'pending') {
		this.$promise._value = reason;
		this.$promise._state = 'rejected';
		while (this.$promise._handlerGroups.length){
			this.$promise.callHandlers();
		}
	}
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
