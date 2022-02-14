import {Amplify, Auth} from "aws-amplify";
import {UserLoginModel} from "./Model/UserLoginModel";
import {UserSignUpModel} from "./Model/UserSignUpModel";

// import awsconfig from './../aws-exports';
// Amplify.configure(awsconfig);

/**
 * Object to help server decide if user can be logged.
 * @param needMFA: false if MFA is not needed or was done correctly.
 * @param newPassword: true if user needs to change password.
 */
interface LoginFlags {
    /** If **true**, you will need to use the method **confirmLogin**. */
    needMFA:boolean,
    /** If **true**, you will need to provide a new password.*/
    newPassword:boolean,
}

/**
 * This class provides methods to handle connection to AWS server, such as login/out, sign up and others.
 * @author Fernando Lerner Borges
 */
export class ConnectionHelper {

    private userMap = new Map<string, Object>();

    constructor() {}

    /**
     * Perform login process.
     * If you are using MFA you will need to save the uuid returned so you can call **confirmLogin** after getting the code.
     * @param credentials: Object with credentials for login.
     * @return Object: {LoginFlags, User} | {LoginFlags, uuid}
     */
    public async login(credentials:UserLoginModel) {
        const username = credentials.username;
        const password = credentials.password;
        try {
            const user = await Auth.signIn(username, password);
            let id = "";

            // Initialize flag object.
            let flags:LoginFlags = new class implements LoginFlags {
                needMFA: boolean = false;
                newPassword: boolean = false;
            };

            // Check if MFA is needed.
            if(user.challengeName === 'SMS_MFA' ||
                user.challengeName === 'SOFTWARE_TOKEN_MFA') {
                flags.needMFA = true;

                // Create a new entry on the userMap.
                id = this.generateUUID();
                this.userMap.set(id, user);
            }

            // Check if user needs to make a new password.
            if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
                flags.newPassword = true
            }

            // If you are using MFA, you will get a UUID back instead of the user.
            if(flags.needMFA) {
                return {flags, uuid:id}
            }

            return {flags, user};
        }
        catch (error) {
            console.log('ERROR signing in :( >>> ', error);
            return error;
        }
    }

    /**
     * Perform the Multi Factor Authentication.
     * @param uuid: UUID you got from **login**.
     * @param code: This must have been sent to the user's phone.
     */
    public async confirmLogin(uuid:string, code:string) {
        try {
            const loggedUser = await Auth.confirmSignIn(this.userMap.get(uuid), code, "SMS_MFA");
            // If you managed to use that, delete the user from the map.
            this.userMap.delete(uuid);
            return loggedUser;
        } catch (error) {
            console.log('ERROR confirming login :( >>> ', error);
            return error;
        }

    }

    /**
     * Revokes Amazon Cognito tokens if the application is online.
     * Token cannot be used anymore to generate new Access and Id Tokens.
     * @Returns A success or error.
     */
    public async logout() {
        try {
            const result = await Auth.signOut();
            return result;
        } catch (error) {
            console.log('ERROR signing out :( >>> ', error);
            return error;
        }
    }

    /**
     * Create a new user in the Amazon Cognito UserPool.
     * @param user: Object with user's information.
     * @example: {username, password, email, phone, favorite_game}
     * @return: Object of type ISignUpResult with a CognitoUser. CognitoUser contains a userSub which is a unique identifier of the authenticated user; the userSub is not the same as the username.
     */
    public async signUp(user:UserSignUpModel) {
        const username = user.username;
        const password = user.password;
        const email = user.email;
        try {
            const { user } = await Auth.signUp({
                username,
                password,
                // Optional attributes.
                attributes: {
                    email,
                    //phone_number,
                    // optional - E.164 number convention
                    // other custom attributes
                }
            });
            console.log(user);
            return user;
        } catch (error) {
            console.log('ERROR signing up :( >>> ', error);
            return error;
        }
    }

    /**
     * Confirm the sign-up after with code from the user (_provided that you enabled this feature_).
     * @param username: User name
     * @param code: Verification code received via selected method (email, or phone)
     * @return: Promise if successful.
     */
    public async confirmSignUp(username:string, code:string) {
        try {
            return await Auth.confirmSignUp(username, code);
        } catch (error) {
            console.log('ERROR confirming sign up :( >>> ', error);
            return error;
        }
    }

    /**
     * Used to check if a user is logged in when the page is loaded.
     * Will throw an error if there is no user logged in.
     * Should be used after user attempts to login.
     * @returns: The user in JSON format or error.
     */
    public async getAuthenticatedUser() {
        try {
            let user = Auth.currentAuthenticatedUser({
                // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
                bypassCache: false
            });
            console.log(user);
            return user;
        } catch (error) {
            console.log("ERROR trying to get currently authenticated user :( >>> " + error);
            return error;
        }
    }

    /**
     * Tels the MFA method being used.
     */
    public async getPreferredMFA() {
        const user = await Auth.currentAuthenticatedUser();
        let promise = await Auth.getPreferredMFA(user);
        console.log(promise);
        return promise;
    }

    /**
     * @Returns Configurations of this project.
     */
    public getConfig() {
        return Auth.configure();
    }

    /**
     * Generates an unique id for the **userMap**.
     */
    private generateUUID():string {
        const crypto = require("crypto");
        let id = crypto.randomBytes(16).toString("hex");
        // Check if key already exists.
        if(this.userMap.has(id)) {
            // Keep trying until you get an unique id.
            id = this.generateUUID()
        }
        return id;
    }
}