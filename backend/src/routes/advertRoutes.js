const advertRouter = require('express').Router();
const mongoose = require('mongoose');
const Advert = mongoose.model('Advert');
const requireAuth = require('../middlewares/requireAuth');

advertRouter.use(requireAuth);

advertRouter.route('/adverts')
    .post(async (req, res) => {
        const { paging, search } = req.body;
        const keyWords = !search.keyWords ? {} : { name: new RegExp(search.keyWords) };
        const sorting = { [search.field]: search.direct }
        const operator = search.direct === -1 ? '$lte' : '$gte';
        const pagination = !paging.lastAdvert ? {} : {
            [search.field]: {
                [operator]: paging.lastAdvert[search.field]
            },
            _id: { $nin: paging.seenIds }
        };
        const filter = { ...pagination, ...keyWords };
        try {
            const filteredQuery = Advert.find(filter);
            const total = await filteredQuery.count();
            const adverts = await filteredQuery
                .find(filter)
                .select('name publication_date price city photos')
                .sort(sorting)
                .limit(10);

            res.send({ adverts, total });
        } catch (err) {
            console.error(err);
            res.status(500).send('Не удалось получить данные.');
        }
    })
    .put(async (req, res) => {
        const advert = new Advert(req.body);
        try {
            advert.user_id = req.user._id;
            await advert.save();
            res.send(advert);
        } catch (err) {
            // TODO: обработать ошибки
            res.status(422).send('Не все поля заполнены.');
        }
    });

advertRouter.route('/adverts/:id')
    .get(async ({ params }, res) => {
        const { id } = params;

        try {
            const advert = await Advert
                .findById(id)
                .select('-__v');

            res.send(advert);
        } catch (err) {
            console.error(err);
            res.status(500).send('Не удалось получить данные объявления.');
        }
    })
    .put(async ({ params, body }, res) => {
        const { id } = params;

        try {
            const advert = await Advert.findByIdAndUpdate(id, body);
            res.send(advert);
        } catch (err) {
            console.error(err);
            res.status(500).send('Не удалось обновить информацию об устройстве.');
        }
    })
    .delete(async ({ params }, res) => {
        const { id } = params;

        try {
            const advert = await Advert.findByIdAndDelete(id);
            res.send(`Объявление ${advert.name} успешно удалено`);
        } catch (err) {
            console.error(err);
            res.status(500).send('Не удалось удалить объявление.');
        }
    })

module.exports = advertRouter;