const mongoose = require('mongoose');


const dbConnection = async()=>{

    try {

        await mongoose.connect('mongodb+srv://user_curso_node:GdBnMw1a0aFr7cus@closternd.kpbnt.mongodb.net/cafeDB', { 
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Base de datos on-line');
        
    } catch (error) {
        console.log(error);
        throw new Error( 'Error en la conexión con la base de datos' );
    }


}



module.exports = {
    dbConnection
}