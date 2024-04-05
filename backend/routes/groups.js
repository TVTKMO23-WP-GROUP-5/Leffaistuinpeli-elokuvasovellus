const { getAllGroups, getGroupByName, getGroupsByIdAccount } = require("../database/groups_db");
const router = require("express").Router();

router.get("/allgroups", async (req, res) => {
    try {
        const groups = await getAllGroups(req.query.groupname);

        const filteredGroups = groups.map(group => ({
            name: group.groupname,
            description: group.description,
            owner: group.ownerd
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
    const owngroups = await getGroupsByIdAccount(req.query.idaccount);

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

module.exports = router;
