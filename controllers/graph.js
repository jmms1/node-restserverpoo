
const { tokenResponse, apiCall, apiCallGroup } = require("../helpers/msgraph");


const altaBrokerSP =  async (req = request, res= response) => {

    const {  correo } = req.params;

    try {
        const accessToken = await tokenResponse();
		const invitedUser = await apiCall(accessToken, correo);
        const invitedUserGroup = await apiCallGroup(accessToken, invitedUser);

        res.json({
            invitedUserGroup, 
            invitedUser});

    } catch (msg) {

        res.status(400).json({msg})
    }

}

const test =  async (req = request, res= response) => {


    try {

        const accessToken = await tokenResponse();

        res.json({
            accessToken, 
            'status': 'ok'});

    } catch (msg) {

        res.status(400).json({msg})
    }

}




module.exports = {
    altaBrokerSP,
    test
}