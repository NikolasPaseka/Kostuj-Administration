import { AuthorizationRoles } from "../model/AuthorizationRoles";

export class AuthorizationRoleValidator {
    private static instance: AuthorizationRoleValidator;

    private constructor() {}

    static getInstance(): AuthorizationRoleValidator {
        if (!AuthorizationRoleValidator.instance) {
            AuthorizationRoleValidator.instance = new AuthorizationRoleValidator();
        }
        return AuthorizationRoleValidator.instance;
    }
    
    hasAccessToAdministrationApp(authorization: number[]): boolean {
        return authorization.includes(AuthorizationRoles.ADMIN) 
            || authorization.includes(AuthorizationRoles.SUPER_ADMIN)
            || authorization.includes(AuthorizationRoles.WINERY);
    }
}