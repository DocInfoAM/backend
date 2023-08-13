import path from "path";
import { DataSource } from "typeorm";

const entityPath = path.join(__dirname, "..", "api", "**", "*.entity{.ts,.js}");

export const dataSource = new DataSource({
    type: "sqlite",
    database: "db.sqlite",
    entities: [entityPath],
    synchronize: true,
});
