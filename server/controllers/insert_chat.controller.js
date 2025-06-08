const { PrismaClient } = require('../generated/prisma/client');

const prisma = new PrismaClient();

const insertIntoChat = async (req, res) => {
    try {
        const chatId = parseInt(req.params.chatId);
        const userId = req.user.userId;

        if (isNaN(chatId)) {
            return res.status(400).json({ message: "Неверный id чата" });
        }

        const existing = await prisma.UserChat.findUnique({
            where: {
                user_id_chat_id: {
                    user_id: userId,
                    chat_id: chatId,
                }
            }
        });

        if (existing) {
            return res.status(400).json({ message: "Вы уже состоите в этом чате" });
        }

        await prisma.UserChat.create({
            data: {
                user_id: userId,
                chat_id: chatId,
            },
        });

        res.status(200).json({ message: "Вы вошли в чат" });
    } catch (error) {
        console.error('Ошибка входа в чат:', error);
        res.status(500).json({ message: 'Ошибка входа в чат' });
    }
};

const leaveChat = async (req, res) => {
    try {
        const userId = req.user.userId;
        const chatId = parseInt(req.params.chatId);

        if (isNaN(chatId)) {
            return res.status(400).json({ message: "Неверный id чата" });
        }

        // Удаляем именно запись с этим user_id и chat_id
        await prisma.UserChat.delete({
            where: {
                user_id_chat_id: {
                    user_id: userId,
                    chat_id: chatId,
                },
            },
        });

        res.status(200).json({ message: "Вы покинули чат" });
    } catch (error) {
        console.error('Ошибка выхода из чата:', error);
        res.status(500).json({
            error: 'Ошибка выхода из чата',
            details: error.message,
        });
    }
};

module.exports = {
    insertIntoChat,
    leaveChat
}