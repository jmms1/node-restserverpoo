
const path = require('path');
const { v4: uuidv4 } = require('uuid');


const extencionesIMG = ['png','jpg','jpeg','gif','webm'];

const subirArchivo = ( files, extensionesValidas = extencionesIMG, carpeta = '' ) => {
    
    return new Promise( ( resolve, reject ) => {

        const {archivo} = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[ nombreCortado.length -1];
        

        if(!extensionesValidas.includes(extension)){
            return reject(`La extensión ${extension} no es permitida, ${extensionesValidas}`)
        }
    
        const nombreTemp = uuidv4()+ '.' + extension;
        const uploadPath = path.join(__dirname,'../uploads/',carpeta, nombreTemp);
    
        archivo.mv(uploadPath, (err) => {
            if (err){
                reject(err);
            }

            resolve(nombreTemp);
        });
    })
}



module.exports = {
    subirArchivo
}