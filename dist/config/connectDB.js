//import { createConnection } from "typeorm";
import { DataSource } from "typeorm";
import UserTable from "../entities/User.js";
const datasource = new DataSource({
    type: "sqlite",
    database: "./src/database/authDatabase.sqlite",
    synchronize: true,
    entities: [UserTable],
    logging: true
});
export default datasource;
