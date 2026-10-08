import {Sequelize, DataTypes} from 'sequelize';

//modelite pathid
import WadModel from "../backend/models/service.ts";

//sequelizei andmebaasi ühendusanddmed
const sequelize = new Sequelize(
    process.env.DB_NAME!,
    process.env.DB_USERNAME!,
    process.env.DB_PASSWORD!
    {
        host: process.env.DB_HOSTNAME!,
        dialect: "mariadb",
        logging: console.log,
    }
);

//ühendusmeetod
const connect = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log("Connection established.");
    }
    catch (error)
    {
        console.error("db connection error", error)
    }
}
//andmebaasi instants ja seostused
const db = {
    Sequelize, 
    sequelize,
    wads: require("../backend/models/Wad.ts")(sequelize, DataTypes)
};

//sünkroonmeetod
const sync = async(): Promise<void> => {
    await sequelize.sync({alter:true})
    console.log("DB is synced")
}

//export
export {db, sync, connect}