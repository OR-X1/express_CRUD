
const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { isBuffer } = require('util');
const app = express();


const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'express_crud'
});

connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('database connected');
})


// set view file
app.set('views',path.join(__dirname,'view'));

// set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    // res.send('CRUD');
    let sql = "SELECT *FROM users";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;

        res.render('user_index',{
            title: 'CRUD /database',
            users : rows
        });
    });
})

app.get('/add', (req, res) => {
    res.render('user_add',{
        title: 'add new user'
    });
});

app.post('/save', (req, res) => {
    let data = {name: req.body.name, email: req.body.email, phone_no: req.body.phone_no};
    let sql = "INSERT INTO users SET ?";
    let query = connection.query(sql, data, (err, results) => {
        if(err) throw err;
        res.redirect('/')
    })
});

app.get('/edit/:id', (req, res) => {

    let sql = "SELECT * FROM users WHERE id = " + req.params.id;
    let query = connection.query(sql, (err, user) => {
        if(err) throw err;
        
        res.render('user_update',{
            title: 'update user',
            user : user[0]
        });
    });
});

app.post('/update', (req, res) => {
    let sql = `UPDATE users SET name = '${req.body.name}', email = '${req.body.email}', phone_no = '${req.body.phone_no}' WHERE users.id = ${req.body.id}`;
    let query = connection.query(sql, (err, results) => {
        if(err) throw err;
        res.redirect('/')
    })
});

app.get('/delete/:id', (req, res) => {
    let sql = "DELETE FROM `users` WHERE `users`.`id` = " + req.params.id;
    let query = connection.query(sql, (err, results) => {
        if(err) throw err;
        res.redirect('/')
    })
});

// Server Listening
app.listen(3000, () => {
    console.log('Server is running at port 3000');
});
 