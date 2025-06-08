const { PrismaClient } = require('../generated/prisma/client');
const prisma = new PrismaClient();

// Создание чата
const createChat = async (req, res) => {
    try {
        const { name, type, description } = req.body;
        const userId = req.user.userId; 

        if (!name || typeof type !== 'boolean') {
            return res.status(400).json({ message: 'Укажите название и тип (boolean) для чата' });
        }

        const newChat = await prisma.chat.create({
            data: {
                name,
                type,
                description: description || '',
                created_by: { connect: { id: userId } },
                UserChat: {
                    create: {
                        user: { connect: { id: userId } } // добавим создателя сразу в чат
                    }
                }
            },
            include: {
                UserChat: true,
            }
        });

        res.status(201).json(newChat);
    } catch (error) {
        console.error('Ошибка создания чата:', error);
        res.status(500).json({ message: 'Ошибка сервера при создании чата' });
    }
};

// Удаление чата (только создатель может удалить)
const deleteChat = async (req, res) => {
    try {
        const chatId = parseInt(req.params.id);
        const userId = req.user.id;

        if (isNaN(chatId)) {
            return res.status(400).json({ message: 'Неверный ID чата' });
        }

        const chat = await prisma.chat.findUnique({
            where: { id: chatId },
        });

        if (!chat) {
            return res.status(404).json({ message: 'Чат не найден' });
        }

        if (chat.created_by_id !== userId) {
            return res.status(403).json({ message: 'Только создатель может удалить чат' });
        }

        await prisma.chat.delete({
            where: { id: chatId },
        });

        res.status(200).json({ message: 'Чат успешно удален' });
    } catch (error) {
        console.error('Ошибка удаления чата:', error);
        res.status(500).json({ message: 'Ошибка сервера при удалении чата' });
    }
};

// Получение чатов, в которых состоит пользователь
const getUserChats = async (req, res) => {
    try {
        const userId = req.user.id;

        const userChats = await prisma.userChat.findMany({
            where: { user_id: userId },
            include: {
                chat: true,
            }
        });

        const chats = userChats.map(uc => uc.chat);

        res.status(200).json(chats);
    } catch (error) {
        console.error('Ошибка получения чатов:', error);
        res.status(500).json({ message: 'Ошибка сервера при получении чатов' });
    }
};

const getAllChats = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;

        const chats = await prisma.chat.findMany({
            skip: offset,
            take: limit,
            orderBy: {
                created_at: 'desc',
            },
            include: {
                _count: {
                    select: { UserChat: true }
                },
                created_by: {
                    select: { id: true, first_name: true }
                }
            }
        });

        res.status(200).json(chats);
    } catch (error) {
        console.error('Ошибка получения чатов:', error);
        res.status(500).json({ message: 'Ошибка при получении чатов' });
    }
};

const searchChats = async (req, res) => {
    try {
        const { query } = req.query;

        const chats = await prisma.chat.findMany({
            where: {
                name: {
                    contains: query || '', // если query нет, вернёт все
                    mode: 'insensitive',
                },
                type: false, // Только открытые чаты
            },
            take: 20, // Ограничим выдачу
            orderBy: {
                created_at: 'desc',
            }
        });

        res.status(200).json(chats);
    } catch (error) {
        console.error('Ошибка поиска чатов:', error);
        res.status(500).json({ message: 'Ошибка при поиске чатов' });
    }
};

module.exports = {
    createChat,
    deleteChat,
    getUserChats,
    getAllChats,
    searchChats,
};