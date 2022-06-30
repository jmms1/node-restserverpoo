const { Buro, Persona, Facturacion } = require("../models");
const { getBC, buroConstructor } = require("./buroKiban");
const { getSatTopClients, getSatTopProv, getSatBancos, incomeInsight, metaDataInsight, taxStatusExtractor, balanceInsight, financialRatios, financialRisks } = require("./satws-connect");

const getInfoBC = async (id, personaid) => {

    try {
        const {data} = await getBC(id);

        const newburo = buroConstructor(data);      

        const sic = await new Buro(newburo);
        sic.save();

        const personaSIC = await Persona.findByIdAndUpdate(personaid, { consultasBC: sic._id  }, { new:true ,upsert:true });

        return personaSIC; 
               
    } catch (error) {

        console.log(error);
        return error;
        
    }

}

const getInfoSAT = async ( id , personaid ) => {
    
    const {ventas, clientes} = await getSatTopClients(id);

    const {gastos, proveedores} = await getSatTopProv(id);

    const {institucionesfinancieras, gastosfinancieros} = await getSatBancos(id);

    const balance = await balanceInsight(id);

    const income = await  incomeInsight(id);

    const metadata = await metaDataInsight(id);

    const status = await taxStatusExtractor(id);

    const financialRatio = await financialRatios(id);

    const fRisks = await financialRisks(id);

    const facturacion = {};
    facturacion.clientes = clientes;
    facturacion.proveedores = proveedores;
    facturacion.institucionesFinancieras = institucionesfinancieras;
    facturacion.estadoResultados = income; 
    facturacion.balanceGeneral = balance
    facturacion.metadata = metadata;
    facturacion.taxStatus = status;
    facturacion.financialRatios = financialRatio;
    facturacion.risks = fRisks;


    const newFacturacion = await new Facturacion(facturacion);
    newFacturacion.save();
    const idMongo = newFacturacion._id;

    const personaSAT = await Persona.findByIdAndUpdate(personaid, {
        'consultasFacturacion': idMongo,
        'solicitud.facturacion.ventas': ventas, 
        'solicitud.facturacion.gastos': gastos, 
        'solicitud.facturacion.gastosfinancieros':gastosfinancieros }, { new:true ,upsert:true });



    return personaSAT;


}


module.exports={
    getInfoBC,
    getInfoSAT
}