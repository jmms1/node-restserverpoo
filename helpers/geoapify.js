const { Persona } = require("../models");

const axios = require("axios").default;



const ipLocation = async ( ip , _id) => {

    try {
        const info = await axios.get(`${process.env.GEOAPYFY_URL}?ip=${ip}&apiKey=${process.env.GEOAPYFY_API_KEY}`);

        const {city, continent, country, state, location  } = info.data;

        const ipLocation = {
            continent : continent.name, 
            country : country.name, 
            state : state.name, 
            city : city.name, 
            location : location, 
        }
        const personaLocation = await Persona.findByIdAndUpdate(_id, {"solicitud.ip_location": ipLocation} , { new:true ,upsert:true })

        return personaLocation;
        
    } catch (error) {
        
        console.log(error);

        return error
        
    }



}


module.exports={
    ipLocation
}