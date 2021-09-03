

const validarStgToNmb = ( stg ) => {

    const num = Number(stg)

    if(!num){
        throw new Error('El campo debe ser numerico');
    }
}

module.exports={
    validarStgToNmb
}