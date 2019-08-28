interface PromiseConstructor{
	sequenceAll(promises:Array<any>):Promise<any>;
}

Promise.sequenceAll = function(promises):Promise<any>{
	return	_.reduce(promises, (r, p)=>{
		return r.then(()=>p);
	}), Promise.resolve();
};
