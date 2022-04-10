import { container } from "tsyringe";
import { AuthRoutes } from "./routes";
import { AuthenticationService, IAuthenticationService } from "./services/authentication.services";


export default function resolveContainer(){
    
    container.register('AuthenticationService', {useClass: AuthenticationService});

    return [
        container.resolve(AuthRoutes)
    ];
}
