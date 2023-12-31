import { validate } from "class-validator";
import { AuthCredential } from "../entities/authCredential";

export class AuthValidate {

    // atributes
    public credentials:AuthCredential;
    public listErrors:any[];

    //constructor
    constructor(credentials:AuthCredential) {
        this.credentials = credentials;
        this.listErrors = [];
    }

    //public methods
    public async invalidIfHasErrors() {
        await this.validate();

        if (!this.foundedErrors()){
            return;
        }

        throw({
            http_status:422,
            validations:this.errors()
        })
    }

    //protected methods
    protected async validate() {
        this.listErrors = await validate(this.credentials);
    }

    protected errors():any[] {
        return this.listErrors.map((error) => {
            let property = error.property;
            let errorMessages = Object.values(error.constraints);
            return {
                property,
                errorMessages
            }
        });
    }

    protected foundedErrors():boolean {
        return this.listErrors.length > 0;
    }

}