const express = require('express')
const router = express.Router()
const {register} = require('../controllers/auth.controller')
const {login} = require('../controllers/login.controller')
const {refresh} = require('../controllers/refresh.controller')
const {logout} = require('../controllers/logout.controller')
const {addPet} = require('../controllers/add_pet.controller')

router.post('/register', register)
router.post('/login',login)
router.post('/refresh', refresh)
router.post('/logout', logout)
router.post('/addPet', addPet)

module.exports = router