const msal = require('@azure/msal-node');
const axios = require('axios');

//TOKEN 
const msalConfig = {
	auth: {
		clientId: process.env.CLIENT_ID,
		authority: process.env.AAD_ENDPOINT + process.env.TENANT_ID,
		clientSecret: process.env.CLIENT_SECRET,
	}
};

const cca = new msal.ConfidentialClientApplication(msalConfig);


const tokenRequest = {
	scopes: [process.env.GRAPH_ENDPOINT + '.default'],
};

   
const tokenResponse = async () => {

    try {

        const {accessToken} = await cca.acquireTokenByClientCredential(tokenRequest);
        return accessToken;
        
    } catch (error) {
        
        return error;
    }
     

}

//API CAll 

const apiCall = async (accessToken, correo) =>  {

	const options = {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type':	'application/json'
		}
	};
    const data = {
        "invitedUserEmailAddress": `${correo}`,
        "sendInvitationMessage": true,
        "invitedUserMessageInfo": {
            "messageLanguage": "es-MX",
            "ccRecipients": [
                {
                    "emailAddress": {
                        "name": null,
                        "address": "juanmejia@distritopyme.com"
                    }
                }
            ],
            "customizedMessageBody": "Bienvenido a Distrito Pyme, si el enlace de este correo no te dirije al sitio BrokerDP, por favor ingresa a: https://distritopymecom.sharepoint.com/sites/BrokersDP"
        },
        "inviteRedirectUrl": "https://distritopymecom.sharepoint.com/sites/BrokersDP"
    }

    const endpoint = `${process.env.GRAPH_ENDPOINT + 'v1.0/invitations'}`

	console.log('request made to web API at: ' + new Date().toString());

	try {
		const response = await axios.default.post(endpoint, data, options);

        const {invitedUser, invitedUserType, status} = response.data

		return {
            invitedUser,
            invitedUserType,
            status
        };

	} catch (error) {

		console.log(error)
		return error;
	}
};

const apiCallGroup = async (accessToken, {invitedUser}) =>  {

    const id = invitedUser.id

	const optionsGroup = {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type':	'application/json'
		}
	};

    const dataGroup = {
        "@odata.id": `https://graph.microsoft.com/v1.0/users/${id}`
    }

    const endpointGroup = `${process.env.GRAPH_ENDPOINT + 'v1.0/groups/38954c15-86c6-40dc-bfd8-c2d7b47050c7/members/$ref'}`

	console.log('request made to web API Group at: ' + new Date().toString());

	try {

		const response = await axios.default.post(endpointGroup, dataGroup, optionsGroup);

        return response;



	} catch (error) {

		console.log(error)
		return error;
	}
};

module.exports = {
    tokenResponse,
    apiCall,
    apiCallGroup
}

