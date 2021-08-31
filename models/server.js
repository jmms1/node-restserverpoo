const express = require('express');
const cors = require('cors');



class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        //Middlewares
        this.middlewares();

        //Rutas de mi aplicacion

        this.routes();
    }

    middlewares() {

        //CORS
        this.app.use( cors() );
        //Parseo y lectura del body
        this.app.use( express.json() );
        //DIrectorio Publico
        this.app.use( express.static('public'))

    }

    routes( ) {

        this.app.use( this.usuariosPath, require('../routes/user'));


    }

    listen() {
        this.app.listen( this.port , () => {
            console.log(`Example app CORS-enabled listening at http://localhost:`, this.port )
        });
    }


}

module.exports = Server;