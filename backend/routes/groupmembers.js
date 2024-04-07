const {getGroupMember, getGroupId, gedDeleteId, deleteMemberFromGroup, deleteGroup} = require('../database/groupmembers_db')
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
        
        const promises = [];
        id.forEach((group) => {
            promises.push(
                getGroupMember(group.idgroup).then((uname) => {
                    return { uname, id: group.idgroup, name: group.groupname, description: group.description };
                })
            );
        });
    
        // Wait for all promises to resolve using Promise.all()
        const results = await Promise.all(promises);
    
        // Extract data from results
        const membersList = results.map(result => result.uname);
        const membersIdList = results.map(result => result.id);
        const groupNameList = results.map(result => result.name);
        const descriptionList = results.map(result => result.description);
        // console.log(membersList, membersIdList, groupNameList, descriptionList)
        // console.log({members:membersList, name:groupNameList, kuvaus: descriptionList, ID: membersIdList}) // tarkastus

        res.json({members:membersList, name:groupNameList, kuvaus: descriptionList, ID: membersIdList}) // lähetetään sellaisten ryhmäjäsenten tietoja
    } catch(error) {                                                                                    // jotka ovat samassa ryhmässä kuin admin
        console.error(error);
        res.status(500).send('Sever error');
    }
})

router.post("/deleteuser", async (req, res) =>{
    let id;
    
    try{
        const del = req.body.username
        const delId = await gedDeleteId(del) // muutat usernamen sen id:ksi
        const admin = req.body.admin
        const groupID = req.body.ID         // frontin puolelta saadaan takaisin usernamen ryhmäID
        id = await getGroupId(admin)        // uusien ryhmien palautukseen tähän id:hen tulee listana kaikki adminin ryhmät
        await deleteMemberFromGroup(groupID, delId.idaccount)
        // onnistuneen poiston jälkeen haetaan uudet jäsenet


// ------ tässä vain toistetaan aiemman endpointin koodi, jossa palautetaan päivitetyt ryhmät jäsenen poistamisen jälkeen ---- //
        const promises = [];
        id.forEach((group) => {
            promises.push(
                getGroupMember(group.idgroup).then((uname) => {
                    return { uname, id: group.idgroup, name: group.groupname, description: group.description };
                })
            );
        });

            // Wait for all promises to resolve using Promise.all()
            const results = await Promise.all(promises);

            // Extract data from results
            const membersList = results.map(result => result.uname);
            const membersIdList = results.map(result => result.id);
            const groupNameList = results.map(result => result.name);
            const descriptionList = results.map(result => result.description);
            // console.log(membersList, membersIdList, groupNameList, descriptionList)
            // console.log({members:membersList, name:groupNameList, kuvaus: descriptionList, ID: membersIdList}) // tarkastus

            res.json({members:membersList, name:groupNameList, kuvaus: descriptionList, ID: membersIdList}) // lähetetään sellaisten ryhmäjäsenten tietoja
        } catch(error) {                                                                                    // jotka ovat samassa ryhmässä kuin admin
            console.error(error);
            res.status(500).send('Sever error');
        }
})

router.post("/deletegroup", async (req, res) =>{
    let id;
    
    try{
        const owner = req.body.owner
        const groupID = req.body.ID
        await deleteGroup(groupID, owner)
        console.log("TÄÄLLÄ", groupID, owner)
        id = await getGroupId(owner)

// ------ tässä vain toistetaan aiemman endpointin koodi, jossa palautetaan päivitetyt ryhmät jäsenen poistamisen jälkeen ---- //
        const promises = [];
        id.forEach((group) => {
            promises.push(
                getGroupMember(group.idgroup).then((uname) => {
                    return { uname, id: group.idgroup, name: group.groupname, description: group.description };
                })
            );
        });

            // Wait for all promises to resolve using Promise.all()
            const results = await Promise.all(promises);

            // Extract data from results
            const membersList = results.map(result => result.uname);
            const membersIdList = results.map(result => result.id);
            const groupNameList = results.map(result => result.name);
            const descriptionList = results.map(result => result.description);
            // console.log(membersList, membersIdList, groupNameList, descriptionList)
            // console.log({members:membersList, name:groupNameList, kuvaus: descriptionList, ID: membersIdList}) // tarkastus

            res.json({members:membersList, name:groupNameList, kuvaus: descriptionList, ID: membersIdList}) // lähetetään sellaisten ryhmäjäsenten tietoja
        } catch(error) {                                                                                    // jotka ovat samassa ryhmässä kuin admin
            console.error(error);
            res.status(500).send('Sever error');
        }
})

module.exports = router;