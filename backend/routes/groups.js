const { getAllGroups, getGroupByName } = require("../database/groups_db");
const router = require("express").Router();

router.get("/", async (req, res) => {
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

router.get("/groupname", async (req, res) => {
    const groups = await getGroupByName(req.query.groupname);
    console.log(groups);
    res.json(groups);
});

module.exports = router;
