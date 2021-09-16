const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    // auth of user logging.
    const signin = async (req, res) => {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send('Informe Usuário e Senha!')
        }

        // getting user
        const user = await app.db('users')
            .where({ email: req.body.email })
            .first()
        
        // validating user
        if(!user) return res.status(400).send('Usuário não encontrado!')
     
        const isMatch = bcrypt.compareSync(req.body.password, user.password)
        if(!isMatch) return res.status(401).send('E-mail e Senha não conferem!')

        const now = Math.floor(Date.now() / 1000)

        // generate a token.
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            admin: user.admin,
            iat: now,
            exp: now + (60 * 60 * 24 * 3)
        }

        res.json({
            ...payload,
            token: jwt.encode(payload, authSecret)
        })
    }

    // validating token.
    const validateToken = async (req, res) => {
        const userData = req.body || null
        try {
            if(userData) {
                const token = jwt.decode(userData.token, authSecret)
                if(new Date(token.exp * 1000) > new Date()) {
                    return res.send(true)
                }
            }
        } catch(e) {
            // Problema com o Token!
        }

        res.send(false)
    }

    return { signin, validateToken }
}