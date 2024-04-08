const { getAllGroups, getGroupByName, getGroupsByIdAccount, deleteGroup, getGroupsByUsername } = require("../database/groups_db");
const router = require("express").Router();

router.get("/allgroups", async (req, res) => {
    try {
        const groups = await getAllGroups(req.query.groupname);

        const filteredGroups = groups.map(group => ({
            name: group.groupname,
            description: group.description,
            owner: group.owner
        }));
        console.log(filteredGroups);
        res.json(filteredGroups);
    } catch (error) {
        console.error(error);
        res.status(500).send('Sever error');
    }
});

router.get("/owngroups", async (req, res) => {
    try {
    const owngroups = await getGroupsByUsername(req.query.username);

    const filteredGroup = owngroups.map(group => ({
        name: group.groupname,
        description: group.description
    }))
    console.log(filteredGroup);
    res.json(filteredGroup);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

router.get("/groupname", async (req, res) => {
    try {
    const group = await getGroupByName(req.query.groupname);

    if (!group) {
        return res.status(404).send('Group not found');
    }

    const filteredGroup = {
        name: group.groupname,
        description: group.description
    };

    console.log(filteredGroup);
    res.json(filteredGroup);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

router.post("/delete", async (req, res) =>{
    try{
        let groupname = req.body.groupname
        let group_id = await getGroupId(groupname) //Tämä vielä selvityksessä -Taneli
        await deleteGroup(group_id)
    } catch (error) {
        console.error("Error deleting group:", error);
        res.status(500).json({ success: false, message: "Error deleting group" });
    }
});


module.exports = router;
