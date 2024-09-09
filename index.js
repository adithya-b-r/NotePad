const express = require('express')
const path = require('path')
const fs = require('fs')
const { log } = require('console')
const app = express()


app.set("view engine", "ejs")
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))

app.get('/', function (req, res) {
  fs.readdir('./files', function (err, files) {
    res.render("index", { files: files })
  })
})

app.post('/create', function(req, res){
  fs.writeFile(`./files/${req.body.title.split(' ').join('').replace('.txt','')}.txt`, req.body.details, function(err){
    res.redirect("/")
  })
})

app.get('/file/:filename', function(req, res){
  fs.readFile(`./files/${req.params.filename}`, "utf-8", function(err, fileData){
    if(err){
      console.error("File Not Found : "+err)
    }else{
      res.render("show", {fileName: req.params.filename, fileContent: fileData})
    }
  })
})

app.get('/edit/:filename', function(req, res){
  fs.readFile(`./files/${req.params.filename}`, "utf-8", function(err, fileData){
    if(err){
      console.error("File Not Found : "+err)
    }else{
      res.render("edit", {fileName: req.params.filename, fileContent: fileData})
    }
  })
})
function deleteFile(filePath){
  fs.unlink(filePath, function (err) {
    if (err)
      console.error("Error : " + err)
  })
}

app.post('/editFile', function(req, res){

  newFile = `./files/${req.body.title.split(' ').join('').replace('.txt','')}.txt`

  deleteFile(`./files/${req.body.previousName}`)

  fs.writeFile(newFile, req.body.details, function(err){
    res.redirect("/")
  })
})

app.listen(3000)