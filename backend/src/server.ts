import express from "express" ;
import cors from "cors" ;
import { config } from "./config/env.config.js";
import userRoutes from "./routes/user.routes.js"
import keyRoutes from "./routes/key.routes.js"
import { protectRoute } from "./middlewares/auth.middleware.js";

const app=express();

app.use(cors());
app.use(express.json());

app.use("/user", protectRoute,userRoutes);
app.use("/key", protectRoute, keyRoutes);

app.listen(config.port, () => console.log(
    `Server running on port ${config.port}`
));