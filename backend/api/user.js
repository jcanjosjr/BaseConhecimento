const bcrypt = require('bcrypt-nodejs')


module.exports = app => {
    // import functions from validation of users.
    const { existsOrError, notExistsOrError, EqualsOrError } = app.api.validation

    // making a Cript Password
    const encryptPassword = password => {
        const salt = bcrypt.genSaltScync(10)
        return bcrypt.hashSync(password, salt)
    }

    // making the validation on user cadaster.
    const save = async (req, res) => {
        const user = { ...req.body }
        // checking url
        if(req.params.id) user.id = req.params.id

        try {
            existsOrError(user.name, 'Nome não informado.')
            existsOrError(user.email, 'E-mail não informado.')
            existsOrError(user.password, 'Senha não informada.')
            existsOrError(user.confirmPassword, 'Confirmação de senha inválida.')
            EqualsOrError(user.password, user.confirmPassword, 'Senhas não conferem.')
        
            const userFromDB = await app.db('users').where({ email: user.email }).first()
            if(!user.id) {
                notExistsOrError(userFromDB, 'Usuário já cadastrado.')
            }    
        } catch(msg) {
            return res.status(400).send(msg)
        }

        user.password = encryptPassword(user.password)
        delete user.confirmPassword

        // inserting user into database
        if(user.id) {
            app.db('users')
                .update(user)
                .where({ id: user.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('users')
                .insert(user)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    // getting all users on database
    const get = (req, res) => {
        app.db('users')
            .select('id', 'name', 'email', 'admin')
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    // getting a user using reference ID.
    const getById = (req, res) => {
        app.db('users')
            .select('id', 'name', 'email', 'admin')
            .where({ id: req.params.id })
            .first()
            .then(user => res.json(user))
            .catch(err => res.status(500).send(err))
    }

    return { save, get, getById }
}