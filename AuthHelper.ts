import {Amplify, Auth} from "aws-amplify";
import {UserSignUpModel} from "./Connection/Model/UserSignUpModel";
import {UserLoginModel} from "./Connection/Model/UserLoginModel";

import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

/**
 * Information needed to configure the project.
 */
interface CookieConfig {
    domain:string;
    path:string;
    expires:number;
    sameSite:string;
    secure:boolean;
}
/**
 * Information needed to configure the project.
 */
interface AuthConfig {
    region:string;
    idPoolId:string;
    idPoolRegion:string;
    userPoolId:string;
    userPoolWebClientId:string;
    mandatorySignIn:boolean;
    storage:object;
    authFlowType:string;
    clientMetadata:object;
}
/**
 * Pool Configuration
 */
interface PoolConfig {
    name:string;
    config:object;
}

/**
 * Used to test new functions ... by the end this class will probably be deleted.
 */
export class AuthHelper {

    /**
     * List of user pools, the objects are configured as it would be received on a get request from AWS Cognito.
     */
    private poolList:PoolConfig[];

    constructor() {}

    //////////////////////////////////////////// Under Development Methods ////////////////////////////////////////////

    /**
     * @Returns Configurations of this project.
     */
    public getConfig() {
        return Auth.configure();
    }

    /** WORK IN PROGRESS
     * Configure the project and targeted user pool.
     */
    public config(authConfig:AuthConfig, cookieConfig:CookieConfig) {

        if(!this.configHelper(authConfig, cookieConfig)) {
            return null;
        }

        Amplify.configure({
            Auth: {

                // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
                identityPoolId: authConfig.idPoolId,

                // REQUIRED - Amazon Cognito Region
                region: authConfig.region,

                // OPTIONAL - Amazon Cognito Federated Identity Pool Region
                // Required only if it's different from Amazon Cognito Region
                identityPoolRegion: authConfig.idPoolRegion,

                // OPTIONAL - Amazon Cognito User Pool ID
                userPoolId: authConfig.userPoolId,

                // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
                userPoolWebClientId: authConfig.userPoolWebClientId,

                // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
                mandatorySignIn: authConfig.mandatorySignIn,

                // OPTIONAL - Configuration for cookie storage
                // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
                cookieStorage: {
                    // REQUIRED - Cookie domain (only required if cookieStorage is provided)
                    domain: cookieConfig.domain,
                    // OPTIONAL - Cookie path
                    path: cookieConfig.path,
                    // OPTIONAL - Cookie expiration in days
                    expires: cookieConfig.expires,
                    // OPTIONAL - See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
                    sameSite: cookieConfig.sameSite,
                    // OPTIONAL - Cookie secure flag
                    // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
                    secure: cookieConfig.secure
                },

                // OPTIONAL - customized storage object
                storage: authConfig.storage,

                // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
                authenticationFlowType: authConfig.authFlowType,

                // OPTIONAL - Manually set key value pairs that can be passed to Cognito Lambda Triggers
                clientMetadata: authConfig.clientMetadata,
            }
        });
    }

    public configTest2(){
        let config:Object = {
            "aws_project_region": "us-east-2",
            "aws_cognito_identity_pool_id": "us-east-2:af93e589-0414-41dc-8b00-49247d73c75d",
            "aws_cognito_region": "us-east-2",
            "aws_user_pools_id": "us-east-2_IXpoxywDm",
            "aws_user_pools_web_client_id": "ucar41k1i144nv19a987dg8cg",
            "oauth": {
                "domain": "servctest.auth.us-east-2.amazoncognito.com",
                "scope": [
                    "aws.cognito.signin.user.admin"
                ],
                "redirectSignIn": "http://localhost:3000",
                "redirectSignOut": "http://localhost:3000",
                "responseType": "code"
            },
            "federationTarget": "COGNITO_USER_POOLS",
            "aws_cognito_username_attributes": [],
            "aws_cognito_social_providers": [],
            "aws_cognito_signup_attributes": [
                "EMAIL"
            ],
            "aws_cognito_mfa_configuration": "OFF",
            "aws_cognito_mfa_types": [],
            "aws_cognito_password_protection_settings": {
                "passwordPolicyMinLength": 8,
                "passwordPolicyCharacters": [
                    "REQUIRES_LOWERCASE",
                    "REQUIRES_UPPERCASE",
                    "REQUIRES_NUMBERS",
                    "REQUIRES_SYMBOLS"
                ]
            },
            "aws_cognito_verification_mechanisms": [
                "EMAIL"
            ]
        };
        Auth.configure(config);
    }

    //////////////////////////////////////////// Helper Methods ////////////////////////////////////////////

