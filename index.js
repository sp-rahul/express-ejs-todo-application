const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./models/register-db')
const User = require('./models/User')
const bcrypt = require('bcryptjs')
const cookieParser = require("cookie-parser");
const sessions = require('express-session');


const app = express();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs')

sequelize.sync().then(() => {
    console.log('Connection has been established successfully.');
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 });
 
 
 // creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));

//serving public file
app.use(express.static(__dirname));
app.use(cookieParser());

app.get('/login',(req,res)=> {
	res.render('pages/login')
})

app.get('/register',async (req,res)=>{
   // const user = await User.findAll();
   // res.send(user)
	res.render('pages/register')
 
})

app.post('/register', async (req,res) => {
    try {
		const userExist = await User.findOne({ where : {email : req.body.email }});
		if(!userExist){
			
       const  {username, email, password} = req.body;
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = {username, email, password: hashedPassword};
		
	  const row = await User.create(user);
	   res.redirect('/login')
		res.status(200).render('pages/login');
		}
		else {
			console.log('user already exist')
			res.status(200).render('pages/register');
		}

    }catch(e){
		
        console.log(e.message)
    }
})

app.post('/login', async (req,res) => {
    try {

    const user = await User.findOne({ where : {email : req.body.email }});
	
   if(user){
    const password_valid = await bcrypt.compare(req.body.password,user.password);
    if(password_valid){
        //token = jwt.sign({ "id" : user.id,"email" : user.email,"first_name":user.first_name },process.env.SECRET);
       // res.status(200).json({ token : token });
	    //res.status(200).json("Login successfully");
		res.redirect('/');
		res.render('pages/index', { todos });
		
    } else {
	 res.redirect('/login');
      //res.status(400).json({ error : "Password Incorrect" });
	 // res.send("alert("your alert message"); window.location.href = "/page_location"; ");
	 res.send('alert("wrong password")');
    }
  
  }else{
    res.status(404).json({ error : "User does not exist" });
  }
    }catch(e){
        console.log(e.message)
    }
})






















const todos = [];

app.get('/', (req, res) => {
    res.render('pages/index', { todos });
});

app.post('/', (req, res) => {
    const { todo, deleteIndex } = req.body;

    if (deleteIndex !== undefined) {
        todos.splice(deleteIndex, 1);
    } else if (todo !== '') {
        todos.push(todo);
    }

    res.redirect('/');
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
