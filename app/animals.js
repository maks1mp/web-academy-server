const {COLLECTIONS} = require('../constants');
const {errorHandler} = require('../middlewares');
const DBResponseParser = require('../utils/db');
const Responses = require('../utils/responses');
const {ObjectID} = require('mongodb');

class Animals {
    constructor() {
        this.values = ['image', 'title', 'description', 'time', 'price', 'force', 'addedBy'];
    }

    isValidData(data) {
        return this.values.every(val => Object.keys(data).includes(val));
    }

    getAll(req, res) {
        global.db.collection(COLLECTIONS.ANIMALS).find({}).toArray()
            .then(animals => res.status(200).send(Responses.success(DBResponseParser.data(animals))))
            .catch(e => errorHandler(e, req, res));
    }

    insertToProgress(animalData) {
        return global.db.collection(COLLECTIONS.PROGRESS).find({}).toArray()
            .then(progressAnimal => {
                if (progressAnimal.length === 0) {
                    return global.db.collection(COLLECTIONS.PROGRESS).insertOne(animalData)
                        .then(res => {
                            return global.db.collection(COLLECTIONS.ANIMALS).deleteOne({_id: ObjectID(animalData.animal._id)})
                        })
                } else {
                    return null;
                }
            })
            .then(result => result ? result.deletedCount : result)
    }

    getPurchased(req, res) {
        return global.db.collection(COLLECTIONS.PURCHASED).find({}).toArray()
            .then(animals => res.status(200).send(Responses.success(DBResponseParser.data(animals))))
            .catch(e => errorHandler(e, req, res));
    }

    purchaseCurrentAnimal(purchaser) {
        return global.db.collection(COLLECTIONS.PROGRESS).find({}).toArray()
            .then(result => {
                if (result.length === 0) {
                    return [null, Promise.resolve()];
                } else {
                    const [item] = result;

                    return [
                        item,
                        global.db.collection(COLLECTIONS.PROGRESS).deleteOne({_id: ObjectID(item._id)})
                    ];
                }
            })
            .then(([item, dbResult]) => {
                let status = false;

                return [item, dbResult.then(result => {
                    if (result) {
                        const {deletedCount} = result;

                        status = deletedCount > 0
                    }

                    return status;
                })];
            })
            .then(([item, dbStatus]) => {
                return dbStatus.then(status => {
                    if (status) {
                        return global.db.collection(COLLECTIONS.PURCHASED).insertOne({
                            ...item,
                            purchaser
                        });
                    } else {
                        return null;
                    }
                });
            })
            .then(result => result ? result.insertedId : result);
    }

    buyAnimal(req, res) {
        const purchaserData = req.body;

        this.purchaseCurrentAnimal(purchaserData)
            .then(result => {
                return global.db.collection(COLLECTIONS.USERS).updateMany({}, {$set: {
                    didBet: false,
                    betOnCurrent: 0
                }}, {upsert: true});
            })
            .then(result => {
                return global.db.collection(COLLECTIONS.ANIMALS).find({}).toArray().then(animals => {
                    const [result] = animals;

                    console.log(result);

                    if (result) {
                        const {addedBy, ...rest} = result;

                        return this.insertToProgress({animal: rest, addedBy});
                    }
                })
            })
            .then(result => {
                if (result) {
                    res.status(200).send(Responses.success())
                } else {
                    res.status(404).send(Responses.error({message: 'Error while purchasing animal'}))
                }
            })
            .catch(e => errorHandler(e, req, res))
    }

    getCurrentSellingAnimal() {
        return global.db.collection(COLLECTIONS.PROGRESS).find({}).toArray()
            .then(result => {
                let data = null

                if (result.length > 0) {
                    ([data] = result);
                }

                return data;
            });
    }

    getInProgress(req, res) {
        this.getCurrentSellingAnimal()
            .then(data => res.status(200).send(Responses.success(DBResponseParser.data(data))))
            .catch(e => errorHandler(e, req, res));
    }

    add(req, res) {
        const animalData = req.body;

        if (this.isValidData(animalData)) {
            const {addedBy, ...rest} = animalData;

            global.db.collection(COLLECTIONS.ANIMALS).insertOne(rest)
                .then(dbResult => {
                    if (dbResult.insertedId) {
                        this.insertToProgress({animal: rest, addedBy})
                            .then(() => res.status(201).send(Responses.success()))
                    } else {
                        throw new Error({message: 'Cant add this animal'});
                    }
                })
                .catch(e => errorHandler(e, req, res));
        } else {
            errorHandler({
                message: 'Invalid aminal data, provide this fields: ' + this.values
            }, req, res);
        }
    }

    removeAnimal(id) {

    }

    remove(req, res) {
        const {id} = req.params;

        global.db.collection(COLLECTIONS.ANIMALS).deleteOne({_id: ObjectID(id)})
            .then(dbResult => {
                if (dbResult.deletedCount > 0) {
                    res.status(201).send(Responses.success());
                } else {
                    res.status(404).send(Responses.error({message: 'Animal not found'}));
                }
            })
        .catch(e => errorHandler(e, req, res));
    }
}

module.exports = new Animals();