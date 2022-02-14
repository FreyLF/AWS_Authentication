import {Body, Controller, Get, Post} from "@nestjs/common";
import {AttributeHelper} from "./AttributeHelper";

@Controller("Attributes")
export class AttributeController {
    constructor(private readonly attributeHelper:AttributeHelper) {}

    @Get("getUserAttributes")
    getUserAttributes() {
        return this.attributeHelper.getUserAttributes();
    }

    @Post("updateUserAttribute")
    updateUserEmail(@Body() attribute:{name:string, value:string}) {
        return this.attributeHelper.updateUserAttribute(attribute);
    }

    @Post("deleteUserAttribute")
    deleteUserAttribute(@Body() payload:{attributeName:string}) {
        return this.attributeHelper.deleteUserAttribute(payload.attributeName);
    }

    @Get("verifyUserEmail")
    verifyUserEmail() {
        return this.attributeHelper.verifyUserEmail();
    }

    @Post("verifyUserEmailSubmit")
    verifyUserAttributeSubmit(@Body() payload:{code:string}) {
        return this.attributeHelper.verifyUserEmailSubmit(payload.code);
    }
}