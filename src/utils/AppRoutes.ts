enum AppRoutes {
    HOME = '/home',
    PROFILE_AND_SETTINGS = '/profileAndSettings',
    FEAST_CATALOGUES = '/feastCatalogues',
    FEAST_CATALOGUE_DETAIL = '/feastCatalogues/:id/detail',
    FEAST_CATALOGUE_CONTENT_WINE = '/feastCatalogues/:id/content/wine',
    FEAST_CATALOGUE_CONTENT_WINERY = '/feastCatalogues/:id/content/winery',
    FEAST_CATALOGUE_EDIT = '/feastCatalogues/:id/edit',
    FEAST_CATALOGUE_CREATE = '/feastCatalogues/create',
    WINERIES_MANAGEMENT = '/wineriesManagement',
    USERS_MANAGEMENT = '/usersManagement',
    SETTINGS = '/settings',
    SIGN_IN = '/signIn',
    REGISTER = '/register',
    NO_AUTH_PAGE = '/noAuth',
}

export default AppRoutes;