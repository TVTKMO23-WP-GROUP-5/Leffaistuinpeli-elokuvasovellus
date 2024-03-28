require("dotenv").config();
const cors = require('cors')
const account = require("./routes/account");
const auth = require("./routes/authentication"); // Muutin nimeksi auth, koska siellä login ja register. Jaakko
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({extended: true})) // vastaanottaa form-url-encoded. Jaakko
app.use(express.json()) // Ottaa vastaaan jsonia. Jaakko
app.use((cors())) // poistaa header-ongelmia. Jaakko
app.use("/account", account);
app.use("/auth", auth); // Hieman muuttelin osoitteita. keskustellaan näistä. Jaakko


app.listen(PORT, () => {
  console.log("Server running:" + PORT);
});

app.get("/", (req, res) => {
  res.send("moro");
});
