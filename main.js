import "dotenv/config";
import express from "express";
import routes from "./routes/routes.js";
import { closeDB, initDBConnection } from "./persistence/db.js";
import path from "path";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(import.meta.dirname, 'public')));
app.set("view engine", "pug");

app.use("/", routes);

(async () => {
    await initDBConnection();
})();

process.on("SIGINT", async () => {
    await closeDB();
    process.exit(0);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

