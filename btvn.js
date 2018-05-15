const express = require("express")
let app = express()
const bodyParser = require("body-parser")
const fs = require("fs")

app.use(bodyParser.urlencoded({ extended: false}));


// Khai báo 1 engine mới tên là handlebars 
const handlebars = require("express-handlebars");   
app.engine("handlebars", handlebars({defaultLayout: "main"}))
// Đặt view engine của app là handlebars mới tạo bên trên
app.set("view engine", "handlebars")

app.get('/list', function(req, res){
    // let list = ["12","34","56","78"];
    // let list = [{name: "dfs", id :"0"}]
    let questionList = JSON.parse(fs.readFileSync("./questionList.json", "utf-8"))
    res.render("list", {questionList})
})

app.get('/',function(req,res){
    // res.sendFile(__dirname + "/web.html")
    let questionList = JSON.parse(fs.readFileSync("./questionList.json", "utf-8"))
    let questionID = Math.floor((Math.random() * questionList.length));
    // console.log(questionList)
    // let questionFound = questionList.filter(question => question.id == questionID)[0]
    res.render("home", {
        questionContent: questionList[questionID].questionContent,
        questionID: questionID
    });   
})

app.get('/ask', function(req,res){
    res.render("ask")
})

app.post('/api/question', function(req, res){
    let questionList = JSON.parse(fs.readFileSync("./questionList.json", "utf-8"))
    let newQuestion = {
        questionContent: req.body.question,
        id: questionList.length,
        yes: 0,
        no: 0
    }

    questionList.push(newQuestion); 
    fs.writeFileSync("./questionList.json", JSON.stringify(questionList, "utf-8"))
    res.redirect(`/question/${newQuestion.id}`)
})

app.get('/question/:id', function(req, res){
    let questionID = req.params.id
    let questionList = JSON.parse(fs.readFileSync("./questionList.json", "utf-8"))
    let questionFound = questionList.filter(question => question.id == questionID)[0]
    res.render("question", {
        question: questionFound,
        totalVote: questionFound.yes + questionFound.no,
        voteYes: questionFound.yes,
        voteNo: questionFound.no,
        questionID: questionID
    })
})

app.post('/api/vote/:id/:vote', function(req, res){
    let questionID = req.params.id
    let vote = req.params.vote
    let questionList = JSON.parse(fs.readFileSync("./questionList.json", "utf-8"))

    for (var i = 0; i < questionList.length; i++){
        if (questionList[i].id == questionID){
            if(vote == 1){
                questionList[i].yes += 1
            }
            else if (vote == 0){
                questionList[i].no += 1
                console.log("no")
            }
            else {
                res.send("Question not found")
            }
        }
    }
    fs.writeFileSync("./questionList.json", JSON.stringify(questionList), "utf-8")
    console.log(questionList)
    res.redirect(`/question/${questionID}`)
})


app.listen(8000, function(err){
    if(err) console.log(err)
    else console.log("Sever is up!")
})
