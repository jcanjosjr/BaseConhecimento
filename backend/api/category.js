module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation
    
    // saving a category.
    const save = (req, res) => {
        const category = { ...req.body }
        if(req.params.id) category.id = req.params.id
    
        try {
            existsOrError(category.name, 'Nome não informado.')
        } catch(msg) {
            return res.status(400).send(msg)
        }
    
        if(category.id) {
            app.db('categories')
                .update(category)
                .where({ id: category.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('categories')
                .insert(category)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    // a category just are delete, if don't have any articles or subcategory on there.
    const remove = async (req, res) => {
        try {
            existsOrError(req.params.id, 'Código da Categoria não informado.')

            // verifying categories associates.
            const subcategory = await app.db('categories')
                .where({ parendId: req.params.id })
            notExistsOrError(subcategory, 'Categoria possui subcategorias.')

            // verifying articles associates.
            const articles = await app.db('articles')
                .where({ categoryId: req.params.id })
            notExistsOrError(articles, 'Categoria possui artigos.')

            // verifying if categorie exists.
            const rowDeleted = await app.db('categories')
                .where({ id: req.params.id }).del()
            existsOrError(rowDeleted, 'Categoria não foi encontrada.')

            req.status(204).send()
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

    // making a relative path about categories and categories associates.
    const withPath = categories => {
        const getParent = (categories, parentId) => {
            const parent = categories.filter(parent => parent.id === parentId)
            return parent.length ? parent[0] : null
        }

        const categoriesWithPath = categories.map(category => {
            let path = category.name
            let parent = getParent(categories, category.parentId)
    
            // looking for more parents on categories.
            while(parent) {
                path = `${parent.name} > ${path}`
                parent = getParent(categories, parent.parendId)
            }
    
            return { ...category, path }
        })

        // ordering the path.
        categoriesWithPath.sort((a, b) => {
            if(a.path < b.path) return -1
            if(a.path > b.path) return 1
            return 0
        })

        return categoriesWithPath
    }

    // method get from category.
    const get = (req, res) => {
        app.db('categories')
            .then(categories => res.json(withPath(categories)))
            .catch(err => res.status(500).send(err))
    }

    // method get by id.
    const getById = (req, res) => {
        app.db('categories')
        .where({ id: req.params.id })
        .first()
        .then(category => res.json(category))
        .catch(err => res.status(500).send(err))
    }

    // transforms a list(array) of categorys on a tree struct
    const toTree = (categories, tree) => {
        if(!tree) tree = categories.filter(c => !c.parentId)
        tree = tree.map(parentNode => {
            const isChild = node => node.parentId == parentNode.id
            parentNode.children = toTree(categories, categories.filter(isChild))
            return parentNode
        })
        return tree
    }

    // method to get tree
    const getTree = (req, res) => {
        app.db('categories')
            .then(categories => res.json(toTree(withPath(categories))))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById, getTree }

}

