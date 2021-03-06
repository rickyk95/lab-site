const express = require('express')
const app = express()
const router = require('./routes/routes.js')
const exphbs = require('express-handlebars')
const path = require('path')
const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({extended:false}))
app.use(router)

app.set('view engine','handlebars')
app.engine('handlebars',exphbs(

    ))

 app.listen(port,()=>{
    
    console.log("Listening on",port)    

    })
     
app.get('/',(req,res)=>{
    
    res.render('index',{layout:false},(error,html)=>{

        if(error){
  
          console.log(error)
          res.status(404).send("<h1 style='text-align:center;'> Se ha econtrado un error </h1>")
  
        }else{
  
          res.status(200).send(html)
  
        }
      })
})




  
    









