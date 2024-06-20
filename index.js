const express = require("express");
const fs= require('fs');
const path=require('path');
// const sharp=require('sharp');
// const sass=require('sass');
// const ejs=require('ejs');
 
 
app= express();
console.log("Folder proiect", __dirname);
console.log("Cale fisier", __filename);
console.log("Director de lucru", process.cwd());

app.set("view engine","ejs");

obGlobal = {
    obErori: null
}
 
vect_foldere = ["temp", "backup"]
for(let folder of vect_foldere){
    let cale_folder = path.join(__dirname, folder)
    if(!fs.existsSync(cale_folder)){
        fs.mkdirSync();

    }
}

app.use("/resurse", express.static(__dirname+"/resurse"));
app.use("/css", express.static(__dirname+"/css"));
app.use("/scss", express.static(__dirname+"/scss"));


app.get(["/", "/index", "/home"], function(req, res){
    // res.sendFile(path.join(__dirname, "index.html"));
    res.render("pagini/index", {ip: req.ip});
})

app.get("/favicon.ico", function(req, res){
    res.sendFile(path.join(__dirname, "/resurse/ico/favicon.ico"))
})

app.get("/*.ejs", function(req, res){
    afisareEroare(res, 400)
})

app.get("/*", function (req, res){
    console.log(req.url);
    try{
        res.render("pagini"+req.url, function(err, rezHtml){
            console.log("Eroare "+err);
            console.log("html:"+rezHtml);
            if(err){
                if(err.message.startsWith("Failed to lookup view")){
                    afisareEroare(res, 404);
                    console.log("Nu a gasit pagina", req.url);
                }
            }
            else{
                res.send(rezHtml);
            }
        })
    }
    catch (err1){
        if(err1.message.startsWith("Cannot find module")){
            afisareEroare(res, 404);
            console.log("Nu a gasit resursa", req.url);
            return;
        }
        afisareEroare(res);
    }
})

function initErori(){
    let eroare
    let continut = fs.readFileSync(path.join(__dirname, "resurse/json/erori.json")).toString("utf-8");
    // console.log(continut);
    obGlobal.obErori = JSON.parse(continut);
    for( eroare of obGlobal.obErori.info_erori){
        eroare.imagine = path.join(obGlobal.obErori.cale_baza, eroare.imagine)
    }
    let err_def = obGlobal.obErori.eroare_default
    err_def.imagine = path.join(obGlobal.obErori.cale_baza, eroare.imagine)

}

initErori();
console.log(obGlobal.obErori)

function afisareEroare(res, _identificator, _titlu, _text, _imagine){
    let eroare = obGlobal.obErori.info_erori.find(
        function(elem){
            return elem.identificator==_identificator;
    })
    if(!eroare)
        eroare = obGlobal.obErori.eroare_default;
    res.render("pagini/eroare",

    {
        titlu: _titlu || eroare.titlu,
        text: _text || eroare.text,
        imagine: _imagine || eroare.imagine,
    }
    )
}






app.listen(8080);
console.log("Serverul a pornit");

// app.get("/",function(req, res, next){
//     res.write("My name is who?");
//     res.write("My name is what?");
//     res.write("My name is who?");
//     res.write("My name is ciki ciki sandel");
//     console.log(1);
//     next();
// })

// app.get("/",function(req, res){
//     res.write("End");
//     res.end();
//     console.log(2);
// })
