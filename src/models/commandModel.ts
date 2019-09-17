export class CommandModel{
	type;
	args;

	static create(type, args){
		return <CommandModel>{
			type,
			args
		};
	}
}