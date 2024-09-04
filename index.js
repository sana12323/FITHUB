var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
const { MongoClient } = require('mongodb');

const app = express()

app.use(bodyParser.json())
app.use(express.static('public'))

app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect('mongodb://localhost:27017/gymdatabase',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;


db.on('error',()=>console.log("Error in Connecting to Database"));
db.once('open',()=>console.log("Connected to Database"))


app.post("/reg",(req,res)=>{
    var goname = req.body.goname;
    var email = req.body.email;
    var phn = req.body.phn;
    var gender = req.body.gender;
    var gname = req.body.gname;
    var  loc= req.body.loc;
    var nostaff= req.body.nostaff;
    var feature= req.body.feature;
    var gimage=req.body.gimage;
    var certificate=req.body.certificate;
    var id=req.body.id;

    var data = {
        "goname": goname,
        "email" : email,
        "phn": phn,
        "gender": gender,
        "gname": gname,
        "loc": loc,
        "nosatff": nostaff,
        "feature": feature,
        "gimage": gimage,
        "certificate": certificate,
        "id": id
    }




    db.collection('gyms').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Inserted Successfully");
    });

    return res.redirect('index.html')

})


app.post("/user",(req,res)=>{
    var uname = req.body.uname;
    var pwd = req.body.pwd;
    var fname = req.body.fname;
    var lname = req.body.lname;
    var email = req.body.email;
    var  phn= req.body.phn;
    var age= req.body.age;
    var gender= req.body.gender;
    var adr=req.body.adr;
    

    var data = {
        "uname": uname,
        "pwd": pwd,
        "fname": fname,
        "lname": lname,
        "email" : email,
        "phn": phn,
        "age": age,
        "gender": gender,
        "adr": adr
    }


    

    db.collection('user').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Inserted Successfully");
    });

    return res.redirect('index.html')

})


app.get("/",(req,res)=>{
    res.set({
        "Allow-access-Allow-Origin": '*'
    })
    return res.redirect('index.html');
}).listen(3000);




app.post("/login", async (req,res)=>{
    var username = req.body.username;
    var password = req.body.password;
    var result;
    try{
        result = await db.collection('user').findOne({uname : username});
    }

    
    catch(err){
    console.log('User does not exist'); 
    }
    console.log(result);


    if(result){
        if(username === 'admin'){
            if(password === 'pwd'){
                return res.redirect('adminpro.html');
            }
            else{
                console.log('INVALID USERNAME OR PASSWORD 1')
                return res.redirect('index.html')
            }
        }
        else{
          if(result.pwd === password){
               return res.redirect('search2.html');
              }
              else{
                   console.log('INVALID USERNAME OR PASSWORD 2')                  
                  return res.redirect('index.html')
                  }
        }
    }
    else{
        console.log('INVALID USERNAME OR PASSWORD')        
        return res.redirect('index.html')
    }
    


})

app.set("view engine", "ejs");
app.get("/views/admin.ejs", async (req,res)=>{
    try{
        //console.log("success1")
        const result = await db.collection('gyms').find({goname : 'abc'}).toArray();
        //console.log("success2")
        res.render("admin", {result});
        console.log("success3")
    }
    catch(err){
    console.error('Error rendering admin template:', err);
    console.log('User does not exist111');
    }
    
})

 

