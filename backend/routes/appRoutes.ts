import ServicesController from "../controllers/ServicesController.ts";
import ContactsController from "../controllers/ContactsController.ts";
import OrdersController from "../controllers/OrdersController.ts"
import CustomersController from "../controllers/CustomersController.ts";
import express from "express";

export default (app: express.Application): void => {
    app.route("/services")
    .get(ServicesController.getAll)
    .post(ServicesController.create)

    app.route("/services/:id")
    .get(ServicesController.getByID)
    .delete(ServicesController.deleteByID)
    .put(ServicesController.modifyByID)

    app.route("/customers")
    .get(CustomersController.getAll)
    .post(CustomersController.create)

    app.route("/customers/:id")
    .get(CustomersController.getByID)
    .delete(CustomersController.deleteByID)
    // .put(CustomersController.modifyByID)

    app.route("/contacts")
        .get(ContactsController.getAll)
        .post(ContactsController.create)
    app.route("/contacts/:id")
        .get(ContactsController.getById)
        .put(ContactsController.updateById)
        .delete(ContactsController.deleteById)
    
    app.route("/orders/")
        .post(OrdersController.create)
}
