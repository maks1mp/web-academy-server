const express = require('express');
const router = express.Router();
const users = require('../app/users');
const animals = require('../app/animals');

// users
router.route('/users/bet').post(users.bet.bind(users));
router.route('/users/delete/:id').delete(users.delete.bind(users));
router.route('/users/login').post(users.login.bind(users));
router.route('/users/add').post(users.add.bind(users));
router.route('/users/:id').get(users.getOne.bind(users));
router.route('/users').get(users.getAll.bind(users));


// animals
router.route('/animals/add').post(animals.add.bind(animals));
router.route('/animals/delete/:id').delete(animals.remove.bind(animals));
router.route('/animals').get(animals.getAll.bind(animals));
router.route('/animals/in-progress').get(animals.getInProgress.bind(animals));
router.route('/animals/buy').post(animals.buyAnimal.bind(animals));
router.route('/animals/purchased').get(animals.getPurchased.bind(animals));


module.exports = router;