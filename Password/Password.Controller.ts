import {Body, Controller, Post} from "@nestjs/common";
import {PasswordHelper} from "./PasswordHelper";

@Controller("Password")
export class PasswordController {
    constructor(private readonly passwordHelper:PasswordHelper) {}

    /**
     * Change user's password. User needs to be logged.
     * @param passwords: Object containing 1. Old Password 2. New Password
     */
    @Post("changePassword")
    changePassword(@Body() passwords:{oldPassword:string, newPassword:string}) {
        return this.passwordHelper.changePassword(passwords.oldPassword, passwords.newPassword);
    }

    /**
     * First step of gaining access to the account after losing the password.
     * Sends a code to user's email to be used to change password.
     * @param username: Account's user name.
     * @returns: A promise.
     */
    @Post("forgotPasswordGetCode")
    forgotPasswordGetCode(@Body() payload:{username:string}) {
        return this.passwordHelper.forgotPasswordGetCode(payload.username);
    }

    /**
     * Second step of gaining access to the account after losing the password.
     * Set account password to a new one.
     * @param username: Account's user name.
     * @param code: Code sent to user's email.
     * @param newPassword: Desired new password.
     * @returns: A promise.
     */
    @Post("forgotPasswordUseCode")
    forgotPasswordUseCode(@Body() payload:{username:string, code:string, newPassword:string}) {
        return this.passwordHelper.forgotPasswordUseCode(payload.username, payload.code, payload.newPassword);
    }

}