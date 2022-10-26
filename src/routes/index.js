const { Router } = require('express');

const path = require('path');
const { unlink } = require('fs-extra');
const router = Router();

// Models
const Image = require('../models/Image');
const { Console } = require('console');

router.get('/', async (req, res) => {
    const { find } = "";
    const images = await Image.find();
    res.render('index', { images, find });
});

router.get('/find', async (req, res) => {
    const { find } = "";
    const images = await Image.find();
    res.render('index', { images, find });
});

router.post('/find', async (req, res) => {
    const find = req.body.search;
    const query = {$or:[{"title": { $regex: '.*' + find + '.*' }}, {"description": { $regex: '.*' + find + '.*' }}]};
    const imagesFind = await Image.find(query);
    res.render('search', { imagesFind, find });
});

router.get('/find/:find', async (req, res) => {
    const { find } = req.params;
    const query = {$or:[{"title": { $regex: '.*' + find + '.*' }}, {"description": { $regex: '.*' + find + '.*' }}]};
    const imagesFind = await Image.find(query);
    res.render('search', { imagesFind, find });
});

router.get('/upload', (req, res) => {
    const { find } = req.params;
    res.render('upload',{ find });
});

router.post('/upload', async (req, res) => {
    const image = new Image();
    image.title = req.body.title;
    image.description = req.body.description;
    image.filename = req.file.filename;
    image.path = '/img/uploads/' + req.file.filename;
    image.originalname = req.file.originalname;
    image.mimetype = req.file.mimetype;
    image.size = req.file.size;
   // console.log(image);
    await image.save();
    res.redirect('/');
});

router.get('/image/:id', async (req, res) => {
    const { id } = req.params;
    const find = "";
    const image = await Image.findById(id);
    res.render('profile', { image, find });
});

router.get('/image/:id/:find', async (req, res) => {
    const id = req.params.id;
    const find = req.params.find;
    const image = await Image.findById(id);
    res.render('profile', { image, find });
});

router.get('/image/:id/delete/ok', async (req, res) => {
    const id = req.params.id;
    const imageDeleted = await Image.findByIdAndDelete(id);
    await unlink(path.resolve('./src/public' + imageDeleted.path));
    res.redirect('/');
});

router.get('/test', async (req, res) => {
    res.render('testmenu', {});
});

module.exports = router;