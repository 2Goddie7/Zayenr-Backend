import app from './server.js'
import connection from './database.js'


connection()

app.listen(app.get('port'),()=>{
    console.log("-----> Servido en Funcionamiento")
})

