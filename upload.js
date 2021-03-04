const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
require('dotenv/config')
//const uuid=require('uuid/v4')
const aws=require('aws-sdk')
const port=process.env.PORT ||8000
// default options
app.use(fileUpload());
const s3=new aws.S3({
  accessKeyId:process.env.AWS_ID,
  secretAccessKey:process.env.AWS_SECRET
})
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
    //res.json({ message: 'WELCOME' });   
});
app.post('/upload', function(req, res) {
  console.log("HI bro")
  let sampleFile;
  let uploadPath;
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.sampleFile;
  uploadPath = __dirname +'/uploads/'+ sampleFile.name;
  //console.log("sample file",sampleFile)
  let myfile=sampleFile.name.split(".");
  //console.log("myfile",myfile);
  let filetype=myfile[myfile.length-1];
  //console.log("filetype",filetype)
  let r = Math.random().toString(36).substring(7);
  console.log("random", r);
  const params={
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${r}.${filetype}`,
    Body: sampleFile.data
}
console.log("params",params)
s3.upload(params,(error,data)=>{
  console.log("inside s3")
  if(error){
      return res.status(404).send(error)
  } else {
    return res.status(202).send(data.Location)  
    console.log("Passed in AWS upload",data);
      
  }
  })

 // Use the mv() method to place the file somewhere on your server
  // sampleFile.mv(uploadPath, function(err) {
  //   if (err)
  //     return res.status(500).send(err);

  //   res.send('File uploaded!');
  // });
});
app.listen(port,()=>{
  console.log("Server is sup")
})