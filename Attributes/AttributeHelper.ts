import {Auth} from "aws-amplify";

/**
 * This class provides methods to handle user attributes, such as name, email, phone number and others.
 * @author Fernando Lerner Borges
 */
export class AttributeHelper {
    constructor() {}

    /**
     * Used to check which attributes the user has.
     * This function can be used without being logged if you provide the user, otherwise you need to be logged.
     * @param user: **Optional**, object containing all information from the user (AWS Cognito format).
     * @returns: List of attributes.
     */
    public async getUserAttributes() {
        const user = await Auth.currentAuthenticatedUser();
        console.log("Attributes: " + user.attributes);
        return user.attributes;
    }

    /**
     * Update an existing attribute from the **authenticated** user.
     * @param attribute: Object containing the **name** of the attribute to be changed and the **value** to change it to.
     * @param user: **Optional** object from Cognito. If you provide it, the process will be faster.
     * @returns: Promise if success, error otherwise.
     */
    public async updateUserAttribute(attribute:{name:string, value:any}, user?:any) {
        try {
            if(typeof user == "undefined" ) {
                user = await Auth.currentAuthenticatedUser();
            }
            let promise = await Auth.updateUserAttributes(user, {[attribute.name]:attribute.value});
            console.log(promise);
            return promise;

        } catch (error) {
            console.log("ERROR updating user email :( >>> " + error);
            return error;
        }
    }

    /**
     * Delete a **not required** attribute from the **authenticated** user.
     * */
    public async deleteUserAttribute(attributeName:string) {
        try {
            const user = await Auth.currentAuthenticatedUser();
            let promise = await Auth.deleteUserAttributes(user, [attributeName]);
            return promise;
        } catch (error) {
            console.log("ERROR deleting user attribute " + attributeName + " :( >>> " + error);
            return error;
        }

    }

    /**
     * Send a verification code to user's email.
     * @returns: Success or Error.
     */
    public async verifyUserEmail() {
        try {
            const user = await Auth.currentAuthenticatedUser();
            let promise = await Auth.verifyUserAttribute(user, "email");
            return promise;
        } catch (error) {
            console.log("ERROR verifying user's email :( >>> " + error);
            return error;
        }
    }

    /**
     * Consume verification code and verify the user's email
     * @param code: Verification code sent to user's email.
     * @returns: Success or Error.
     */
    public async verifyUserEmailSubmit(code:string) {
        try {
            const user = await Auth.currentAuthenticatedUser();
            let promise = await Auth.verifyUserAttributeSubmit(user, "email", code);
            if (promise == "SUCCESS") {
                this.updateUserAttribute({name:"email_verified",value:true}, user)
            }
            return promise;
        } catch (error) {
            console.log("ERROR using code to verify user's email :( >>> " + error);
            return error;
        }
    }

}