/**
 * Used for creating new users on cognito's user pool.
 * Add more fields as needed, but remember to update the AuthHelper.signUp
 */
export class UserSignUpModel {
    public constructor(
        public username:string,
        public password:string,
        public email:string
    ) {}
}