module.exports = app => {
    
    //Token Validation!
    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)

    //Users!
    app.route('/users')
        .post(app.api.user.save)
        .get(app.api.user.get)

    //Users with ID.
    app.route('/users/:id')
        .put(app.api.user.save)
        .get(app.api.user.getById)

    // Categories!
    app.route('/categories')
        .get(app.api.category.get)
        .post(app.api.category.save)
    
    // Careful with order of routes! Categories with Tree!
    app.route('/categories/tree')
        .get(app.api.category.getTree)

    // Categories with ID!
    app.route('/categories/:id')
        .get(app.api.category.getById)
        .put(app.api.category.save)
        .delete(app.api.category.remove)
    
    // Articles!
    app.route('/articles')
        .get(app.api.article.get)
        .post(app.api.article.save)
    
    // Articles with ID!
    app.route('/articles/:id')
        .get(app.api.article.getById)
        .put(app.api.article.save)
        .delete(app.api.article.remove)

    // Articles in Categories!
    app.route('/categories/:id/articles')
        .get(app.api.article.getByCategory)
}