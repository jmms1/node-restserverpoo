
const validarRfc = ( id ) => {

    const rfc = id; 


    if(rfc.length == 13 || rfc.length == 12){
        return true; 
    }
    throw new Error ( `El RFC  ${rfc}, no es permitido`)        
    
}


module.exports = {
    validarRfc
}

