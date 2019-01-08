const bcrypt = require('bcryptjs');

module.exports = {
    register: async (req, res) => {
        const {username, password, isAdmin} = req.body;
        const db = req.app.get('db');
        let user = await db.get_user({username: username})
        if(user.length === 0) {
            //user doesn't exist
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt)
            const user = await db.register_user(isAdmin, username, hash)
            req.session.user = {
                isAdmin: user[0].is_admin,
                username: user[0].username,
                id: user[0].id
            }
            res.status(201).send({message: req.session.user})
        }else {
            return res.status(409).send({message: 'Username taken'})
        }
    },

    login: async (req,res) => {
        const {username, password} = req.body;
        const db = req.app.get('db');
        let foundUser = await db.get_user({username:username})
        const user = foundUser[0];
        if(!user){
            return res.status(401).send('User not found. Please register as a new user before logging in.')
        }
        const isAuthenticated = bcrypt.compareSync(password, user.hash);
        if(!isAuthenticated){
            return res.status(403).send('Incorrect Password')
        }
        req.session.user = {
            isAdmin: user.is_admin,
            id: user.id,
            username: user.username
        }
        return res.send(req.session.user)
    },

    logout: async(req,res) => {
        req.session.destroy()
        res.status(200).send('Logged out')
    },

}

