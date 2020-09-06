namespace Connected {
    export class TabGroupModel extends ModelBase {
        protected _tabs: Array<TabModel>;
        protected _focusedTabIndex: number;
        constructor() {
            super();
        }

        get tabs(): Array<TabModel> | null {
            return this._tabs;
        }

        get focusedTabIndex(): number {
            return this._focusedTabIndex;
        }
    }
}
