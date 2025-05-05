const { PrismaClient } = require('../generated/prisma/client');

const prisma = new PrismaClient();

const sendSupportMessage = async (req, res) => {
    try{
        const { message, type } = req.body
        const userId = req.user.userId

        if (!message || !type){
            return res.status(400).json({ message: 'Укажите сообщение и его тип' })
        }

        await prisma.support.create({
            data: {
                message,
                type,
                user_id: userId
            }
        })
        res.status(201).json({message: "Сообщение отправленно в тех поддержку"})
    }catch(error){
        console.error('Ошибка отправки запроса в техподдержку:', error)
        res.status(500).json({ message: 'Ошибка сервера при отправке запроса' })
    }
}

module.exports = {
    sendSupportMessage
}