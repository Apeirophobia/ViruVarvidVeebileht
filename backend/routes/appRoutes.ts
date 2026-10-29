import ServicesController from "../controllers/ServicesController.ts";
import ContactsController from "../controllers/ContactsController.ts";
import OrdersController from "../controllers/OrdersController.ts"
import CustomersController from "../controllers/CustomersController.ts";
import checkRequestBody from "../controllers/middlewares/checkRequestBody.ts";
import express from "express";

export default (app: express.Application): void => {
    app.route("/services")
    .get(ServicesController.getAll)
    .post(checkRequestBody, ServicesController.create)

    app.route("/services/:id")
    .get(ServicesController.getByID)
    .delete(ServicesController.deleteByID)
    .put(checkRequestBody, ServicesController.modifyByID)

    app.route("/customers")
    .get(CustomersController.getAll)
    .post(checkRequestBody, CustomersController.create)

    app.route("/customers/:id")
    .get(CustomersController.getByID)
    .delete(CustomersController.deleteByID)
    // .put(CustomersController.modifyByID)

    app.route("/contacts")
        .get(ContactsController.getAll)
        .post(checkRequestBody, ContactsController.create)

    app.route("/contacts/:id")
        .get(ContactsController.getByID)
        .put(checkRequestBody, ContactsController.modifyByID)
        .delete(ContactsController.deleteByID)
    
    /*app.route("/orders/")
        .post(checkRequestBody, OrdersController.create)
    */
}
