import ServicesController from "../controllers/ServicesController.ts";
import ContactsController from "../controllers/ContactsController.ts";
import { Express } from "express";

export default (app: Express): void => {
    app.route("/services")
    .get(ServicesController.getAll)
    .post(ServicesController.create)

    app.route("/services/:id")
    .get(ServicesController.getById)
    .delete(ServicesController.deleteById)
    .put(ServicesController.modifyById)

    app.route("/contacts")
        .get(ContactsController.getAll)
        .post(ContactsController.create)
    app.route("/contacts/:id")
        .get(ContactsController.getById)
        .put(ContactsController.updateById)
}
