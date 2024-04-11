const { getAccount } = require("../database/account_db");

const router = require("express").Router();

router.get("/", async (req, res) => {
  const account = await getAccount(req.query.username);
  console.log(account);
  res.json(account);
});

module.exports = router;

