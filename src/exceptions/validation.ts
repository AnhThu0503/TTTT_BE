import { HttpExeption } from "./root";

export class UnprocessableEntity extends HttpExeption{
    constructor(error: any, message: string, errorCode: number){
        super(message, errorCode, 422, error)
    }
}