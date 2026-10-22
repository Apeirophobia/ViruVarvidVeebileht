import {Sequelize, DataTypes} from 'sequelize';

//modelite pathid
import ServiceModel from "../backend/models/service.ts";
import CustomerModel from "../backend/models/customer.ts";
import OrderModel from "../backend/models/order.ts";
import ContactsModel from "../backend/models/contacts.ts";

//sequelizei andmebaasi ühendusanddmed
const sequelize = new Sequelize(
    process.env.DB_NAME!,
    process.env.DB_USERNAME!,
    process.env.DB_PASSWORD!,
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
const _Service = ServiceModel(sequelize, DataTypes);
const _Customer = CustomerModel(sequelize, DataTypes); 
const _Contacts = ContactsModel(sequelize, DataTypes); 
const _Order = OrderModel(sequelize, DataTypes);

_Customer.hasMany(_Order, {foreignKey: "CustomerID" as "Order"});
_Order.belongsTo(_Customer, {foreignKey: "CustomerID" as "Customer"})

const db = {
    Sequelize, 
    sequelize,
    services: _Service,
    contacts: _Contacts,
    customers: _Customer,
    orders: _Order
};
//db.orders = require("../backend/models/order.ts")(sequelize, DataTypes, db.customers, db.services)
//db.services.BelongsToMany(db.customers, {through: db.orders, as: "CustomerID"})
//db.customers.BelongsTo(db.services, {through: db.orders, as: "ServiceID"})

//db.customers.hasMany(db.orders, {foreignKey: "CustomerID" as "ServiceID"})
//db.orders.BelongsTo(db.customers, {foreignKey: "CustomerID" as "ServiceID"})

//sünkroonmeetod
const sync = async(): Promise<void> => {
    await sequelize.sync({alter:true})
    console.log("DB is synced")
}

//export
export {db, sync, connect}