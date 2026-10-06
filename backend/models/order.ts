import { Sequelize, DataTypes } from "sequelize";

export default function OrderModel (
    sequelize: Sequelize,
    dataTypes: typeof DataTypes
) {
    const Order = sequelize.define(
        "Order", {
            OrderID: {
                type: dataTypes.UUIDV4
            },
            ServiceID: {
                type: dataTypes.UUIDV4
            },
            CustomerID: {
                type: dataTypes.UUIDV4
            }
        }
    )
}