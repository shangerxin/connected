namespace Connected {
    export abstract class ModelBase {
        protected _id: number;
        constructor() {}
        get id() {
            return this._id;
        }
    }
}
