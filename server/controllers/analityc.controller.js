const { PrismaClient } = require('../generated/prisma/client');
const prisma = new PrismaClient();

const mostPopularBreed = async (req, res) => {
  try {
    const breedStat = await prisma.user_pets.groupBy({
      by: ['breed_id'],
      _count: {
        breed_id: true,
      },
      orderBy: {
        _count: {
          breed_id: 'desc',
        },
      },
      take: 1,
    });

    if (breedStat.length === 0) {
      return res.status(404).json({ message: 'Нет данных о породах' });
    }

    const breedId = breedStat[0].breed_id;
    const count = breedStat[0]._count.breed_id;

    const breed = await prisma.breed.findUnique({
      where: { id: breedId },
    });

    if (!breed) {
      return res.status(404).json({ message: 'Порода не найдена' });
    }

    res.status(200).json({
      breed: breed.name,
      count: count,
    });
  } catch (error) {
    console.error('Ошибка получения самой популярной породы: ', error);
    res.status(500).json({ message: 'Ошибка получения самой популярной породы' });
  }
};

const mostPopularMarker = async (req, res) => {
  try {
    const markerStat = await prisma.MarkerClick.groupBy({
      by: ['MapMarkerId'],
      _count: {
        MapMarkerId: true,
      },
      orderBy: {
        _count: {
          MapMarkerId: 'desc',
        },
      },
      take: 1,
    });

    if (markerStat.length === 0) {
      return res.status(404).json({ message: 'Нет данных о маркерах' });
    }

    const markerId = markerStat[0].MapMarkerId;

    // Запрашиваем данные маркера из модели MapMarkers
    const marker = await prisma.mapMarkers.findUnique({
      where: { id: markerId },
    });

    if (!marker) {
      return res.status(404).json({ message: 'Маркер не найден' });
    }

    res.status(200).json({
      marker, // объект с name, address, type и т.д.
      count: markerStat[0]._count.MapMarkerId,
    });
  } catch (error) {
    console.error('Ошибка получения самого популярного маркера: ', error);
    res.status(500).json({ message: 'Ошибка получения самого популярного маркера' });
  }
};

module.exports = {
    mostPopularBreed,
    mostPopularMarker
}