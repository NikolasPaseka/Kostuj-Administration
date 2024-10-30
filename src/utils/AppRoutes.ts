enum AppRoutes {
    HOME = '/',
    PROFILE = '/profile',
    FEAST_CATALOGUES = '/feastCatalogues',
    FEAST_CATALOGUE_DETAIL = '/feastCatalogues/:id/detail',
    FEAST_CATALOGUE_CONTENT_WINE = '/feastCatalogues/:id/content/wine',
    FEAST_CATALOGUE_CONTENT_WINERY = '/feastCatalogues/:id/content/winery',
    FEAST_CATALOGUE_EDIT = '/feastCatalogues/:id/edit',
    FEAST_CATALOGUE_CREATE = '/feastCatalogues/create',
    USERS_MANAGEMENT = '/usersManagement',
    SETTINGS = '/settings',
    SIGN_IN = '/signIn',
    REGISTER = '/register',
}

export default AppRoutes;