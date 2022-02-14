import {Module} from "@nestjs/common";
import {PasswordHelper} from "./PasswordHelper";
import {PasswordController} from "./Password.Controller";

@Module({
    providers: [PasswordHelper],
    controllers: [PasswordController]
})
export class PasswordModule {}