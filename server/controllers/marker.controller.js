const { PrismaClient } = require('../generated/prisma/client');
const mapimg = require('../config/multer-marker')

const prisma = new PrismaClient();

const addMarker = async (req, res) => {
    try{
        const {name, type, address, latitube, longitube} = req.body

        if (!req.file) {
            res.status(400).json({message:"Изображение обязательно"})
        }

        const marker = await prisma.MapMarkers.create({
            data: {
                name,
                type,
                address,
                latitube:parseFloat(latitube),
                longitube: parseFloat(longitube),
                img: `/mapimg/${req.file.filename}`,
                user: {connect: { id:req.user.userId }}
            }
        })

        res.status(200).json(marker);

    }catch(error){
        console.error('Ошибка добавления маркера СДЕЛАЙ НАС ЕДИНЫМ: ', error)
        res.status(500).json({ message: 'Ошибка добавления маркера' })
    }
}

const deleteMarker = async (req, res) => {
    try{
        const marker = await prisma.MapMarkers.findUnique({
        where: {id: +req.params.id}, 
    });

    if (!marker){
        return res.status(403).json({message: "Маркер не найден"})
    }

    await prisma.MapMarkers.delete({
        where: {id: +req.params.id},
    })

    res.status(200).json({message:"Маркер удален"})

    }catch(error){
        console.error('Ошибка удаления маркера СДЕЛАЙ НАС ЕДИНЫМ: ', error)
        res.status(500).json({ message: 'Ошибка удаления маркера' })
    }
    
}

const updateMarker = async (req, res) => {
    try{
        const {name, type, address} = req.body

        const marker = await prisma.MapMarkers.findUnique({
        where: {id: +req.params.id},
    })

    if (!marker){
        return res.status(403).json({message: "Маркер не найден"})
    }

    const updateMarker = await prisma.MapMarkers.update({
        data: {
            name,
            type,
            address,
            img: `/mapimg/${req.file.filename}`,
        }
    })

    res.status(200).json(updateMarker)
    }catch(error){
        console.error('Ошибка обновления маркера СДЕЛАЙ НАС ЕДИНЫМ: ', error)
        res.status(500).json({ message: 'Ошибка обновления маркера' })
    }
}

const markerList = async (req, res) => {
    try{
        const markers = await prisma.MapMarkers.findMany()
        res.status(200).json(markers)
    }catch(error){
        console.error('Ошибка вывода маркера СДЕЛАЙ НАС ЕДИНЫМ: ', error)
        res.status(500).json({ message: 'Ошибка вывода маркера' })
    }
}


module.exports = {
    addMarker,
    deleteMarker,
    updateMarker,
    markerList
}