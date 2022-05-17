const  axios  = require("axios");
const { tokenResponse } = require("../helpers/msgraph");
const fs = require('fs');
const Handlebars = require("handlebars");




style = fs.readFileSync('./uploads/Impulso/style.handlebars', 'utf8');
Handlebars.registerPartial('style', style);
Handlebars.registerHelper('formatCurrency', function(value) {
    return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
});


const mailPrueba = async (req = request, res= response) => {
    
    
    correoPropuesta = fs.readFileSync('./uploads/Impulso/propuesta.handlebars', 'utf8');
    
    let template = Handlebars.compile(correoPropuesta);
   

    let info = { "propuesta": {"name": "The Lord Of Magic SAS", "amountauth": 120000, "interestrate":'36', "cxd": '1.5', 'tablemail':[] }};

    let {propuesta} = info ;
    let table = [0.4, 0.6, 0.8, 1];
    table.map(  e => {
        
        propuesta.tablemail.push({
            'amount2': e * propuesta.amountauth,
            'porcent': e * 100
        })

    });

    let result = template(info);
 
    const endpoint = `${process.env.GRAPH_ENDPOINT + 'v1.0/users/c5258234-0ec2-4a38-b7f1-f751b44a1b45/sendMail'}`;
    
    const data = {
        message: {
            subject: 'ImpulsoMx: Tu solicitud de crédito se encuentra aprobada',
            body: {
                contentType: 'Html',
                content: result
            },
            toRecipients: [
                {
                    emailAddress: {
                        address: 'juanmejia@distritopyme.com'
                    }
                }
            ],
            // ccRecipients: [
            //     {
            //         emailAddress: {
            //             address: 'juanmejia@distritopyme.com'
            //         }
            //     }
            // ]
        },
        saveToSentItems: 'true'
    };
    
    
    try {
        const accessToken = await tokenResponse();

        const options = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type':	'application/json'
            }
        };
        
        const mailSend = await axios.default.post(endpoint,data,options);

        res.status(200).json('ok', mailSend);
        
        
    } catch (error) {

        res.json(error);
    }

}
const mailBienvenida = async (req = request, res= response) => {

    const correoBienvenida = fs.readFileSync('./uploads/Impulso/bienvenidarevolvente.handlebars', 'utf8');
    
    let template = Handlebars.compile(correoBienvenida);
   

    let info ={ 'propuesta': {"name": "Lemon Drops Company S.A. de C.V.", "amount": 300000, "interestrate":'28', "cxd": '1',  }};


    let result = template(info);

 
    const endpoint = `${process.env.GRAPH_ENDPOINT + 'v1.0/users/c5258234-0ec2-4a38-b7f1-f751b44a1b45/sendMail'}`;
    
    const data = {
        message: {
            subject: 'Bienvenido a ImpulsoMx',
            body: {
                contentType: 'Html',
                content: result
            },
            toRecipients: [
                {
                    emailAddress: {
                        address: 'alejandro@lemondropscompany.mx'
                    }
                },
                {
                    emailAddress: {
                        address: 'mmc@vxtnegocios.mx'
                    }
                },
            ],
            ccRecipients: [
                {
                    emailAddress: {
                        address: 'contacto@impmx.com'
                    }
                },
                {
                    emailAddress: {
                        address: 'karlahernandez@distritopyme.com'
                    }
                },
                {
                    emailAddress: {
                        address: 'juanmejia@impmx.com'
                    }
                }
            ]
        },
        saveToSentItems: 'true'
    };
    
    
    try {
        const accessToken = await tokenResponse();

        const options = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type':	'application/json'
            }
        };
        
        const mailSend = await axios.default.post(endpoint,data,options);
        console.log(mailSend);

        res.status(200).json(mailSend.statusText);
        
        
    } catch (error) {

        res.json(error);
        console.log(error);
    }

}






module.exports={
    mailPrueba,
    mailBienvenida    
}

