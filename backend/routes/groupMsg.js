const {
    sendMessage,
    getAllMessages
} = require('../database/groupMsg_db')

const router = require("express").Router();


router.post("/sendmsg", async (req, res) =>{

    const { username, groupname, msg } = req.body;
    console.log(username, groupname, msg);
    
    try {
        const message = await sendMessage(username, groupname, msg);
        console.log(message)
        res.send('Message received!')
    } catch (error) {
        console.error(error);
        res.status(500).send('Sever error');
    }
})

router.get("/getmsg", async (req, res) => {
    const gname = req.query.groupname;
    
    try {
        const msgs = await getAllMessages(gname);
        console.log("GroupMsg.js r29 :", msgs)
        res.send(msgs)
    } catch (error) {
        console.error(error);
        res.status(500).send('Sever error');
    }
})

module.exports = router;