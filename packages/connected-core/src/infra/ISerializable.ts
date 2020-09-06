namespace Connected {
    export interface ISerializable {
        serialize(): string;
        deserialize(data: string): string;
    }
}
