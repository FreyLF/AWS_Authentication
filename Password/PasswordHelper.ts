import {Auth} from "aws-amplify";

/**
 * This class provides methods to handle passwords, such as changing password and forgetting password.
 * @author Fernando Lerner Borges
 */
export class PasswordHelper {
    constructor() {}

    /**
     * Change user's password. This user must be **authenticated**.
     * @param oldPassword: Current password.
     * @param newPassword: Desired password.
     * @returns: Success promise if all goes right.
     */
    public async changePassword(oldPassword:string, newPassword:string) {
        try {
            const user = await Auth.currentAuthenticatedUser()
            return await Auth.changePassword(user, oldPassword, newPassword)
        } catch (error) {
            console.log("ERROR changing password :( >>> " + error)
            return error;
        }
    }

    /**
     * First step of gaining access to the account after losing the password.
     * Sends a code to user's email to be used to change password.
     * @param username: Account's user name.
     * @returns: A promise.
     */
    public async forgotPasswordGetCode(username:string) {
        try {
            let promise = await Auth.forgotPassword(username);
            console.log(promise);
            return promise;
        }catch (error) {
            console.log("ERROR on forgot password get code :( >>> " + error);
            return error;
        }
    }

    /**
     * **Second step** of gaining access to the account after losing the password.
     * Set account password to a new one.
     * @param username: Account's user name.
     * @param code: Code sent to user's email.
     * @param newPassword: Desired new password.
     * @returns: A promise.
     */
    public async forgotPasswordUseCode(username:string, code:string, newPassword:string) {
        try {
            let promise = Auth.forgotPasswordSubmit(username, code, newPassword);
            return promise;
        } catch (error) {
            console.log("ERROR on forgot password use code :( >>> " + error);
            return error;
        }
    }
}