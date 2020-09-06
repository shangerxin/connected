namespace Connected {
    export class SessionModel extends ModelBase implements ISerializable {
        serialize(): string {
            throw new Error("Method not implemented.");
        }
        deserialize(data: string): string {
            throw new Error("Method not implemented.");
        }
        name: string;
        tabs: Array<TabModel>;
        windows: Array<WindowModel>;
    }
}
