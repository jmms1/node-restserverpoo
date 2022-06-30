const { Schema, model } = require('mongoose');


const BuroSchema = Schema({

    status: String,

    scoreBuroCredito: [
        {
            nombreScore: String,
            codigoScore: String,
            valorScore: Number,
        }
    ],

    respuestaBCPF:[{

        encabezado: {
            version: String,
            numeroReferenciaOperador: String,
            clavePais: String,
            claveOtorgante: String,
            claveRetornoConsumidorPrincipal: String,
            numeroControlConsulta: Number
        },
        nombre: {
            apellidoPaterno: String,
            apellidoMaterno: String,
            primerNombre: String,
            segundoNombre: String,
            fechaNacimiento: String,
            RFC: String,
            nacionalidad: String,
            residencia: String,
            estadoCivil: String,
            sexo: String,
            curp: String,
            claveOtroPais: String
        },
        domicilios: [
            {
                direccion1: String,
                coloniaPoblacion: String,
                delegacionMunicipio: String,
                ciudad: String,
                estado: String,
                CP: String,
                tipoDomicilio: String,
                indicadorEspecialDomicilio: String,
                origenDelDomicilio: String,
                fechaReporteDireccion: String
            }
        ],
        empleos: [
            {
                nombreEmpresa: String,
                direccion1: String,
                coloniaPoblacion: String,
                delegacionMunicipio: String,
                ciudad: String,
                estado:String,
                CP:String,
                numeroTelefono:String,
                cargo:String,
                fechaReportoEmpleo:String
            }
        ],
        cuentas: [
            {
                fechaActualizacion: String,
                nombreOtorgante: String,
                identificadorSociedadInformacionCrediticia: String,
                indicadorTipoResponsabilidad: String,
                tipoCuenta: String,
                tipoContrato: String,
                claveUnidadMonetaria: String,
                frecuenciaPagos: String,
                montoPagar: Number,
                fechaAperturaCuenta: String,
                fechaUltimoPago: String,
                fechaUltimaCompra: String,
                fechaCierreCuenta: String,
                fechaHistoricaMorosidadMasGrave: String,
                importeSaldoMorosidadHistMasGrave: Number,
                mopHistoricoMorosidadMasGrave: String,
                numeroPagos: Number,
                numeroPagosVencidos: Number,
                tipoContrato:String,
                fechaReporte: String,
                modoReportar: String,
                creditoMaximo: Number,
                saldoActual: Number,
                limiteCredito: Number,
                saldoVencido: Number,
                formaPagoActual: String,
                historicoPagos: String,
                fechaMasRecienteHistoricoPagos: String,
                fechaMasAntiguaHistoricoPagos: String,
                montoUltimoPago: Number
            }
     
        ],
        consultasEfectuadas: [
            {
                fechaConsulta: String,
                identificacionBuro: String,
                claveOtorgante: String,
                nombreOtorgante: String,
                tipoContrato: String,
                claveUnidadMonetaria: String,
                importeContrato: Number,
                indicadorTipoResponsabilidad: String
            },
        ],
        historicoSaldos: [],
        resumenReporte: [
            {
                fechaIngresoBD: String,
                numeroMOP7: String,
                numeroMOP6: String,
                numeroMOP5: String,
                numeroMOP4: String,
                numeroMOP3: String,
                numeroMOP2: String,
                numeroMOP1: String,
                numeroMOP0: String,
                numeroMOPUR: String,
                numeroCuentas: Number,
                cuentasPagosFijosHipotecas: Number,
                cuentasRevolventesAbiertas: Number,
                cuentasCerradas: Number,
                cuentasNegativasActuales: Number,
                cuentasClavesHistoriaNegativa: Number,
                cuentasDisputa: Number,
                numeroSolicitudesUltimos6Meses: Number,
                nuevaDireccionReportadaUltimos60Dias: String,
                existenciaDeclaracionesConsumidor: String,
                tipoMoneda: String,
                totalCreditosMaximosRevolventes: Number,
                totalLimitesCreditoRevolventes: Number,
                totalSaldosActualesRevolventes: Number,
                totalSaldosVencidosRevolventes: Number,
                totalPagosRevolventes: Number,
                pctLimiteCreditoUtilizadoRevolventes: Number,
                totalCreditosMaximosPagosFijos: Number,
                totalSaldosActualesPagosFijos: Number,
                totalSaldosVencidosPagosFijos: Number,
                totalPagosPagosFijos: Number,
                numeroMOP96: String,
                numeroMOP97: String,
                numeroMOP99: String,
                fechaAperturaCuentaMasAntigua: String,
                fechaAperturaCuentaMasReciente: String,
                totalSolicitudesReporte: Number,
                fechaSolicitudReporteMasReciente: String,
                numeroTotalCuentasDespachoCobranza: Number,
                numeroTotalSolicitudesDespachosCobranza: Number
            }
        ],
        hawkAlertConsulta: [
            {
                fechaReporte: String,
                codigoClave: String,
                tipoInstitucion: String ,
                mensaje: String
            }
        ],
        hawkAlertBD: [
            {
                fechaReporte:String,
                codigoClave: String,
                tipoInstitucion: String,
                mensaje: String
            },
    
        ],
        scoreBuroCredito: [],
        sintetiza: []
    }],

    respuestaBCPM:[{

        HD: {
            identificadorArchivoConsulta: String,
            numeroReferenciaOperador: String ,
            claveRetorno: String ,
            identificadorConsulta: String ,
            fechaConsulta: String
        },
        EM: {
            identificadorConsulta: String,
            tipoCliente: String,
            rfc: String,
            nombreCliente: String,
            direccion1: String,
            coloniaPoblacion: String,
            delegacionMunicipio: String,
            ciudad: String,
            estado: String,
            codigoPostal: String,
            paisOrigenDomicilio: String,
            nacionalidad: String,
            consultasEntidadesFinancierasUltimos3Meses: String,
            consultasEntidadesFinancierasUltimos12Meses: String,
            consultasEntidadesFinancierasUltimos24Meses: String,
            consultasEntidadesFinancierasHaceMas24Meses: String,
            consultasEmpresasComercialesUltimos3Meses: String,
            consultasEmpresasComercialesUltimos12Meses: String,
            consultasEmpresasComercialesUltimos24Meses: String,
            consultasEmpresasComercialesHaceMas24Meses: String,
            indicadorInformacionAdicional: String
        },
        HCs: [],
        HRs: [
            {
                identificadorSegmento: String,
                fechaMensaje: String,
                codigoHawk: String,
                descripcionPrevencionHawk: String
            }
        ],
        DC: {},
        ACs: [],
        CRs: [],
        HIs: [
            {
                identificadorConsulta: String,
                rfc: String,
                periodo: String
            }
        ],
        COs: [
            {
                identificadorConsulta: String,
                rfc: String,
                identificadorUsuario: String,
                saldoTotal: Number,
                saldoVigente: Number,
                saldoVencido: Number,
                saldoVencido29dias: Number,
                saldoVencido59dias: Number,
                saldoVencido89dias: Number,
                saldoVencido119dias: Number,
                saldoVencido179dias: Number,
                saldoVencido180oMasdias: Number,
                ultimoPeriodoActualizado: String,
                historicoPagos: String
            }
        ],
        SCs: [],
        CNs: [
            {
                identificadorConsulta: String,
                rfcCliente: String,
                fechaConsulta: String,
                tipousuario: String
            },
        ],
        FDs: [],
        ER: {},
        CIs: [
            {
                identificadorArchivoConsulta: String,
                identificadorConsulta: String,
                identificadorTransaccion: String
            }
    
        ]
    }]
    
})

module.exports= model('Buro', BuroSchema);