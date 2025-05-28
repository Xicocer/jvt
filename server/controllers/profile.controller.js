const { PrismaClient } = require('../generated/prisma/client');

const prisma = new PrismaClient();

const getProfile =async (req, res) =>{
    try{
        console.log(req.user.userRole)
        const userId = req.user.userId

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
                patronymic: true,
                img: true,
                role: true,
                created_at: true,
                user_pets: {
                    select: {
                        id: true,
                        name: true,
                        age: true,
                        gender: true,
                        breed: {
                            select: {
                                id: true,
                                name: true,
                                pet: {
                                    select: {
                                        id: true,
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        if (!user){
            return res.status(404).json({message:"Пользователь не найден"})
        }

        res.status(200).json(user)
    }catch(error){
         console.error('Ошибка получения профиля: ', error)
         res.status(500).json({message:"Ошибка сервера"})
    }
}

const Me = async (req, res) =>{
    const token = req.cookies?.accessToken

    if (!token) {
        return res.status(401).json({ message: 'Нет токена' });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        res.json({
            id: decoded.userId,
            role: decoded.userRole,
        })
    }catch(error){
        return res.status(401).json({ message: 'Неверный или просроченный токен' });
    }
}

module.exports = {
    getProfile,
    Me
}