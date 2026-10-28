import ServicesController from "../controllers/ServicesController.ts";
import ContactsController from "../controllers/ContactsController.ts";
import OrdersController from "../controllers/OrdersController.ts"
import express from "express";

export default (app: express.Application): void => {
    app.route("/services")
    .get(ServicesController.getAll)
    .post(ServicesController.create)

    app.route("/services/:id")
    .get(ServicesController.getByID)
    .delete(ServicesController.deleteByID)
    .put(ServicesController.modifyByID)

    app.route("/contacts")
        .get(ContactsController.getAll)
        .post(ContactsController.create)

    app.route("/contacts/:id")
        .get(ContactsController.getByID)
        .put(ContactsController.modifyByID)
        .delete(ContactsController.deleteByID)
    
    app.route("/orders/")
        .post(OrdersController.create)
}
