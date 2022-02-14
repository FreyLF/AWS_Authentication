import {Body, Controller, Get, Post} from "@nestjs/common";
import {UserLoginModel} from "./Model/UserLoginModel";
import {ConnectionHelper} from "./ConnectionHelper";
import {UserSignUpModel} from "./Model/UserSignUpModel";

@Controller("Connection")
export class ConnectionController {
    constructor(private readonly connectionHelper:ConnectionHelper) {}

    /**
     * Perform login process.
     * If you are using MFA you will need to save the uuid returned so you can call **confirmLogin** after getting the code.
     * @param credentials: Object with credentials for login.
     * @return Object: {LoginFlags, User} | {LoginFlags, uuid}
     */
    @Post("login")
    login(@Body() credentials:UserLoginModel) {
        return this.connectionHelper.login(credentials);
    }

    /**
     * Perform the Multi Factor Authentication.
     * @param payload: Object containing uuid from login, and code sent to the user.
     */
    @Post("confirmLogin")
    confirmLogin(@Body() payload:{uuid:string, code:string}) {
        return this.connectionHelper.confirmLogin(payload.uuid, payload.code);
    }

    /**
     * Revokes Amazon Cognito tokens if the application is online.
     * Token cannot be used anymore to generate new Access and Id Tokens.
     * @Returns A success or error.
     */
    @Get("logout")
    logout() {
        return this.connectionHelper.logout();
    }

    /**
     * Create a new user in the Amazon Cognito UserPool.
     * @param user: Object with user's information.
     * @return: Object of type ISignUpResult with a CognitoUser. CognitoUser contains a userSub which is a unique identifier of the authenticated user; the userSub is not the same as the username.
     */
    @Post("signUp")
    signUp(@Body() user:UserSignUpModel) {
        return this.connectionHelper.signUp(user);
    }

    /**
     * If you enabled multi-factor authentication, confirm the sign-up after retrieving a confirmation code from the user.
     * @param confirmationObj: Object containing **username** and **verification code** received via selected method (email, or phone).
     * @return: Promise if successful.
     */
    @Post("confirmSignUp")
    confirmSignUp(@Body() confirmationObj:{username:string, code:string}) {
        return this.connectionHelper.confirmSignUp(confirmationObj.username, confirmationObj.code);
    }

    /**
     * Used to check if a user is logged in when the page is loaded.
     * Will throw an error if there is no user logged in.
     * Should be used after user attempts to login.
     * @returns: The user in JSON format or error.
     */
    @Get("getAuthenticatedUser")
    getAuthenticatedUser() {
        return this.connectionHelper.getAuthenticatedUser();
    }

    /**
     * @returns MFA used by this user.
     */
    @Get("getPreferredMFA")
    getPreferredMFA() {
        return this.connectionHelper.getPreferredMFA();
    }

    /**
     * @Returns Configurations of this project.
     */
    @Get("getConfig")
    getConfig() {
        return this.connectionHelper.getConfig();
    }
}