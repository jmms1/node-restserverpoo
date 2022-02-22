
const validarRfc = ( id ) => {

    const rfc = id; 


    if(rfc.length == 13 || rfc.length == 12){
        return true; 
    }
    throw new Error ( `El RFC  ${rfc}, no es permitido`)        
    
}

const validarCorreo = ( correo ) => {

   if  (/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)/.test(correo)) 

    throw new Error ( `El correo  ingresado ${correo} es invalido`)
}


module.exports = {
    validarRfc,
    validarCorreo
}

