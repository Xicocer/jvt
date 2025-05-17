const { PrismaClient } = require('../generated/prisma/client');

const prisma = new PrismaClient();

const logout = async (req, res) =>{

    try{

        const refreshToken = req.cookies.refresh_token

        if (!refreshToken){
            return res.status(401).json({message:'Отсутствует refresh токен'});
        }
    
        await prisma.refresh.deleteMany({
            where:{
                refreshtoken:refreshToken
            }
        })
    
        res.clearCookie('access_token',{
            httpOnly:true,
            sameSite:"lax",
        })

        res.status(200).json({
            message:"Вы вышли из системы"
        })

    }catch(error){
        console.error(error)
        res.status(500).json({ message: 'Ошибка при выходе из системы' })
    }

}

module.exports ={
    logout
}