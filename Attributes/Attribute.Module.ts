import {Module} from "@nestjs/common";
import {AttributeHelper} from "./AttributeHelper";
import {AttributeController} from "./Attribute.Controller";

@Module({
    providers:[AttributeHelper],
    controllers:[AttributeController]
})
export class AttributeModule {}