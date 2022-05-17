const { Persona } = require("../models");


const _axios = require("axios").default;
const axios = _axios.create({
    baseURL: 'https://api.hubapi.com/',
    headers: {
        "Content-Type": "application/json"
    }
});
const hapiKey = `?hapikey=${process.env.HUBSPOT_APIKEY}`;
const props = `&properties=regimen, n4_1_nombre, n4_2_apellido_paterno, n4_3_apellido_materno, n3_rfc, curp, n3_16_razon_social, n3_15_rfc_pm, n3_nombre_comercial, numeroderegistro, hs_object_id, amount, n2_2_tiempo_para_pago, n2_5_ventas_anuales, n2_6_antig_edad_del_negocio, necesidad_de_financiamiento, giro, n3_11_sitio_web, n3_12_facebook, n3_actividad_espec_fica, n3_18_numero_de_empleados, n9_1_03_destino_especifico_del_credito, n2_4_urgencia_de_financiamiento, n3_13_tpv, n3_14_garant_a, n3_17_exportacion, n9_1_02_numero_de_empleados, n3_20_clientes_pagan_a_mas_de_30_dias, n4_94_edad, n4_4_estado_civil, n4_5_fecha_de_nacimiento, createdate, hubspot_owner_id, n3_calle, n3_num_ext, n3_num_int, codigo_postal, n3_9_colonia, municipio_negocio, estado_de_la_rep_del_negocio, n4_6_calle, n4_7_num_ext, n4_8_num_int, n4_9_c_p_, n4_91_colonia, municipio_de_la_persona, estado_de_la_rep_de_la_persona, email, celular, telefono, n4_92_tel_fono, n6_1_cr_dito_hipotecario, n6_2_cr_dito_automotriz, n6_3_tarjeta_de_cr_dito, n6_4_tdc_4_d_gitos, score_bc, n10_1_id_unykoo, n4_93_ciec, credenciales_creadas_satws, datacode, n5_1_nombre_referencia, n5_2_tel_fono_referencia, n5_3_parentesco_referencia, n5_4_nombre, n5_5_tel_fono, n5_6_parentesco, n9_8_otros, n9_8_1_otros_2, n9_8_2_otros_3, n9_8_3_otros_4, ip_del_solicitante `;


const getDeal = async (dealId) => {
    
    try {
      const apiResponse = await axios.get(`crm/v3/objects/deals/`+ dealId + hapiKey + props);


      const { properties } = apiResponse.data;

      return properties;


    } catch (e) {

      e.message === 'HTTP request failed'
        ? console.error(JSON.stringify(e.response, null, 2))
        : console.error(e)

        return e
    }

}

const createNote = async (note, propietarios_hs) => {
    
    const data ={ properties : {
        hs_timestamp: new Date,
        hs_note_body: note,
        hubspot_owner_id: propietarios_hs,
    }}
    const url =  `https://api.hubapi.com/crm/v3/objects/notes/${hapiKey}`;
    const axiosPost = _axios.create({
        method:'POST',
        headers: {
            "Content-Type": "application/json",
            "accept": "application/json"
        },
    });
    try {
        const response = await axiosPost.post(url,data);

        console.log(response.data)
        return response.data;
        
    } catch (e) {

        console.log(e.response.data)
    }
    
}

const associateNote = async(noteId, objectId) => {

    const url =  `https://api.hubapi.com/crm/v4/objects/notes/${noteId}/associations/deals/${objectId}${hapiKey}`;
    const axiosPost = _axios.create({
        headers: {
            "Content-Type": "application/json",
            "accept": "application/json"
        },
    });
    const data = [ 
        {
         "associationCategory": "HUBSPOT_DEFINED",
         "associationTypeId": 12
        }
      ]
    try {
        const response = await axiosPost.put(url, data);

        console.log(response)
        return response;
        
    } catch (e) {
        console.log(e);
        return e
    }



}

