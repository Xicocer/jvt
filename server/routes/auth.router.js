const express = require('express')
const router = express.Router()
const {register} = require('../controllers/auth.controller')
const {login} = require('../controllers/login.controller')
const {refresh} = require('../controllers/refresh.controller')
const {logout} = require('../controllers/logout.controller')
const {addPet} = require('../controllers/add_pet.controller')
const {getPets} = require('../controllers/list_pets.controller')
const {deletePet} = require('../controllers/delet_pet.controller')
const {authMidlware} = require('../middleware/auth.middleware')
const {getProfile} = require('../controllers/profile.controller')
const {sendSupportMessage} = require('../controllers/support_message.controller')
const {adminMidlware} = require('../middleware/admin.midleware')
const {getAllSupportTickets, getTicketById, resolveTicket, deleteTicket} = require('../controllers/list_support.controller')


router.post('/register', register)
router.post('/login',login)
router.post('/refresh', refresh)
router.post('/logout', logout)
router.post('/addPet', addPet)
router.post('/support', authMidlware, sendSupportMessage)

router.get('/pets', getPets)
router.get('/profile', authMidlware, getProfile)
router.get('/supportList', adminMidlware, getAllSupportTickets)
router.get('/support/:id', adminMidlware, getTicketById)

router.patch('/support/:id', adminMidlware, resolveTicket)

router.delete('/delPet/:id', authMidlware, deletePet)
router.delete('/support/:id', adminMidlware, deleteTicket)

module.exports = router