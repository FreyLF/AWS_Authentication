import {Module} from "@nestjs/common";
import {ConnectionHelper} from "./ConnectionHelper";
import {ConnectionController} from "./Connection.Controller";

@Module({
    providers: [ConnectionHelper],
    controllers: [ConnectionController]
})
export class ConnectionModule {}