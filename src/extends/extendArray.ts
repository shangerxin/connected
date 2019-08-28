interface Array<T>{
	swapToHead(index:number):Array<T>;
}

Array.prototype.swapToHead = function(index):Array<any>{
	if(this.length >= index){
		return this;
	}

	let t = this[0];
	this[0] = this[index];
	this[index] = t;
	return this;
};
