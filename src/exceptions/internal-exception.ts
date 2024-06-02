import { HttpExeption } from "./root";

export class InternalException extends HttpExeption{
    constructor(message: string, errors: any, errorCode: number){
        super(message, errorCode, 500, errors)
    }
}