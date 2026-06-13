import express from "express";
import cors from "cors"
import routes from "./routes/index.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/", routes)

app.listen(PORT, () => {
  console.log(`Rodando na porta ${PORT}`)
})