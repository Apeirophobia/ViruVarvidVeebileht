import ServicesController from "../controllers/ServicesController";
import { Express } from "express";

export default (app: Express): void => {
    app.route("/services")
    .get(ServicesController.getAll)
    .post(ServicesController.create)

    app.route("/services/:id")
    .get(ServicesController.getById)
    .delete(ServicesController.deleteById)
    .put(ServicesController.modifyById)
}