const personaConstructorDB = (props) => {

    let newpersona = {};
    let solicitud = {};
    let facturacion = {};
    let newdomicilio = {};
    let newdomiciliop = {};
    let referecias = [];
    let fotos= [];
    let buro = {};

    switch (true) {
        case (props.regimen !== undefined) :
            newpersona.tipo_persona = props.regimen
        case (props.regimen !== undefined) && ( props.regimen ==='P.Moral') &&(props.n3_16_razon_social):
            solicitud.razon_social = props.n3_16_razon_social;
        case (props.regimen !== undefined) && ( props.regimen ==='P.Moral') &&(props.n3_15_rfc_pm):
            solicitud.RFC_PM = props.n3_15_rfc_pm;
        case (props.n4_1_nombre !== undefined ):
            solicitud.nombre =props.n4_1_nombre
        case (props.n4_2_apellido_paterno !== undefined ):
            solicitud.apellido_P =props.n4_2_apellido_paterno
        case (props.n4_3_apellido_materno !== undefined ):
            solicitud.apellido_M =props.n4_3_apellido_materno
        case (props.n3_rfc !== undefined ):
            solicitud.RFC_PF =props.n3_rfc
        case (props.curp !== undefined ):
            solicitud.CURP =props.curp
        case (props.email !== undefined ):
            solicitud.email = props.email
        case (props.celular !== undefined ):
            solicitud.celular = props.celular
        case (props.telefono !== undefined ):
            solicitud.telefono_1 = props.telefono
        case (props.n4_92_tel_fono !== undefined ):
            solicitud.telefono_2 = props.n4_92_tel_fono
        case ( props.n3_nombre_comercial !== undefined ):
            solicitud.nombre_comercial = props.n3_nombre_comercial
        case ( props.numeroderegistro !== undefined ):
            solicitud.distrito_crm_id = props.numeroderegistro
        case ( props.hs_object_id !== undefined ):
            solicitud.distrito_ojectid = props.hs_object_id
        case ( props.amount !== undefined ):
            solicitud.monto_solicitado = props.amount
        case ( props.n2_2_tiempo_para_pago !== undefined ):
            solicitud.plazo_solicitado = props.n2_2_tiempo_para_pago
        case ( props.n2_5_ventas_anuales !== undefined ):
            solicitud.ventas_solicitud = props.n2_5_ventas_anuales
        case ( props.n2_6_antig_edad_del_negocio !== undefined ):
            solicitud.antiguedad_solicitud = props.n2_6_antig_edad_del_negocio
        case ( props.necesidad_de_financiamiento !== undefined ):
            solicitud.necesidad_solicitud = props.necesidad_de_financiamiento
        case ( props.giro !== undefined ):
            solicitud.giro = props.giro
        case ( props.n3_11_sitio_web !== undefined ):
            solicitud.sitio_web = props.n3_11_sitio_web
        case ( props.n3_12_facebook !== undefined ):
            solicitud.sitio_facebook = props.n3_12_facebook
        case ( props.n3_actividad_espec_fica !== undefined ):
            solicitud.actividad_especifica = props.n3_actividad_espec_fica
        case ( props.n3_18_numero_de_empleados !== undefined ):
            solicitud.empleados = props.n3_18_numero_de_empleados
        case ( props.n9_1_03_destino_especifico_del_credito !== undefined ):
            solicitud.destino = props.n9_1_03_destino_especifico_del_credito
        case ( props.n2_4_urgencia_de_financiamiento !== undefined ):
            solicitud.urgencia_de_financiamiento = props.n2_4_urgencia_de_financiamiento
        case ( props.n3_14_garant_a !== undefined ):
            solicitud.garantia = props.n3_14_garant_a
        case ( props.n9_1_02_numero_de_empleados !== undefined ):
            solicitud.numero_de_empleados = props.n9_1_02_numero_de_empleados
        case ( props.n4_94_edad !== undefined ):
            solicitud.edad = props.n4_94_edad
        case ( props.n4_4_estado_civil !== undefined ):
            solicitud.estado_civil = props.n4_4_estado_civil
        case ( props.n4_5_fecha_de_nacimiento !== undefined ):
            solicitud.fecha_nacimiento = props.n4_5_fecha_de_nacimiento
        case ( props.createdate !== undefined ):
            solicitud.fecha_registro = props.createdate
        case ( props.hubspot_owner_id !== undefined ):
            solicitud.propietarios_hs = props.hubspot_owner_id
        case ( props.ip_del_solicitante !== undefined ):
            solicitud.ip_del_solicitante = props.ip_del_solicitante
        case ( props.n3_13_tpv !== undefined ) && ( props.n3_13_tpv === 'No' ):
            solicitud.tpv = false
        case ( props.n3_13_tpv !== undefined ) && ( props.n3_13_tpv != 'No' ):
            solicitud.tpv = true
        case ( props.n3_17_exportacion !== undefined ) && (props.n3_17_exportacion === 'No' ):
            solicitud.exportacion = false
        case ( props.n3_17_exportacion !== undefined ) && (props.n3_17_exportacion != 'No' ):
            solicitud.exportacion = true
        case ( props.n3_20_clientes_pagan_a_mas_de_30_dias !== undefined ) && (props.n3_20_clientes_pagan_a_mas_de_30_dias === 'No' ):
            solicitud.clientes_pagan_a_credito = false
        case ( props.n3_20_clientes_pagan_a_mas_de_30_dias !== undefined ) && (props.n3_20_clientes_pagan_a_mas_de_30_dias != 'No' ):
            solicitud.clientes_pagan_a_credito = true
    //BURO 
        case (props.n6_1_cr_dito_hipotecario === 'No') :
            buro.hipotecario = false
        case (props.n6_1_cr_dito_hipotecario !== undefined) :
            buro.hipotecario = true
        case (props.n6_2_cr_dito_automotriz=== 'No') :
            buro.automotriz = false
        case (props.n6_2_cr_dito_automotriz !== undefined) :
            buro.automotriz = true
        case (props.n6_3_tarjeta_de_cr_dito === 'No') :
            buro.tarjeta = false
        case (props.n6_3_tarjeta_de_cr_dito !== undefined) :
            buro.tarjeta = true
        case (props.n6_4_tdc_4_d_gitos !== undefined ):
            buro.digitos_tdc = props.n6_4_tdc_4_d_gitos
        case (props.score_bc !== undefined ):
            buro.score = props.score_bc
        case (props.n10_1_id_unykoo !== undefined ):
            buro.unykoo_id = props.n10_1_id_unykoo
    //Facturacion
        case (  props.n4_93_ciec !== undefined  ) : 
            facturacion.status_ciec = true	
        case (props.credenciales_creadas_satws !== undefined ) : 
            facturacion.status_satws = props.credenciales_creadas_satws	
        case (props.datacode !== undefined ) : 
            facturacion.data_code = props.datacode 	
    //Domicilio Negocio
        case ( props.n3_calle !== undefined ): 
            newdomicilio.calle = props.n3_calle 
        case ( props.n3_num_ext !== undefined ): 
            newdomicilio.numero_E = props.n3_num_ext 
        case ( props.n3_num_int !== undefined ): 
            newdomicilio.numero_I = props.n3_num_int 
        case ( props.codigo_postal !== undefined ): 
            newdomicilio.codigo_Postal = props.codigo_postal 
        case ( props.n3_9_colonia !== undefined ): 
            newdomicilio.colonia = props.n3_9_colonia 
        case ( props.municipio_negocio !== undefined ): 
            newdomicilio.municipio = props.municipio_negocio 
        case ( props.estado_de_la_rep_del_negocio !== undefined ): 
            newdomicilio.estado = props.estado_de_la_rep_del_negocio 
    //Domicilio Particular 
        case (props.n4_6_calle !== undefined ): 
            newdomiciliop.calle = props.n4_6_calle	
        case (props.n4_7_num_ext !== undefined ): 
            newdomiciliop.numero_E = props.n4_7_num_ext	
        case (props.n4_8_num_int !== undefined ): 
            newdomiciliop.numero_I = props.n4_8_num_int	
        case (props.n4_9_c_p_ !== undefined ): 
            newdomiciliop.codigo_Postal = props.n4_9_c_p_	
        case (props.n4_91_colonia !== undefined ): 
            newdomiciliop.colonia = props.n4_91_colonia	
        case (props.municipio_de_la_persona !== undefined ): 
            newdomiciliop.municipio = props.municipio_de_la_persona	
        case (props.estado_de_la_rep_de_la_persona !== undefined ): 
            newdomiciliop.estado = props.estado_de_la_rep_de_la_persona	
    }

    //Referencias

    if( props.n5_1_nombre_referencia && props.n5_2_tel_fono_referencia && props.n5_3_parentesco_referencia) {
        let referecia = {};
        referecia.nombre = props.n5_1_nombre_referencia 
        referecia.telefono = props.n5_2_tel_fono_referencia 
        referecia.parentesco = props.n5_3_parentesco_referencia

        referecias.push(referecia);
    }

    if( props.n5_4_nombre && props.n5_5_tel_fono && props.n5_6_parentesco) {
        let referecia2 = {};
        referecia2.nombre = props.n5_4_nombre 
        referecia2.telefono = props.n5_5_tel_fono 
        referecia2.parentesco = props.n5_6_parentesco

        referecias.push(referecia2);
    }

    //URLS FOTOS Negocio
    
    if(props.n9_8_otros){ fotos.push( props.n9_8_otros )}
    if(props.n9_8_1_otros_2){ fotos.push( props.n9_8_1_otros_2 )}
    if(props.n9_8_2_otros_3){ fotos.push( props.n9_8_2_otros_3 )}
    if(props.n9_8_3_otros_4){ fotos.push( props.n9_8_3_otros_4 )}

    newpersona.solicitud = solicitud;
    newpersona.solicitud.buro = buro;
    newpersona.solicitud.facturacion = facturacion;
    newpersona.solicitud.domicilio_Negocio = newdomicilio;
    newpersona.solicitud.domicilio_Particular = newdomiciliop;
    newpersona.solicitud.referencias = referecias;  
    newpersona.solicitud.fotos = fotos;

    const persona = new Persona ( newpersona );

    persona.save();

    
    return {
        persona: persona
    };


}

