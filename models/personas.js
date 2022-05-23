const { Schema, model } = require('mongoose');

const PersonaSchema = Schema({
    tipo_persona: {
        type: String,
        required: [true, 'El tipo es obligatorio'],
    },
    solicitud:{
        nombre: String, 
        apellido_P: String,
        apellido_M: String,
        RFC_PF: String,
        CURP: String, 
        razon_Social: String,
        RFC_PM: String,
        email: String, 
        celular: String, 
        telefono_1: String,
        telefono_2: String,
        nombre_comercial: String,
        distrito_crm_id: Number,    
        distrito_ojectid:  Number,
        monto_solicitado: Number,
        plazo_solicitado: Number,
        ventas_solicitud: Number,
        antiguedad_solicitud: String,
        necesidad_solicitud: String,
        giro: String,
        sitio_web: String,
        sitio_facebook: String,
        actividad_especifica: String,
        empleados: String,
        destino: String,
        urgencia_de_financiamiento: String,
        tpv: Boolean,
        garantia: String,
        exportacion: Boolean,
        numero_de_empleados: String,
        clientes_pagan_a_credito:Boolean,
        edad: String,
        estado_civil: String,
        fecha_nacimiento: String,
        fecha_registro: Date,
        propietarios_hs: String,
        ip_del_solicitante: String,
        referencias: [{
            nombre: String,
            telefono: Number,
            parentesco: String,
        }],
        domicilio_Negocio:{
            calle: String,
            numero_E: String,
            numero_I: String, 
            codigo_Postal: Number, 
            colonia: String, 
            municipio: String, 
            estado: String, 
    
        },
        domicilio_Particular:{
            calle: String,
            numero_E: String,
            numero_I: String, 
            codigo_Postal: Number, 
            colonia: String, 
            municipio: String, 
            estado: String, 
        }, 
        fotos:[ String ], 
        buro:{
            hipotecario: Boolean,
            automotriz: Boolean,
            tarjeta: Boolean,
            digitos_tdc: Number,
        
            score: {
                type: Number,
            },
            unykoo_id: {
                type: Number,
            },
            
        },
        facturacion:{
            status_ciec: Boolean,
            status_satws: String,
            data_code: String,
            ventas: Number, 
            gastos: Number, 
            gastosfinancieros: Number
        },
    },
    asyncTasks: {
        getFacturacion:{
            status: Boolean,
            date: Date,
            error: String
        }

    },
    notes:[{
        note: String,
        date: Date,
        usuario: String
    }],    
    consultasBC: {
        type: Schema.Types.ObjectId,
        ref:'Buro',
    },
    consultasFacturacion: {
        type: Schema.Types.ObjectId,
        ref:'Facturacion',
    },
    estado: {type: Boolean, default: true},
    notas: [{ nota:String, usuario:Number }],
    etapa: {type: String, default: 'pre-analisis'},
    creacionDb:{ type: Date, default: Date.now}

})



// ProductoSchema.methods.toJSON = function(){
//     const{ __v, estado, ...producto} = this.toObject();
//     return producto;
// }



module.exports= model('Persona', PersonaSchema)


