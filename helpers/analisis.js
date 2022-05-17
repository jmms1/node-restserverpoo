const { Buro, Persona, Facturacion } = require("../models");
const { getBC, buroConstructor } = require("./buroKiban");
const { getSatTopClients, getSatTopProv, getSatBancos } = require("./satws-connect");

//Obtener info buro y facturacion

const getInfoBC = async (id, personaid) => {

    try {
        const {data} = await getBC(id);

        const newburo = buroConstructor(data);      

        const sic = await new Buro(newburo);
        sic.save();

        const personaSIC = await Persona.findByIdAndUpdate(personaid, { consultasBC: sic._id  }, { new:true ,upsert:true });

        return {sic, personaSIC}; 
               
    } catch (error) {

        console.log(error);
        return error;
        
    }

}

const getInfoSAT = async ( id , personaid ) => {
    
    const {ventas, clientes} = await getSatTopClients(id);

    const {gastos, proveedores} = await getSatTopProv(id);

    const {institucionesfinancieras, gastosfinancieros} = await getSatBancos(id);

    const facturacion = {};
    facturacion.clientes = clientes;
    facturacion.proveedores = proveedores;
    facturacion.institucionesFinancieras = institucionesfinancieras;

    const newFacturacion = await new Facturacion(facturacion);
    newFacturacion.save();
    const idMongo = newFacturacion._id;

    const personaSAT = await Persona.findByIdAndUpdate(personaid, {
        'consultasFacturacion': idMongo,
         'solicitud.facturacion.ventas': ventas, 
         'solicitud.facturacion.gastos': gastos, 
         'solicitud.facturacion.gastosfinancieros':gastosfinancieros }, { new:true ,upsert:true });

    return {newFacturacion, personaSAT };

}



//Elabora un modelo de analisis parametrico con la info obtenida 
const parametrico = () => {



}

module.exports={
    getInfoBC,
    parametrico,
    getInfoSAT
}