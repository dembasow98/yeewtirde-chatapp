const {connect } = require('getstream');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const StreamChat = require('stream-chat').StreamChat;
require('dotenv').config();

const STREAM_API_KEY = process.env.STREAM_API_KEY;
const STREAM_API_SECRET = process.env.STREAM_API_SECRET;
const STREAM_APP_ID = process.env.STREAM_APP_ID;



const login =  async(req, res) => {
    try {
        const {username, password} = req.body;

        const serverClient = connect(STREAM_API_KEY, STREAM_API_SECRET, STREAM_APP_ID);

        const client = StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET);


        const {users} = await client.queryUsers({name: username});

        if(!users.length) return res.status(400).json({message: 'User not found!'});

        const success = await bcrypt.compare(password, users[0].hashedPassword);

        const token = serverClient.createUserToken(users[0].id);


        if(success) {
            res.status(200).json({token, fullName: users[0].fullName, username, userId: users[0].id});
        } else {
            return res.status(400).json({message: 'Incorrect password!'});
        }
    } catch (error) {
        res.status(500).json({message: error});
        console.log(error);
    }
}

const register = async(req, res) => {
    
    try {
        const {fullName, username, password, phoneNumber} = req.body;

        const userId =  crypto.randomBytes(16).toString('hex');

        const serverClient = connect(STREAM_API_KEY, STREAM_API_SECRET, STREAM_APP_ID);

        const hashedPassword = await bcrypt.hashSync(password, 10);

        const token = serverClient.createUserToken(userId);

        res.status(200).json({token, fullName, username, userId, hashedPassword, phoneNumber});

    } catch (error) {
        res.status(500).json({message: error.message});
        console.log(error);
    }


}



module.exports = {
    login,
    register
}