interface Array<T> {
    swapToHead(index: number): Array<T>;
    updateWithCondition(condition: Function, update: Function):Array<T>;
    insertBy(value: any, index?:number, compare?: Function):Array<T>;
    shadowClone():Array<T>;
}

Array.prototype.swapToHead = function(index): Array<any> {
    if (this.length >= index || index === 0) {
        return this;
    }

    let t = this[0];
    this[0] = this[index];
    this[index] = t;
    return this;
};

Array.prototype.updateWithCondition = function(condition, update) {
    for (let i = 0; i < this.length; i++) {
        if (condition(this[i])) {
            update(this[i], i, this);
        }
    }
    return this;
};

Array.prototype.insertBy = function(
	value,
	index = NaN,
    compare = (a, b) => {
        if (a < b) {
            return -1;
        } else if (a > b) {
            return 1;
        } else {
            return 0;
        }
    }
) {
    if (this.length == 0) {
        this[0] = value;
        return this;
	}
	if(index === NaN){
		this.sort(compare);
		let isInserted = false;
		for (let i = 0; i < this.length; i++) {
			if (compare(this[i], value) < 0) {
				continue;
			} else {
				this.splice(i - 1, 0, value);
				isInserted = true;
				break;
			}
		}
		if(!isInserted){
			this.push(value);
		}
	}
	else{
		this.splice(index, 0, value);
	}

    return this;
};

Array.prototype.shadowClone = function(){
    let clone = [];
    for(let i = 0; i < this.length; i ++){
        clone.push(this[i]);
    }
    return clone;
};
