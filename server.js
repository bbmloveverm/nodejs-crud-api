// Old code 
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mysql = require('mysql');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

//Homepage rout
app.get('/',(req,res) =>{
    return res.send({
        error: false,
        message: 'Welcomr to MyApplication Crud API Node Express',
        written_by:'Montree-ri',
        published_on:'https://dee-line.com'
    })
})

//connection to Mysql
let dbcon = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'nodejs'
})

dbcon.connect();


//retrieve all book
app.get('/books',(req,res) =>{
    dbcon.query('select * from books',(error,results,fields) =>{
            if(error) throw error;

            let message = ""
            if(results === undefined || results.length == 0){
                message = "Books table is empty";
            }else{
                message = "Successfully retrieved all books";
            }
            return res.send({
                error:false,
                data: results,
                message: message
            });
    })
})



// add a new book
app.post('/book',(req,res) => {
    let name = req.body.name;
    let author = req.body.author;

    //validation
    if(!name || !author){
        return res.status(400).send({error: true,message:"Please provide book name and auther"});
    }else{
        dbcon.query('insert into books (name,author) values(?,?)',[name,author],(error,results,fields) =>{

            if(error) throw error;
            return res.send({error:false,data:results,message:"Book Successfuly Added"})
        })
    }
})

//retrive book by id
app.get('/book/:id',(req,res) =>{
    let id = req.params.id;
    if(!id){
        return res.status(400).send({error:true, message: "Please provide book id"})
    }else{
        dbcon.query("select * from books where id = ?",id, (error,results,fields) =>{
            if(error) throw error;

            let message = "";
            if(results === undefined || results.length == 0){
                message = "Book not found";
            }else{
                message = "Successfully retrive book data";
            }

            return res.send({error: false, data:results[0], message:message})
        })
    }
})


//update data book with id

app.put('/book', (req,res) =>{

    let id = req.body.id;
    let name = req.body.name;
    let author = req.body.author;

    //validation
    if(!id || !name || !author){
        return res.status(400).send({error: true, message: "Please provide book id, name and author"});
    
    }else{
        dbcon.query('update books set name = ?, author = ? where id = ?',[name,author,id], (error,results,fields) => {
            if(error) throw error;

            let message = "";
            if(results.changedRows === 0){
                message = "Book not found or data are same";
            }else{
                message = "Book successfully update";
            }

            return res.send({error: false, data: results, message: message})
        }) 
    }
})


//Delete data bi id
app.delete('/book',(req,res) =>{
    let id = req.body.id;

    if(!id){
        return res.status(400).send({error: true, message: "Please provide book id"});
    }else{
    
        dbcon.query('delete from books where id=?',[id],(error,results,fields) =>{
            if(error) throw error;
    
            let message = "";
            if(results.affectedRows === 0){
                message = "Book not found";
            }else{
                message = "Book Successfully deleted";
            }
    
            return res.send({error: false, data: results,message: message})
    
        })
    }
})


    

app.listen(3000,() =>{

    console.log('Node App is running or port 3000');
})

module.exports = app; 


