
const { getAllGroups, getGroupByName, getGroupsByIdAccount, deleteGroup, getGroupsByUsername, getOwnersName, createGroup, getOwnGroups, getGroupId } = require("../database/groups_db");


const router = require("express").Router();


router.get("/allgroups", async (req, res) => {
    try {
        const groups = await getAllGroups();

        const filteredGroups = groups.map(group => ({
            name: group.groupname,
            description: group.description,
            owner: group.owner
        }));
        res.status(200).json(filteredGroups);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

router.get("/owngroups", async (req, res) => {
    try {
        const username = req.query.username;
        if (!username) {
            return res.status(400).json({ msg: "Username is required" })
        }

        const owngroups = await getOwnGroups(username);

        const filteredGroup = owngroups.map(group => ({
            name: group.groupname,
            description: group.description,
            owner: group.owner
        }))
        res.status(200).json(filteredGroup);
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

    res.json(filteredGroup);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

router.get("/owner", async (req, res) => {
    try {
        const owner = await getOwnersName(req.query.groupname);
        res.json(owner.owner);
    } catch (error) {
        console.error(error);
        res.status(500).send('Sever error');
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


  router.post('/register', async (req, res) => {
    
      const { groupname, description, owner } = req.body;
      if (!owner){
        return res.status(400).json({ message: 'Käyttäjä nimeä ei löydy' });
      }
      try{

      await createGroup(groupname, description, owner);
  
      if (!groupname || !description) {
        return res.status(400).json({ success: false, message: 'Ryhmän nimi ja kuvaus vaaditaan' });
      }
  
    
      const responseMessage = 'Ryhmä luotu onnistuneesti';
      res.status(201).json({ success: true, message:'success'  });
    } catch (error) {
      console.error('Error creating group:', error);
      res.status(500).json({ success: false, message: 'Ryhmän luonti epäonnistui' });
    }
  });

module.exports = router;
