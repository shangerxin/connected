namespace Connected {
    export class TabModel extends ModelBase {
        url: string;
        title: string;
        index: number;
        isPinned: boolean;
        constructor(tab: any) {
            super();
            this._id = tab.id;
        }
        get id(): number {
            return this._id;
        }
    }
}