module.exports={
    getDeal,
    personaConstructorDB,
    createNote,
    associateNote
}

    // //Persona
    // if( props.regimen ){ newpersona.tipo_persona = props.regimen }
    // if( props.regimen ==='P.Moral'){ 

    //     if( props.n3_16_razon_social){ newpersona.razon_social = props.n3_16_razon_social }
    //     if( props.n3_15_rfc_pm){ newpersona.RFC_PM = props.n3_15_rfc_pm }

    // }
	// if( props.n4_1_nombre ){ newpersona.nombre = props.n4_1_nombre }
	// if( props.n4_2_apellido_paterno ){ newpersona.apellido_P = props.n4_2_apellido_paterno }
	// if( props.n4_3_apellido_materno ){ newpersona.apellido_M = props.n4_3_apellido_materno }
	// if( props.n3_rfc ){ newpersona.RFC_PF = props.n3_rfc }
	// if( props.curp ){ newpersona.CURP = props.curp }

    // //Contacto 
    // if(props.email ){ newpersona.email = props.email}	
    // if(props.celular ){ newpersona.celular = props.celular}	
    // if(props.telefono ){ newpersona.telefono_1 = props.telefono}	
    // if(props.n4_92_tel_fono ){ newpersona.telefono_2 = props.n4_92_tel_fono}
    
    // //Solicitud
    // if( props.n3_nombre_comercial ){ solicitud.nombre_comercial = props.n3_nombre_comercial}
	// if( props.numeroderegistro ){ solicitud.distrito_crm_id = props.numeroderegistro}
	// if( props.hs_object_id ){ solicitud.distrito_ojectid = props.hs_object_id}
	// if( props.n2_00_monto_solicitado ){ solicitud.monto_solicitado = props.n2_00_monto_solicitado}
	// if( props.n2_2_tiempo_para_pago ){ solicitud.plazo_solicitado = props.n2_2_tiempo_para_pago}
	// if( props.n2_5_ventas_anuales ){ solicitud.ventas_solicitud = props.n2_5_ventas_anuales}
	// if( props.n2_6_antig_edad_del_negocio ){ solicitud.antiguedad_solicitud = props.n2_6_antig_edad_del_negocio}
	// if( props.necesidad_de_financiamiento ){ solicitud.necesidad_solicitud = props.necesidad_de_financiamiento}
	// if( props.giro ){ solicitud.giro = props.giro}
	// if( props.n3_11_sitio_web ){ solicitud.sitio_web = props.n3_11_sitio_web}
	// if( props.n3_12_facebook ){ solicitud.sitio_facebook = props.n3_12_facebook}
	// if( props.n3_actividad_espec_fica ){ solicitud.actividad_especifica = props.n3_actividad_espec_fica}
	// if( props.n3_18_numero_de_empleados ){ solicitud.empleados = props.n3_18_numero_de_empleados}
	// if( props.n9_1_03_destino_especifico_del_credito ){ solicitud.destino = props.n9_1_03_destino_especifico_del_credito}
	// if( props.n2_4_urgencia_de_financiamiento ){ solicitud.urgencia_de_financiamiento = props.n2_4_urgencia_de_financiamiento}
	// if( props.n3_13_tpv ){ if( props.n3_13_tpv === 'No' ){ solicitud.tpv = false} else solicitud.tpv = true }
	// if( props.n3_17_exportacion ){ if(props.n3_17_exportacion === 'No' ){solicitud.exportacion = false} else solicitud.exportacion = true }
	// if( props.n3_20_clientes_pagan_a_mas_de_30_dias ){ if(props.n3_20_clientes_pagan_a_mas_de_30_dias === 'No' ){
    //      solicitud.clientes_pagan_a_credito = false} else {solicitud.clientes_pagan_a_credito = true}}
	// if( props.n3_14_garant_a ){ solicitud.garantia = props.n3_14_garant_a}
	// if( props.n9_1_02_numero_de_empleados ){ solicitud.numero_de_empleados = props.n9_1_02_numero_de_empleados}
	// if( props.n4_94_edad ){ solicitud.edad = props.n4_94_edad}
	// if( props.n4_4_estado_civil ){ solicitud.estado_civil = props.n4_4_estado_civil}
	// if( props.n4_5_fecha_de_nacimiento ){ solicitud.fecha_nacimiento = props.n4_5_fecha_de_nacimiento}
	// if( props.createdate ){ solicitud.fecha_registro = props.createdate}
	// if( props.hubspot_owner_id ){ solicitud.propietarios_hs = props.hubspot_owner_id}
	// if( props.ip_del_solicitante ){ solicitud.ip_del_solicitante = props.ip_del_solicitante}
    
    // //buro
    // if(props.n6_1_cr_dito_hipotecario ){if(props.n6_1_cr_dito_hipotecario === 'No' ){
    //      buro.hipotecario = false } else {buro.hipotecario = true }	}	
    // if(props.n6_2_cr_dito_automotriz ){ if(props.n6_2_cr_dito_automotriz === 'No' ){
    //     buro.automotriz = false } else {buro.automotriz = true}}	
    // if(props.n6_3_tarjeta_de_cr_dito ){if(props.n6_3_tarjeta_de_cr_dito === 'No' ){
    //     buro.tarjeta = false } else {buro.tarjeta = true}}	
    // if(props.n6_4_tdc_4_d_gitos ){ buro.digitos_tdc = props.n6_4_tdc_4_d_gitos }	
    // if(props.score_bc ){ buro.score = props.score_bc }	
    // if(props.n10_1_id_unykoo ){ buro.unykoo_id = props.n10_1_id_unykoo }	

    // //Facturacion 
    // if(props.n4_93_ciec ){ facturacion.status_ciec = true }else{facturacion.status_ciec = false}	
    // if(props.credenciales_creadas_satws ){ facturacion.status_satws = props.credenciales_creadas_satws }	
    // if(props.datacode ){ facturacion.data_code = props.datacode  }	

    // //Domicilio Negocio

	// if( props.n3_calle ){ newdomicilio.calle = props.n3_calle }
	// if( props.n3_num_ext ){ newdomicilio.numero_E = props.n3_num_ext }
	// if( props.n3_num_int ){ newdomicilio.numero_I = props.n3_num_int }
	// if( props.codigo_postal ){ newdomicilio.codigo_Postal = props.codigo_postal }
	// if( props.n3_9_colonia ){ newdomicilio.colonia = props.n3_9_colonia }
	// if( props.municipio_negocio ){ newdomicilio.municipio = props.municipio_negocio }
	// if( props.estado_de_la_rep_del_negocio ){ newdomicilio.estado = props.estado_de_la_rep_del_negocio }

    // //Domicilio Particular 
    // if(props.n4_6_calle ){ newdomiciliop.calle = props.n4_6_calle}	
    // if(props.n4_7_num_ext ){ newdomiciliop.numero_E = props.n4_7_num_ext}	
    // if(props.n4_8_num_int ){ newdomiciliop.numero_I = props.n4_8_num_int}	
    // if(props.n4_9_c_p_ ){ newdomiciliop.codigo_Postal = props.n4_9_c_p_}	
    // if(props.n4_91_colonia ){ newdomiciliop.colonia = props.n4_91_colonia}	
    // if(props.municipio_de_la_persona ){ newdomiciliop.municipio = props.municipio_de_la_persona}	
    // if(props.estado_de_la_rep_de_la_persona ){ newdomiciliop.estado = props.estado_de_la_rep_de_la_persona}	