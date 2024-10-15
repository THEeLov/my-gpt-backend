import express from "express"
import cors from "cors"
import { config } from "dotenv"

config()
const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}))

app.use(express.json());


app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`)
})
