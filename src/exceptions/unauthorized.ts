import {ErrorCode, HttpExeption} from './root'


export class UnauthorizedException extends HttpExeption {
    constructor(message: string, errorCode: number, errors?: any){
        super(message, errorCode, 401, null)
    }
}