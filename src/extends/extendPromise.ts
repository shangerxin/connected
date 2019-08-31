interface PromiseConstructor{
	sequenceHandleAll(dataArray:Array<any>, calculateFunc:Function, init?:any):Promise<any>;
}

Promise.sequenceHandleAll = async function(dataArray, asyncHandler, init=null):Promise<any>{
	return new Promise((res, rej)=>{
		dataArray.reduce((pre, cur)=>{
			return pre.then(()=>{
				return new Promise((res0)=>{
					asyncHandler(cur, (v)=>{
						res0(v);
					});
				});
			})
		}, Promise.resolve(init)).then(()=>{
			res();
		}).catch((e)=>{
			rej(e);
		});
	});
};