
export class SocketMsg {

    private message : string;
    private command : string;

    constructor(message : string, command? : string) {
        this.message = message;
        this.command = command;
    }
}
