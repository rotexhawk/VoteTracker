export default class ServerError {
    constructor(errorCode, message, details) {
        this.status = errorCode;
        this.message = message;
        this.details = details;
    }
}
