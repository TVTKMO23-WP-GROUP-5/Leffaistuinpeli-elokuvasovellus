const { getAccount } = require("../database/account_db");

const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    const account = await getAccount(req.query.username);
    if (!account) {
      res.status(404).json({ error: "Account not found" });
    } else {
      res.status(200).json(account);
    }
  } catch (error) {
    console.error("Error fetching account:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

