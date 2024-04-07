const {getGroupMember, getGroupId, gedDeleteId, deleteMemberFromGroup} = require('../database/groupmembers_db')
const router = require("express").Router();

router.post("/", async (req, res) =>{
    let id;
    
    try {
        const admin = req.body.username
        console.log(admin)
        id = await getGroupId(admin)    // saadaan adminin nimimerkin mukainen ryhmäid. 
    } catch (error) {
        console.error(error);
        res.status(500).send('Sever error');
    }

    try{
        if (!id) {
            return res.status(404).send('ID not found')
        }
        const members = await getGroupMember(id.idgroup) // otetaan sellaiset ryhmänjäsenet, joilla on sama ryhmäid kuin adminilla. 
        const groupName = id.groupname
        const description = id.description
        res.json({members:members, name:groupName, kuvaus: description}) // lähetetään sellaisten ryhmäjäsenten tietoja
    } catch(error) {                                                    // jotka ovat samassa ryhmässä kuin admin
        console.error(error);
        res.status(500).send('Sever error');
    }
})

router.post("/delete", async (req, res) =>{
    try{
        const del = req.body.username
        const delId = await gedDeleteId(del) // muutat usernamen sen id:ksi
        const admin = req.body.admin
        id = await getGroupId(admin) // otetaan adminin id
        console.log(id.idgroup, delId.idaccount)
        await deleteMemberFromGroup(id.idgroup, delId.idaccount)
        // onnistuneen poiston jälkeen haetaan uudet jäsenet
        const updatedGroupMembers = await getGroupMember(id.idgroup)
        const groupName = id.groupname
        const description = id.description   
        // Lähetetään päivitetty lista fronttiin
        res.json({members:updatedGroupMembers, name:groupName, kuvaus: description})
    } catch (error) {
        console.error("Error deleting member:", error);
        res.status(500).json({ success: false, message: "Error deleting member" });
    }
})

module.exports = router;