const { PrismaClient } = require('../generated/prisma/client');

const prisma = new PrismaClient();

const updateAvatar = async (req, res) => {
    try{
        if (!req.file) {
            return res.status(400).json({message:"Файл не загружен"});
        }

        const updateUser = await prisma.user.update({
            where: {id: req.user.userId},
            data: {
                img: `/avatars/${req.file.filename}`
            }
        })

        res.status(200).json(updateAvatar)
    }catch(error){
        console.error('Ошибка обновления аватара:', error)
        res.status(500).json({
            error:'Ошибка обновления аватара',
            details: error.message
        })
    }
}

module.exports = {
    updateAvatar
}