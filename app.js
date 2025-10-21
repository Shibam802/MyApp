/*const cookieParser = require('cookie-parser');
const express=require('express');
const app=express();
const bcrypt = require('bcrypt'); // for encryption and decryption. we dont keep the password as it is we changwe the password in a different form by using a algo like going one character backword.
const jwt = require('jsonwebtoken');
const path=require('path');
const usermodel=require("./models/user");
app.use(cookieParser());
app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));


app.get('/',(req,res)=>{
res.render('index');
});

app.post('/create',(req,res)=>{
let{username,email,password,age}=req.body;

 bcrypt.genSalt(10,(err,salt)=>{
  bcrypt.hash(password,salt,async(err,hash)=>{
         let createdUser=  await usermodel.create({
        username,
        email,
        password:hash,
        age
    })
    res.send(createdUser);


let token=jwt.sign({email},"shhhhhhhhhh");
res.cookie("token",token);



    })
})


});

app.get("/login",function(req,res){
    res.render('login');
})

app.post("/login",async function(req,res){
   let user= await usermodel.findOne({email:req.body.email});
   if(!user) return res.send("something is wrong");

   bcrypt.compare(req.body.password,user.password,function(err,result){
    if (result){
        let token=jwt.sign({email:user.email},"shhhhhhhhhh");
res.cookie("token",token);
//res.send("yes you can login");
res.send("yes yo can login");

    } 
    else res.send("no you can't login");
   })
})

app.get("/logout",function(req,res){
    res.cookie("token","");                     // when we log out the token will be gone which is created during log in.
    res.redirect("/");
})








app.get("/dashboard", (req, res) => {
  res.render("dashboard", { user: req.user }); // Make sure req.user is set by your JWT verification
});
*/



const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const usermodel = require("./models/user"); // Make sure your User model exists

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// JWT middleware
function isLoggedIn(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login");

  jwt.verify(token, "shhhhhhhhhh", (err, decoded) => {
    if (err) return res.redirect("/login");
    req.user = decoded;
    next();
  });
}

// Routes

// Home page
app.get('/', (req, res) => {
  res.render('index');
});

// Create user
app.post('/create', (req, res) => {
  const { username, email, password, age } = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      if (err) return res.send("Error hashing password");

      const createdUser = await usermodel.create({
        username,
        email,
        password: hash,
        age
      });

      // Set JWT cookie
      const token = jwt.sign({ email }, "shhhhhhhhhh", { expiresIn: "1h" });
      res.cookie("token", token, { httpOnly: true });
      res.redirect("/dashboard");
    });
  });
});

// Login page
app.get("/login", (req, res) => {
  res.render("login");
});

// Login POST
app.post("/login", async (req, res) => {
  const user = await usermodel.findOne({ email: req.body.email });
  if (!user) return res.send("Invalid email or password");

  bcrypt.compare(req.body.password, user.password, (err, result) => {
    if (result) {
      const token = jwt.sign({ email: user.email }, "shhhhhhhhhh", { expiresIn: "1h" });
      res.cookie("token", token, { httpOnly: true });
      res.redirect("/dashboard");
    } else {
      res.send("Invalid email or password");
    }
  });
});

// Dashboard (protected)
app.get("/dashboard", isLoggedIn, (req, res) => {
  res.render("dashboard", { user: req.user });
});

// Logout
app.get("/logout", (req, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.redirect("/");
});

// Start server
app.listen(3000, () => console.log("Server running on port 3000"));



/*What Happens Normally

When you log in once:

You enter your email and password.

The server verifies them.

Then it creates a JWT token (like a secure ID card) and sends it back to your browser.

That token is stored in a cookie.

🚀 What Happens After Login

Now, whenever you go to any other page (like /dashboard, /profile, /orders, etc.) —

✅ The browser automatically sends the JWT token (because it’s stored in a cookie).
✅ The server verifies the token to confirm you are still logged in.
❌ You don’t need to type your password again — unless the token expires or you log out.*/
// when we log out that jwt token is destroyed so we again need to enter our password to enter and again another jwt token is fromed.






/*app.get("/",function(req,res){
res.cookie("name","harsh");
res.send("done");
})*/
// cookie -Storage method (like a container).it doesnot store ur info.
/*app.get("/read",function(req,res){  // which ever route you go the cookie will go with u
console.log(req.cookies);
res.send("read me");
})
*/

/*app.get("/",function(req,res){
bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash("oyoyoyoy", salt, function(err, hash) {    // salt is  arandom string. this salt will mix with the password and make a hash like this $2b$10$XmDKEzSw8DnIEmVx5kNf9OOPkagdgT5n8cAm5mcZfHgZ6BRYqHYlC
       console.log(hash);
       res.send("working");
    });
});
})*/

/*app.get("/",function(req,res){
bcrypt.compare("oyoyoyoy", "$2b$10$XmDKEzSw8DnIEmVx5kNf9OOPkagdgT5n8cAm5mcZfHgZ6BRYqHYlC", function(err, result) {   // this is decryption basically comparing the password with the hash.
    // result == true
    console.log(result);
});
})*/

// whenever we log in using our password the password is encrypted in to hash and matched with the previous saved encrypted password hash. if matched then true.

// A JWT (JSON Web Token) is a string the server gives you after login that proves who you are.

/*app.get("/",function(req,res){
let token= jwt.sign({email:"shibambanik0@gmail.com"},"secret")  //withthe help of this secret the email id is encrypted . if we get this secret we can decrypt this string and read it.
res.cookie("token",token);  // we send this encrypted token to the browder.
res.send("done");
})

app.get("/read",function(req,res){
   // console.log(req.cookies.token)   // broser has send the data to the backend
 let data=   jwt.verify(req.cookies.token,"secret");  // the token we got from the browser we decrypt it and store inthe data
    console.log(data);
})
*/



/*Step	What happens
1	You log in
2	Server creates a JWT with your info
3	It sends the JWT back (in header or cookie)
4	Your browser stores the JWT
5	You send it with each request
6	Server uses it to know who you are*/

/*
JWT = Your ID Card

Contains your info: user ID, role, expiry time

Signed by the server (so nobody can fake it)

Can be read and verified by the server without looking it up in a database

Carries identity and possibly permissions

Analogy:

Imagine you're walking around with an ID badge that says:
“This is Alice, user #42, access: admin — expires in 1 hour.”

📦 Cookie = The Envelope (Transport Method)

Used to store small pieces of data (like the JWT or a session ID)

Automatically sent with every request to the same domain

Can carry anything, including:

A JWT

A random session ID

Preferences, like darkMode=true

Analogy:

Your ID badge (JWT) is put inside an envelope (cookie)
The envelope is sent to the server automatically every time.*/


app.listen(3000, () => {
  console.log('Server running on port 3000');
});
