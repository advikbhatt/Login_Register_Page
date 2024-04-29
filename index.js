var express = require('express');
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
const app = express();

app.use(bodyparser.json());
app.use(express.static('public'));
app.use(bodyparser.urlencoded({
    extended: true
}));

mongoose.connect('mongodb://localhost:27017/mydb',
    { useNewUrlParser: true, useUnifiedTopology: true }
);

var db = mongoose.connection;
db.on('error', () => console.log("Error in connecting to database"));
db.once('open', () => console.log("Connected to database"));

app.post('/sign_up', (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var pass = req.body.password;
    var data = {
        "username": name,
        "email": email,
        "password": pass
        }
    db.collection('users').insertOne(data, (err, collection) => {
        if (err) {
            throw err;
        }
        console.log("Record inserted successfully");
    })
    var a = res.redirect('login.html');
    return a;
})

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body; 
        const user = await db.collection('users').findOne({ username: username, password: password });
        if (!user) {
            console.log("Record not found");
            return res.redirect('register.html');
        }
        console.log("Record found");
        return res.redirect('welcome.html');
    } catch (err) {
        throw err;
    }
});

app.get('/', (req, res) => {
    res.set({
        'Access-control-Allow-Origin': '*'
    });
    return res.redirect('register.html');
}).listen(3000);
console.log('Listening on port 3000....'); 
