var axios = require('axios');

const getBC = async (id) => { 

    let config = {
      method: 'get',
      url: `https://www.unykoo.com/workfloo/api/v1/workfloo/${id}` ,
      headers: { 
        'Content-Type': 'application/json', 
        'company_code': 'P2VXMnh', 
        'api_key': 'cb7fb2b5-cc69-43cd-aa11-668975a63e68'
      }
    };

    try {

        const {data} = await axios(config);
        
        return data;
        
    } catch (error) {
        
        console.log(error);
        return error;
    }
 
}

const buroConstructor = (data) => {

  let newburo = {};
  const prospector = data[3];
  
  if(prospector.consultaSIC.status !== "SUCCESS"){
    return newburo
  }else{
    newburo.status = prospector.consultaSIC.status;      
    data.forEach( e => {
        
        if(e.type === 'CONSULTA_SIC'){
            if(e.consultaSIC.profileName === 'Prospector'){
                newburo.scoreBuroCredito = e.consultaSIC.respuestaBC;
            }
            if(e.consultaSIC.profileName === 'Buró Fisica sin Score (DP)'){
                newburo.respuestaBCPF = e.consultaSIC.respuestaBC;
            }
            if(e.consultaSIC.profileName === 'P.Moral'){
                newburo.respuestaBCPM = e.consultaSIC.respuestaPM;
            }
        }
    });

  return newburo

}}


module.exports={
    getBC,
    buroConstructor
}
