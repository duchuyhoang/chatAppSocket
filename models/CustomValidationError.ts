
export interface FieldErrors{
    field:string,
    errors:string[]
}


export class CustomValidationError extends Error{
    public status:number;
    public fieldsError:FieldErrors[]
    constructor(message:string,status:number,fieldsError:FieldErrors[]){
        super(message);
        this.status=status;
        this.fieldsError=fieldsError;
    }
}