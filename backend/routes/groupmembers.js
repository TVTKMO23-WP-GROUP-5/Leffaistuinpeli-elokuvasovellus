const {
  getGroupMember,
  getGroupId,
  getAccountId,
  deleteMemberFromGroup,
  deleteGroup,
  getGroupApplication,
  updateGroupMembership,
  deleteAllMembers,
  groupApplication,
  checkUserOwner,
  getUserGroupStatus,
  getGroupIdByGroupname,
} = require("../database/groupmembers_db");
const router = require("express").Router();

router.post("/", async (req, res) => {
  let id;

  try {
    const admin = req.body.username;
    id = await getGroupId(admin); // saadaan adminin nimimerkin mukainen ryhmäid.
  } catch (error) {
    console.error(error);
    res.status(500).send("Sever error");
  }

  handleGroups(id, req, res);
});

router.post("/deleteuser", async (req, res) => {
  let id;

  try {
    const del = req.body.username;
    const delId = await getAccountId(del); // muutat usernamen sen id:ksi
    const admin = req.body.admin;
    const groupID = req.body.ID; // frontin puolelta saadaan takaisin usernamen ryhmäID
    id = await getGroupId(admin); // uusien ryhmien palautukseen tähän id:hen tulee listana kaikki adminin ryhmät
    await deleteMemberFromGroup(groupID, delId.idaccount);
    // onnistuneen poiston jälkeen haetaan uudet jäsenet
  } catch (error) {
    console.error(error);
    res.status(500).send("Sever error");
  }

  // ------ tässä vain toistetaan aiemman endpointin koodi, jossa palautetaan päivitetyt ryhmät jäsenen poistamisen jälkeen ---- //
  handleGroups(id, req, res);
});

router.post("/deletegroup", async (req, res) => {
  let id;

  try {
    const owner = req.body.owner;
    const groupID = req.body.ID;
    await deleteAllMembers(groupID);
    await deleteGroup(groupID, owner);
    id = await getGroupId(owner);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
  // ------ tässä vain toistetaan aiemman endpointin koodi, jossa palautetaan päivitetyt ryhmät jäsenen poistamisen jälkeen ---- //
  handleGroups(id, req, res);
});

router.post("/handleapplication", async (req, res) => {
  let id;
  try {
    const username = req.body.user;
    const groupID = req.body.ID;
    const admin = req.body.admin;
    id_account = await getAccountId(username);
    id = await getGroupId(admin);
    await updateGroupMembership(groupID, id_account.idaccount);
  } catch (error) {
    console.error(error);
    res.status(500).send("Sever error");
  }
  handleGroups(id, req, res);
});

router.post("/insertapplication", async (req, res) => {
  try {
    const uname = req.body.username;
    const admin = req.body.groupOwner;
    const groupName = req.body.groupName;
    const userId = await getAccountId(uname);
    const groupId = await getGroupId(admin);
    let grId;
    for (let i = 0; i < groupId.length; i++) {
      if (groupId[i].groupname === groupName) {
        grId = groupId[i].idgroup;
      }
    }
    await groupApplication(grId, userId.idaccount);
    res.send("Meni perille");
  } catch (error) {
    console.error(error);
    res.status(500).send("Mahdollisesti olet jo ryhmän jäsen?");
  }
});

router.post("/checkowner", async (req, res) => {
  try {
    const admin = req.body.username;
    const isOwner = await checkUserOwner(admin);
    res.send(isOwner);
  } catch (error) {
    console.error(error);
    res.status(500).send("Ongelmia löytää ryhmäomistajuus");
  }
});

router.post("/groupstatus", async (req, res) => {
  try {
    const user = req.body.username;
    const id = await getAccountId(user);
    const groupStatus = await getUserGroupStatus(id.idaccount);
    res.json(groupStatus);
  } catch (error) {
    // jotka ovat samassa ryhmässä kuin admin
    console.error(error);
    res.status(500).send("Sever error");
  }
});

router.get("/isgroupmember", async (req, res) => {
  try {
    const user = req.query.username;
    const groupname = req.query.groupname;
    const id = await getAccountId(user);
    const groupStatus = await getUserGroupStatus(id.idaccount);

    const filteredStatus = groupStatus.filter(
      (status) => status.groupname === groupname
    );
    if (filteredStatus.length > 0) {
      res.json(filteredStatus[0].ismember);
    } else {
      res.status(404).json({ error: "Group not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Sever error");
  }
});

router.get("/membersingroup", async (req, res) => {
  try {
    const groupname = req.query.groupname;
    const id = await getGroupIdByGroupname(groupname);
    const groupmembers = await getGroupMember(id);
    res.json(groupmembers);
  } catch (error) {
    console.error(error);
    res.status(500).send("Sever error");
  }
});

// funktio, jolla haetaan aina päivitetty ryhmätilanne adminille
async function handleGroups(group_id, req, res) {
  try {
    if (!group_id) {
      return res.status(404).send("ID not found");
    }

    // haetaan ryhmänjäsenet, jotka on hyväksytty
    const promises = [];
    group_id.forEach((group) => {
      promises.push(
        getGroupMember(group.idgroup).then((uname) => {
          return {
            uname,
            id: group.idgroup,
            name: group.groupname,
            description: group.description,
          };
        })
      );
    });
    const results = await Promise.all(promises);
    const membersList = results.map((result) => result.uname);
    const membersIdList = results.map((result) => result.id);
    const groupNameList = results.map((result) => result.name);
    const descriptionList = results.map((result) => result.description);

    // haetaan ryhmäjäsenet, jotka odottavat hyväksyntää
    const applies = [];
    group_id.forEach((group) => {
      applies.push(
        getGroupApplication(group.idgroup).then((uname) => {
          return {
            uname,
            id: group.idgroup,
            name: group.groupname,
            description: group.description,
          };
        })
      );
    });
    const resultsApplication = await Promise.all(applies);
    const membersListApplication = resultsApplication.map(
      (result) => result.uname
    );
    const membersIdListApplication = resultsApplication.map(
      (result) => result.id
    );
    const groupNameListApplication = resultsApplication.map(
      (result) => result.name
    );

    res.status(200).json({
      members: membersList,
      name: groupNameList,
      kuvaus: descriptionList,
      ID: membersIdList,
      application: membersListApplication,
      applicationID: membersIdListApplication,
      applicationGroupName: groupNameListApplication,
    }); // lähetetään sellaisten ryhmäjäsenten tietoja
  } catch (error) {
    // jotka ovat samassa ryhmässä kuin admin
    console.error(error);
    res.status(500).send("Sever error");
  }
}

module.exports = router;
