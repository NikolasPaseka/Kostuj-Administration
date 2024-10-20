export enum AuthorizationRoles {
    SUPER_ADMIN = 100,
    ADMIN = 200,
    WINERY = 300,
    USER = 400
}

export const authorizationRolesArray = [
    { value: AuthorizationRoles.SUPER_ADMIN, label: "Super Admin" },
    { value: AuthorizationRoles.ADMIN, label: "Admin" },
    { value: AuthorizationRoles.WINERY, label: "Winery" },
    { value: AuthorizationRoles.USER, label: "User" }
]