interface PromiseConstructor {
    sequenceHandleAll(
        dataArray: Array<any>,
        calculateFunc: Function,
        init?: any
    ): Promise<any>;
}

Promise.sequenceHandleAll = async function(
    dataArray,
    asyncHandler,
    init = null
): Promise<any> {
    return new Promise((res, rej) => {
        dataArray
            .reduce((pre, cur) => {
                return pre.then(ret => {
                    return new Promise(res0 => {
                        asyncHandler(
                            cur,
                            v => {
                                res0(v);
                            },
                            ret
                        );
                    });
                });
            }, Promise.resolve(init))
            .then(result => {
                res(result);
            })
            .catch(e => {
                rej(e);
            });
    });
};