    /**
     * Set default parameters for config objects to be used on the configuration of this project and user pool.
     * @Returns: true if there were no problems with the required fields.
     */
    private configHelper(authConfig:AuthConfig, cookieConfig:CookieConfig):boolean {
        if(authConfig == null) {
            return false;
        }
        // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
        if(!this.validateString(authConfig.idPoolId)) {
            return false;
        }
        // REQUIRED - Amazon Cognito Region
        if(!this.validateString(authConfig.region)) {
            return false;
        }
        // OPTIONAL - Amazon Cognito Federated Identity Pool Region
        // Required only if it's different from Amazon Cognito Region
        if(!this.validateString(authConfig.idPoolRegion)) {
            return false;
        }
        // OPTIONAL - Amazon Cognito User Pool ID
        if(!this.validateString(authConfig.userPoolId)) {
            return false;
        }
        // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
        // if(!this.testString(authConfig.userPoolWebClientId)) {
        //     authConfig.userPoolWebClientId = "DEFAULT";
        // }
        // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
        if(authConfig.mandatorySignIn == null) {
            authConfig.mandatorySignIn = true;
        }

        // OPTIONAL - Configuration for cookie storage
        // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
        if(cookieConfig == null) {
            return false;
        }
        // REQUIRED - Cookie domain (only required if cookieStorage is provided)
        if(!this.validateString(cookieConfig.domain)) {
            return false;
        }
        // OPTIONAL - Cookie path
        if(!this.validateString(cookieConfig.path)) {
            cookieConfig.path = '/';
        }
        // OPTIONAL - Cookie expiration in days
        if(cookieConfig.expires == null) {
            cookieConfig.expires = 365;
        }
        // OPTIONAL - See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
        if(!this.validateString(cookieConfig.sameSite)) {
            if(cookieConfig.sameSite != "strict") {
                if(cookieConfig.sameSite != "lax") {
                    if(cookieConfig.sameSite != "none") {
                        cookieConfig.sameSite = "strict";
                    }
                }
            }
        }
        // OPTIONAL - Cookie secure flag
        // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
        if(cookieConfig.secure == null) {
            cookieConfig.secure = true;
        }
        // OPTIONAL - customized storage object
        // if(authConfig.storage == null) {
        //     authConfig.storage = {};
        // }
        // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
        if(!this.validateString(authConfig.authFlowType)) {
            authConfig.authFlowType = "USER_SRP_AUTH";
        }
        // OPTIONAL - Manually set key value pairs that can be passed to Cognito Lambda Triggers
        if(authConfig.clientMetadata == null) {
            authConfig.clientMetadata = { myCustomKey: 'myCustomValue' };
        }
        return true;
    }

    /**
     * Initialize pre-set user pools.
     */
    private initPoolList():void {
        let pool:PoolConfig = null;

        // Test Pool 1
        pool.name = "Pool Test 1";
        pool.config = {
            "aws_project_region": "us-east-2",
            "aws_cognito_identity_pool_id": "us-east-2:af93e589-0414-41dc-8b00-49247d73c75d",
            "aws_cognito_region": "us-east-2",
            "aws_user_pools_id": "us-east-2_IXpoxywDm",
            "aws_user_pools_web_client_id": "ucar41k1i144nv19a987dg8cg",
            "oauth": {
                "domain": "servctest.auth.us-east-2.amazoncognito.com",
                "scope": [
                    "aws.cognito.signin.user.admin"
                ],
                "redirectSignIn": "http://localhost:3000",
                "redirectSignOut": "http://localhost:3000",
                "responseType": "code"
            },
            "federationTarget": "COGNITO_USER_POOLS",
            "aws_cognito_username_attributes": [],
            "aws_cognito_social_providers": [],
            "aws_cognito_signup_attributes": [
                "EMAIL"
            ],
            "aws_cognito_mfa_configuration": "OFF",
            "aws_cognito_mfa_types": [],
            "aws_cognito_password_protection_settings": {
                "passwordPolicyMinLength": 8,
                "passwordPolicyCharacters": [
                    "REQUIRES_LOWERCASE",
                    "REQUIRES_UPPERCASE",
                    "REQUIRES_NUMBERS",
                    "REQUIRES_SYMBOLS"
                ]
            },
            "aws_cognito_verification_mechanisms": [
                "EMAIL"
            ]
        };
        this.poolList.push(pool);

        // Test Pool 2
        pool = null;
        pool.name = "Pool Test 2";
        pool.config = {
            userPoolId: "us-east-2_jk20LURJy",
            userPoolWebClientId: "ucar41k1i144nv19a987dg8cg",
            region: "us-east-2",
            identityPoolId: "us-east-2:af93e589-0414-41dc-8b00-49247d73c75d",
            identityPoolRegion: "us-east-2",
            mandatorySignIn: false,
            aws_project_region: "us-east-2",
            aws_cognito_identity_pool_id: "us-east-2:af93e589-0414-41dc-8b00-49247d73c75d",
            aws_cognito_region: "us-east-2",
            aws_user_pools_id: "us-east-2_IXpoxywDm",
            aws_user_pools_web_client_id: "ucar41k1i144nv19a987dg8cg",
            oauth: {
                domain: "servctest.auth.us-east-2.amazoncognito.com",
                scope: [
                    "aws.cognito.signin.user.admin"
                ],
                redirectSignIn: "http://localhost:3000",
                redirectSignOut: "http://localhost:3000",
                responseType: "code"
            },
            federationTarget: "COGNITO_USER_POOLS",
            aws_cognito_username_attributes: [],
            aws_cognito_social_providers: [],
            aws_cognito_signup_attributes: [
                "EMAIL"
            ],
            aws_cognito_mfa_configuration: "OFF",
            aws_cognito_mfa_types: [],
            aws_cognito_password_protection_settings: {
                passwordPolicyMinLength: 8,
                passwordPolicyCharacters: [
                    "REQUIRES_LOWERCASE",
                    "REQUIRES_UPPERCASE",
                    "REQUIRES_NUMBERS",
                    "REQUIRES_SYMBOLS"
                ]
            },
            aws_cognito_verification_mechanisms: [
                "EMAIL"
            ]
        }

    }

    /**
     * Check string validity.
     * @Returns: false if string is empty, null, or undefined.
     */
    private validateString(str:string):boolean {
        if((str == "") || (str == null) || (typeof str == "undefined")) {
            return false;
        }
        return true;
    }

}