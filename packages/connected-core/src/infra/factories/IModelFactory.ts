namespace Connected {
    export interface IModelFactory {
        Create(): ModelBase;
        Build(...args: any): ModelBase;
    }
}
