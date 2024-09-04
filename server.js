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
    var gid = req.body.gid;
    var goname = req.body.goname;
    var email = req.body.email;
    var phn = req.body.phn;
    var gender = req.body.gender;
    var gname = req.body.gname;
    var loc= req.body.loc;
    var  mapLink= req.body.mapLink;
    var nostaff= req.body.nostaff;
    var feature = req.body.feature;
    var maxo =req.body.maxo;
    var noeq =req.body.noeq;
    var sqft =req.body.sqft;
    var batch =req.body.batch;
    var gimage=req.body.gimage;
    var certificate=req.body.certificate;
    var id=req.body.id;
    
    var data = {
        "gid": gid,
        "goname": goname,
        "email" : email,
        "phn": phn,
        "gender": gender,
        "gname": gname,
        "loc": loc,
        "mapLink": mapLink,
        "nostaff": nostaff,
        "feature": feature,
        "maxo": maxo,
        "noeq": noeq,
        "sqft": sqft,
        "batch": batch,
        "gimage": gimage,
        "certificate": certificate,
        "id": id
    };
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
    var email = req.body.email;
    var  phn= req.body.phn;
    
    var data = {
        "uname": uname,
        "pwd": pwd,
        "email" : email,
        "phn": phn
    };
    db.collection('user').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Inserted Successfully");
    });
    return res.redirect('index.html')
})
app.post("/register",(req,res)=>{
    var fname = req.body.fname;
    var lname = req.body.lname;
    var email = req.body.email;
    var  phn= req.body.phn;
    var age= req.body.age;
    var gender= req.body.gender;
    var adr=req.body.adr;
    var weight=req.body.weight;
    var height=req.body.height;
    var pt=req.body.pt;

    var data = {
        "fname": fname,
        "lname": lname,
        "email" : email,
        "phn": phn,
        "age": age,
        "gender": gender,
        "adr": adr,
        "weight" : weight,
        "height" : height,
        "pt" : pt
    };
    db.collection('Registeredcustomers').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Inserted Successfully");
    });
    return res.redirect('bill.html')
})
app.post("/review",(req,res)=>{
    var name=req.body.name;
    var rating=req.body.rating;
    var revw=req.body.revw;
        var data = {
            "name": name,
            "rating": rating,
            "revw" : revw
        };
        db.collection('reviews').insertOne(data,(err,collection)=>{
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
        result = await db.collection('user').findOne({uname : username},{pwd:password});
    }
    catch(err){
    console.log('User does not exist'); 
    }
    //console.log(result);
   if(result.pwd === password && result.uname === username){
            return res.redirect('search2.html');
    }
    else{
        console.log('INVALID USERNAME OR PASSWORD 2')                  
        return res.redirect('index.html')
         }
    })
app.post("/alogin", async (req,res)=>{
        var username = req.body.username;
        var password = req.body.password;
        if(username === 'admin'){
            if(password === 'pwd'){
                return res.redirect('adminpro.html');
            }
            else{
                console.log('INVALID USERNAME OR PASSWORD 1')
                return res.redirect('index.html')
            }}})

app.set("view engine", "ejs");
app.get("/admin", async (req,res)=>{
    try{
        const result = await db.collection('gyms').find({}).toArray();
        res.render("admin", {result});
        console.log("success3")}
    catch(err){
    console.error('Error rendering admin template:', err);
    console.log('User does not exist111');}
})

app.set("view engine", "ejs");
app.post("/search", async (req,res)=>{
    var loc=req.body.loc;
    //console.log(loc);
    try{
        const result=await db.collection("Approvedgyms").find({loc:loc}).toArray();
        res.render("search",{result});
        //console.log(result);
    }
    catch(err)
    {
        console.log("try again!!")
    }
})


 async function deleteafteruse(gymId, res) {
    db.collection('gyms').deleteOne({ gid: gymId }, (err, result) => {
        if (err) {
            console.error("Error deleting gym:", err);
            return res.status(500).send("Error deleting gym");
        }
 })
    db.collection('Approvedgyms').deleteOne({ gid: gymId }, (err, result) => {
        if (err) {
            console.error("Error deleting gym:", err);
            return res.status(500).send("Error deleting gym");
        }
        console.log("Gym deleted successfully");
        res.redirect("/admin");
 })
  }


app.post("/delete",(req, res) => {
    const gymId = req.body.del; 
        deleteafteruse(gymId,res);
    });

app.post("/approve", (req, res) => {
    const gymId = req.body.apr; 
    db.collection('gyms').findOne({ gid: gymId }, (err, result) => {
        if (err) {
            console.error("Error finding gym:", err);
            return res.status(500).send("Error finding gym");
        }
        if (!result) {
            console.error("Gym not found");
            return res.status(404).send("Gym not found");
        }
console.log(result,"found");
        db.collection('Approvedgyms').insertOne(result, (err, result) => {
            if (err) {
                console.error("Error inserting gym into approved collection:", err);
                return res.status(500).send("Error inserting gym into approved collection");
            }
            console.log("Gym approved and inserted into approved collection");
            res.redirect("/admin");
            //deleteafteruse(gymId,res);
        });});});

app.post("/review",(req,res)=>{
    var name=req.body.name;
    var rating=req.body.rating;
    var revw=req.body.revw;
        var data = {
            "name": name,
            "rating": rating,
            "revw" : revw
        };
        db.collection('reviews').insertOne(data,(err,collection)=>{
            if(err){
                throw err;
            }
            console.log("Review Inserted Successfully");
        });
        return res.redirect('index.html')
    })
    app.set("view engine", "ejs");
    app.get("/vr", async (req,res)=>{
        try{
            const result = await db.collection('reviews').find({}).toArray();
            res.render("vr", {result});
            //console.log("success3")
        }
        catch(err){
        console.error('Error rendering admin template:', err);
        console.log('User does not exist111');
        }
        return res.redirect('index.html')
    })
    app.post("/gymr",(req,res)=>{
        var grgname=req.body.grgname;
        var grname=req.body.grname;
        var grrating=req.body.grrating;
        var grrevw=req.body.grrevw;
            var data = {
                "grgname": grgname,
                "grname": grname,
                "grrating": grrating,
                "grrevw" : grrevw
            };
            db.collection('reviewgym').insertOne(data,(err,collection)=>{
                if(err){
                    throw err;
                }
                console.log("Review Inserted Successfully");
            });
            return res.redirect('index.html')
        })
    app.set("view engine", "ejs");
    app.get("/gr", async (req,res)=>{
        try{
            const result = await db.collection('reviewgym').find({}).toArray();
            res.render("gr", {result});
            //console.log("success3")
        }
        catch(err){
        console.error('Error rendering admin template:', err);
        console.log('User does not exist111');
        }})