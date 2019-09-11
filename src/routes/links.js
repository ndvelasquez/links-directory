const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add');
});

router.post('/add', async (req, res) => {
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO links set ?', [newLink]);
    req.flash('successs', 'Link added successfuly')
    res.redirect('/links');
});

router.get('/', isLoggedIn, async (req, res) => {
    const userId = req.user.id;
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [userId]);
    
    res.render('links/list', {links});
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM links WHERE id = ?', [id]);
    res.redirect('/links');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const {id} = req.params;
    const link = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    res.render('links/edit', {link: link[0]});
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, url } = req.body;
    const editedLink = {
        title,
        description,
        url
    };
    await pool.query('UPDATE links SET ? WHERE id = ?', [editedLink, id]);
    req.flash('successs', 'Link modified successfuly');
    res.redirect('/links');
});

module.exports = router;