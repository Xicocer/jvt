const { PrismaClient } = require('../generated/prisma/client');
const prisma = new PrismaClient();

const mostPopularBreed = async (req, res) => {
    try{
        const breedStat = await prisma.user_pets.groupBy({
            by: ['breed'],
            _count: {
                breed: true
            },
            orderBy: {
                _count: {
                    breed: 'desc'
                }
            },
            take: 1
        })
        if (breedStat.length === 0) {
            return res.status(404).json({ message: 'Нет данных о породах' })
        }

        const breed = await prisma.breed.findUnique({
            where: { id: breedStat[0].breed }
        })

        if (!breed) {
            return res.status(404).json({ message: 'Порода не найдена' })
        }

        res.status(200).json({
            breed: breed.name,
            count: breedStat[0]._count.breed
        })
    }catch(error) {
        console.error('Ошибка получения самой популярной породы: ', error)
        res.status(500).json({ message: 'Ошибка получения самой популярной породы' })
    }
}

const mostPopularMarker = async (req, res) => {
    try {
        const markerStat = await prisma.markerClick.groupBy({
            by: ['mapMarkerId'],
            _count: {
                mapMarkerId: true
            },
            orderBy: {
                _count: {
                    mapMarkerId: 'desc'
                }
            },
            take: 1
        });

        if (markerStat.length === 0) {
            return res.status(404).json({ message: 'Нет данных о маркерах' });
        }

        res.status(200).json({
            type: markerStat[0].type,
            count: markerStat[0]._count.type
        });
    } catch (error) {
        console.error('Ошибка получения самого популярного маркера: ', error);
        res.status(500).json({ message: 'Ошибка получения самого популярного маркера' });
    }
}

module.exports = {
    mostPopularBreed,
    mostPopularMarker
}