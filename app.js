const express=require('express');
const multer=require('multer');
const bodyparser=require('body-parser');
const mongodb=require('mongodb');
const dotenv=require('dotenv');
const fs= require('fs');
const path=require('path');
const uploads='./uploads';
const app=express();
dotenv.config();
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());

var storage=multer.diskStorage({
destination:functi2on(req,file,cb){
    cb(null,'uploads');
},
    filename:function(req,file,cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
var upload=multer({
    storage:storage
});




//Delete the file mynewfile2.txt:


//database 

const mongoclient= mongodb.MongoClient;
    mongoclient.connect(process.env.DB_CONNECT, {
            useUnifiedTopology: true,
        },(err,client) =>{
            if(err) return console.log(err);
            db = client.db('fileupload');
            app.listen(8080,() => {
            console.log("a fileupload port 8080");
            });
    
        });
app.get('/',(req,res) => {
    res.sendFile(__dirname + '/index.html');
});
app.delete('/delete-file',(req,res) =>{
    console.log(req.body.filename);
    fs.unlink(req.body.filename, function (err) {
        if (err) throw err;
        console.log('File deleted!');
        res.send("file delete");
      });
});
app.post('/renamefile',(req,res) =>{
    fs.rename(req.body.filename, req.body.renames, function (err) {
        if (err) throw err;
        res.send('File Renamed!');
      });
    
});

app.post('/uploadfile',upload.single('myfile'), (req,res,next) =>{
    const file=req.file;
    if(!file){
        const error=new Error("please upload a file");
        error.httpStatusCode=400;
        return next(error);
    }
    
    res.send(file);
});


app.post("/uploadmultiple",upload.array('myfiles',12),(req,res,next) =>{
    const files=req.files;
    if(!files){
        const error=new Error("please upload a file");
        error.httpStatusCode=400;
        return next(error);
    }
    res.send(files);

});
app.put("/uploadphoto",upload.single('myimage'),(req,res) =>{
    var img = fs.readFileSync(req.file.path); 
    var encode_img = img.toString('base64');
    //define json for image
     var final_img = {
        contentType:req.file.mimetype,
        path:req.file.path,
        image:new Buffer(encode_img,'base64')
    };
    const directoryPath = path.join(__dirname, 'uploads');

        //passsing directoryPath and callback function
        app.post("/show",(req,res)=>{fs.readdir(directoryPath, function (err, files,res) {
            //handling error
            var filess=req.files;
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            } 
            //listing all files using forEach
            files.forEach(function (file) {
                // Do whatever you want to do with the file
                res.sendFile(file); 
      
            });
        });
    });
//insert into database

db.collection('image').insertOne(final_img,(err,result) =>{
    console.log(result);
    if(err) return console.log(err);
    console.log("saved to database");
    res.contentType(final_img.contentType);
    res.send(final_img.image);
});


});

// app.listen(5000,() => {
//     console.log("server is listning on 5000");
// });