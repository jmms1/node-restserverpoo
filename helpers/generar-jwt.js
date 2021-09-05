const jwt = require('jsonwebtoken');




const generarJWT =  (uid='') => {

    return new Promise((resolve, reject) => {

        const payload = { uid };

        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn:'3d'
        }, (err, token) => {

            if(err){
                console.log(err);
                reject('No se genero el token')
            } else {
                resolve( token );
            }
        } )
    })




}



module.exports={
    generarJWT
}