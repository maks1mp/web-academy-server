const {COLLECTIONS} = require('../constants');
const {errorHandler} = require('../middlewares');
const DBResponseParser = require('../utils/db');
const Responses = require('../utils/responses');
const bcrypt = require('bcrypt');
const {ObjectID} = require('mongodb');

class Users {
    bet(req, res) {
        const userData = req.body,
            {email} = userData;

        global.db.collection(COLLECTIONS.USERS).findOne({email})
            .then(user => {
                if (user) {
                    const {_id} = user;

                    global.db.collection(COLLECTIONS.USERS).updateOne({_id: ObjectID(_id)}, {
                        $set: {betOnCurrent: (user.betOnCurrent || 0) + 100, didBet: true}
                    },  { upsert: true })
                    .then(status => {
                        status.modifiedCount
                            ? res.status(200).send(Responses.success())
                            : res.status(404).send(Responses.error())
                    })
                }
            })
            .catch(e => errorHandler(e, req, res));
    }

    login(req, res) {
        const userData = req.body,
            {email, password} = userData;

        if (!email || !password) {
            return errorHandler({message: '[email, pasword] is required for new user'}, req, res);
        }

        global.db.collection(COLLECTIONS.USERS).findOne({
            email
        })
        .then(user => {
            if (!user) {
                res.status(404).send(Responses.error({message: `Not found user with ${email} email`}))
            } else {
                const {password: hashPassword} = user;

                if (bcrypt.compareSync(password, hashPassword)) {
                    res.status(202).send(Responses.success(DBResponseParser.data({
                        sessionId: Date.now() + '_' +  user._id
                    })));
                } else {
                    res.status(400).send(Responses.error({message: 'Incorrect password'}))
                }
            }
        })
        .catch(e => errorHandler(e, req, res));
    }

    add(req, res) {
        const userData = req.body,
            {name, email, password} = userData;

        if (!name || !email || !password) {
            return errorHandler({message: '[name, email, pasword] is required for new user'}, req, res);
        }

        global.db.collection(COLLECTIONS.USERS).findOne({email})
            .then(user => {
                if (user) {
                    res.status(404).send(Responses.error({error: {message: 'User with this email already exists'}}))
                } else {
                    global.db.collection(COLLECTIONS.USERS).insertOne({
                        name,
                        email,
                        betOnCurrent: 0,
                        didBet: false,
                        password: bcrypt.hashSync(password, 10)
                    })
                    .then(dbResult => {
                        if (dbResult.insertedId) {
                            res.status(201).send(Responses.success());
                        } else {
                            throw new Error({message: 'Cant create new user'});
                        }
                    })
                    .catch(e => errorHandler(e, req, res));
                }
            })
            .catch(e => errorHandler(e, req, res));
    }

    getOne(req, res) {
        const {id} = req.params

        global.db.collection(COLLECTIONS.USERS)
            .findOne({_id: ObjectID(id)})
            .project({name: 1, email: 1, didBet: 1, betOnCurrent: 1})
            .then(user => res.status(200).send(Responses.success(DBResponseParser.data(user))))
            .catch(e => errorHandler(e, req, res));
    }

    getAll(req, res) {
        global.db.collection(COLLECTIONS.USERS)
            .find({})
            .project({name: 1, email: 1, didBet: 1, betOnCurrent: 1})
            .toArray()
            .then(users => res.status(200).send(Responses.success(DBResponseParser.data(users))))
            .catch(e => errorHandler(e, req, res));
    }

    delete(req, res) {
        const {id} = req.params;

        global.db.collection(COLLECTIONS.USERS).deleteOne({_id: ObjectID(id)})
        .then(dbResult => {
            if (dbResult.deletedCount > 0) {
                res.status(201).send(Responses.success());
            } else {
                res.status(404).send(Responses.error({message: 'User not found'}));
            }
        })
        .catch(e => errorHandler(e, req, res));
    }
}

module.exports = new Users();