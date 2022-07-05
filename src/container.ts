import { container } from "tsyringe";
import { AuthRoute } from "./routes";
import { FileRoute } from "./routes/file.routes";
import { InventoryRoute } from "./routes/inventory.routes";
import { MemoRoute } from "./routes/memo.routes";
import { MessageRoute } from "./routes/message.routes";
import { RoleRoute } from "./routes/role.routes";
import { UserRoute } from "./routes/user.routes";
import { AuthenticationService, IAuthenticationService } from "./services/authentication.services";


export default function resolveContainer(){
    
    container.register('AuthenticationService', {useClass: AuthenticationService});

    return [
        container.resolve(AuthRoute),
        container.resolve(FileRoute),
        container.resolve(RoleRoute),
        container.resolve(UserRoute),
        container.resolve(MemoRoute),
        container.resolve(MessageRoute),
        container.resolve(InventoryRoute)
    ];
}
