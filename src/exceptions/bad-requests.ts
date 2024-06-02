import {ErrorCode, HttpExeption} from './root'


export class BadRequestsException extends HttpExeption {
    constructor(message: string, errorCode: ErrorCode){
        super(message, errorCode, 400, null)
    }
}