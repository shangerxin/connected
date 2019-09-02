interface Array<T>{
	swapToHead(index:number):Array<T>;
	updateWith(compare:Function, update:Function);
}

Array.prototype.swapToHead = function(index):Array<any>{
	if(this.length >= index || index === 0){
		return this;
	}

	let t = this[0];
	this[0] = this[index];
	this[index] = t;
	return this;
};

Array.prototype.updateWith = function(compare, update){

};
