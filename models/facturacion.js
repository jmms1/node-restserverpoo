const { Schema, model } = require('mongoose');


const FacturacionSchema = Schema({

    estadoResultados:[],
    balanceGeneral:[],
    financialRatios:[],
    metadata:[{
        date: Date,
        data:{},
    }],
    taxStatus:[],
    risks:[],
    clientes:[{
            name: String,
            rfc: String,
            total: Number,
            share: Number,
            transactions: []
    }],
    proveedores: [{
        name: String,
        rfc: String,
        total: Number,
        share: Number,
        transactions: []
    }],
    empleados:[{
        total: Number,
        date: String,
        dateLabel: String
    }],
    institucionesFinancieras:[{
        rfc: String,
        legalName: String,
        tradeName: String,
        website: String,
        sector: String,
        total: Number,
        transactions: []
    }],
    ratiosFinancieros:[],

})

module.exports= model('Facturacion', FacturacionSchema);