import { container } from "tsyringe";
import { AuthRoute } from "./routes";
import { FileRoute } from "./routes/file.routes";
import { MemoRoute } from "./routes/memo.routes";
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
        container.resolve(MemoRoute)
    ];
}
