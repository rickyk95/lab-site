const express = require('express')
const app = express()
const router = require('./routes/routes.js')
const exphbs = require('express-handlebars')
const path = require('path')


app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({extended:false}))
app.use(router)

app.set('view engine','handlebars')
app.engine('handlebars',exphbs(

    ))
 app.listen(5500,()=>{
    
    console.log("Listening on 5500")    

    })
     
app.get('/',(req,res)=>{
    
    res.render('index',{layout:false})
})




  
    









