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
        res.status(500).json({ message: 'Ошибка удаления маркера'})
    }
    
}

// const updateMarker = async (req, res) => {
//     try{
//         const {name, type, address} = req.body

//         const updateData = {}
//         if (name) updateData.name = name;
//         if (type) updateData.type = type;
//         if (address) updateData.address = address;

//     const updateMarker = await prisma.MapMarkers.update({
//         where: {id: +req.params.id},
//         data: updateData
//     })

//     res.status(200).json(updateMarker)
//     }catch(error){
//         console.error('Ошибка обновления маркера СДЕЛАЙ НАС ЕДИНЫМ: ', error)
//         res.status(500).json({ message: 'Ошибка обновления маркера' })
//     }
// }

const markerList = async (req, res) => {
    try {
        const { page = 1, limit = 10, type } = req.query
        const skip = (parseInt(page) - 1) * parseInt(limit)
        const take = parseInt(limit)

        const where = {}
        if (type) where.type = type

        const [markers, total] = await Promise.all([
            prisma.MapMarkers.findMany({
                 select: {
                    id: true,
                    name: true,
                    type: true,
                    address: true,
                    latitube: true, 
                    longitube: true,
                    img: true,
                    created_at: true
                 }

            }),
            prisma.MapMarkers.count({ where })
        ])

        res.status(200).json({
            success: true,
            data: markers,
            meta: {
                total,
                page: parseInt(page),
                limit: take,
                totalPages: Math.ceil(total / take)
            }
        })

    } catch (error) {
        console.error('Ошибка получения списка маркеров:', error)
        res.status(500).json({ 
            success: false,
            message: 'Ошибка при получении списка маркеров',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

const markerForMap = async (req, res) => {
    try{
        const markers = await prisma.MapMarkers.findMany({
                    select: {
                    id: true,
                    name: true,
                    type: true,
                    address: true,
                    latitube: true, 
                    longitube: true,
                    img: true,
                    created_at: true
                 }
        })
        res.status(200).json(markers)
    }catch(error){
        console.error('Ошибка вывода маркера СДЕЛАЙ НАС ЕДИНЫМ: ', error)
        res.status(500).json({ message: 'Ошибка вывода маркера' })
    }
}

const MarkerClickStatistic = async (req, res) => {
  const markerId = parseInt(req.params.id);
  if (isNaN(markerId)) {
    return res.status(400).json({ message: 'Неверный ID маркера' });
  }

  try {
    await prisma.markerClick.create({
      data: {
        MapMarkers: {
          connect: { id: markerId }
        }
      }
    });
    return res.status(200).json({ message: 'Клик по маркеру зарегистрирован' });
  } catch (error) {
    console.error('Ошибка при регистрации клика по маркеру:', error);
    return res.status(500).json({ message: 'Ошибка при регистрации клика по маркеру' });
  }
};



module.exports = {
    addMarker,
    deleteMarker,
    markerList,
    markerForMap,
    MarkerClickStatistic
}