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
const {changeProfile} = require('../controllers/change_profile.controller')
const {updateAvatar} = require('../controllers/avatar.cotroller')
const {changePet} = require('../controllers/change_pet.controller')
const {addMarker, deleteMarker, markerList} = require('../controllers/marker.controller')
const {createChat} = require('../controllers/add_chat.controller')
const {insertIntoChat, leaveChat} = require('../controllers/insert_chat.controller')
const {addAnimal, deleteAnimal,  getAllAnimalsWithBreed} = require('../controllers/animal.controller')
const {addBreed, deleteBreed} = require('../controllers/breed.controller')
const upload = require('../config/multer');
const mapimg = require('../config/multer-marker');

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Создать пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         aplication/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               patronymic:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успешно
 */
router.post('/register', register)
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Войти
 *     requestBody:
 *       required: true
 *       content:
 *         aplication/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успешно
 */
router.post('/login',login)
/**
 * @swagger
 * /refresh:
 *   post:
 *     summary: Перезапись токена
 *     requestBody:
 *       required: true
 *       content:
 *         aplication/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успешно
 */
router.post('/refresh', refresh)
/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Выход
 *     requestBody:
 *       required: true
 *       content:
 *         aplication/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успешно
 */
router.post('/logout', logout)
/**
 * @swagger
 * /addPet:
 *   post:
 *     summary: Добавить питомца
 *     requestBody:
 *       required: true
 *       content:
 *         aplication/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               gender:
 *                 type: boolean
 *               breedId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Успешно
 */
router.post('/addPet', addPet)
/**
 * @swagger
 * /support:
 *   post:
 *     summary: Добавить сообщение в тех.поддержку
 *     requestBody:
 *       required: true
 *       content:
 *         aplication/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успешно
 */
router.post('/support', authMidlware, sendSupportMessage)
/**
 * @swagger
 * /markers:
 *   post:
 *     summary: Создать маркер на карту
 *     requestBody:
 *       required: true
 *       content:
 *         aplication/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               address:
 *                 type: string
 *               latitube:
 *                 type: decimal
 *               longitube:
 *                 type: decimal
 *               img:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успешно
 */
router.post('/markers', adminMidlware, mapimg.single('image'), addMarker)
/**
 * @swagger
 * /chats:
 *   post:
 *     summary: Создать чат
 *     requestBody:
 *       required: true
 *       content:
 *         aplication/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Успешно
 */
router.post('/chats', adminMidlware, createChat)
/**
 * @swagger
 * /chats/:id/join:
 *   post:
 *     summary: Войти в чат
 *     requestBody:
 *       required: true
 *       content:
 *         aplication/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               chat_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Успешно
 */
router.post('/chats/:id/join', authMidlware, insertIntoChat)
/**
 * @swagger
 * /addAnimal:
 *   post:
 *     summary: Добавить домашнее животное (только для админов)
 *     requestBody:
 *       required: true
 *       content:
 *         aplication/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успешно
 */
router.post('/addAnimal', adminMidlware, addAnimal)
/**
 * @swagger
 * /breed:
 *   post:
 *     summary: Добавить породу (Только для админов)
 *     requestBody:
 *       required: true
 *       content:
 *         aplication/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               pet_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Успешно
 */
router.post('/breed', adminMidlware, addBreed)

/**
 * @swagger
 * /pets:
 *   get:
 *     summary: Выводит список питомцев пользователя
 *     responses:
 *       200:
 *         description: Успешно
 */
router.get('/pets', getPets)
/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Выводит профиль
 *     responses:
 *       200:
 *         description: Успешно
 */
router.get('/profile', authMidlware, getProfile)
/**
 * @swagger
 * /supportList:
 *   get:
 *     summary: Выводит список сообщений тех.поддержки (только для админов)
 *     responses:
 *       200:
 *         description: Успешно
 */
router.get('/supportList', adminMidlware, getAllSupportTickets)
/**
 * @swagger
 * /supportList/:id:
 *   get:
 *     summary: Выводит одно конкретное сообщение тех.поддержки (только для админов)
 *     responses:
 *       200:
 *         description: Успешно
 */
router.get('/support/:id', adminMidlware, getTicketById)
/**
 * @swagger
 * /markers:
 *   get:
 *     summary: Выводит маркеры карты
 *     responses:
 *       200:
 *         description: Успешно
 */
router.get('/markers', markerList)
/**
 * @swagger
 * /animals:
 *   get:
 *     summary: Выводит все виды домашних животных и породы для них (только для админов)
 *     responses:
 *       200:
 *         description: Успешно
 */
router.get('/animals', adminMidlware, getAllAnimalsWithBreed)

/**
 * @swagger
 * /support/:id:
 *   patch:
 *     summary: Меняет тип тикета тех.поддержки на "Решено", только для админов. Параметров не принимает
 *     responses:
 *       200:
 *         description: Успешно
 */
router.patch('/support/:id', adminMidlware, resolveTicket)
/**
 * @swagger
 * /profile:
 *   patch:
 *     summary: Меняет данные пользователя, можно посылать изменение на одно, два или три поля 
 *     requestBody:
 *       required: true
 *       content:
 *         aplication/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               patronymic:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успешно
 */
router.patch('/profile', adminMidlware, changeProfile)
/**
 * @swagger
 * /changePet/:id:
 *   patch:
 *     summary: По сути меняет только возраст питомца
 *     requestBody:
 *       required: true
 *       content:
 *         aplication/json:
 *           schema:
 *             type: object
 *             properties:
 *               age:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успешно
 */
router.patch('/changePet/:id', authMidlware, changePet)
/**
 * @swagger
 * /profile/avatar:
 *   patch:
 *     summary: Меняет аватар пользователя, принимает в себя файл, ну посути путь до него, но пользователь загружает файл все таки
 *     requestBody:
 *       required: true
 *       content:
 *         aplication/json:
 *           schema:
 *             type: object
 *             properties:
 *               img:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успешно
 */
router.patch('/profile/avatar', authMidlware, upload.single('avatar'), updateAvatar)
// router.patch('/markers/:id', adminMidlware, updateMarker)


/**
 * @swagger
 * /delPet/:id:
 *   delete:
 *     summary: Удаляет питомца 
 *     responses:
 *       200:
 *         description: Успешно
 */
router.delete('/delPet/:id', authMidlware, deletePet)
/**
 * @swagger
 * /support/:id:
 *   delete:
 *     summary: Удаляет тикет тех.поддержки (только для админов)
 *     responses:
 *       200:
 *         description: Успешно
 */
router.delete('/support/:id', adminMidlware, deleteTicket)
/**
 * @swagger
 * /markers/:id:
 *   delete:
 *     summary: Удаляет маркеры на карте (только для админов)
 *     responses:
 *       200:
 *         description: Успешно
 */
router.delete('/markers/:id', adminMidlware, deleteMarker)
/**
 * @swagger
 * /chats:
 *   delete:
 *     summary: Покинуть чат (по сути удаление связи между конкретным пользователем и конкретным чатом)
 *     responses:
 *       200:
 *         description: Успешно
 */
router.delete('/chats', authMidlware, leaveChat)
/**
 * @swagger
 * /animal:id:
 *   delete:
 *     summary: Удаление домашнего животного (Только для админов)
 *     responses:
 *       200:
 *         description: Успешно
 */
router.delete('/animals:id', adminMidlware, deleteAnimal)
/**
 * @swagger
 * /breed:id:
 *   delete:
 *     summary: Удаление породы (Только для админов)
 *     responses:
 *       200:
 *         description: Успешно
 */
router.delete('/breed:id', adminMidlware, deleteBreed)

module.exports = router