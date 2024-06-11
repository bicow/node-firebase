//npm install express --save
//npm install express-handlebars
//npm install body-parser
//npm install firebase
//npm install firebase-admin
//npm install nodemon -g

const express = require("express")
const app = express()
const handlebars = require("express-handlebars").engine
const bodyParser = require("body-parser")
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app')
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore')

const serviceAccount = require('./key.json')

initializeApp({
  credential: cert(serviceAccount)
})

const db = getFirestore()

app.engine("handlebars", handlebars({defaultLayout: "main"}))
app.set("view engine", "handlebars")

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get("/", function(req, res){
    res.render("firstPage")
})

//READ
app.get("/consulta", async function(req, res){
    const dataSnapshot = await db.collection('agendamentos').get();
    const data = [];
    dataSnapshot.forEach((doc)=>{
        data.push({
            id: doc.id,
            nome: doc.get('nome'),
            telefone: doc.get('telefone'),
        });
    });
    res.render("consultar", { agendamentos: agendamentos });
});

//UPDATE
app.get("/editar/:id", async function(req, res){
    const dataSnapshot = await db.collection('agendamentos').doc(req.params.id).get();
    const data = {
        id: dataSnapshot.id,
        nome: dataSnapshot.get('nome'),
        telefone:dataSnapshot.get('telefone'),
    };
    res.render("editar", {data});
});

//DELETE
app.get("/excluir/:id", function(req, res) {
    const agendamentoId = req.params.id;

    db.collection('agendamentos').doc(agendamentoId).delete()
        .then(() => {
            console.log('Documento deletado com sucesso');
            res.redirect('/consulta');
        })
        .catch((error) => {
            console.log("Erro ao deletar documento:", error);
            res.status(500).send("Erro ao deletar documento");
        });
});

//CREATE
app.post("/cadastrar", function(req, res){
    var result = db.collection('agendamentos').add({
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data_contato: req.body.data_contato,
        observacao: req.body.observacao
    }).then(function(){
        console.log('Added document');
        res.redirect('/')
    })
})

app.post("/atualizar", function(req, res){
    var result = bd
    .collection("agendamento")
    .doc(req.body.id)
    .update({
        nome: req.body.nome,
        telefone: req.body.telefone,
    })
    .then(function() {
        console.log("Updated document");
        res.redirect("/consultar");
    })
})

app.listen(8081, function(){
    console.log("Servidor ativo!")
})