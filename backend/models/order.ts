import { Sequelize, DataTypes } from "sequelize";

export default function OrderModel (
    sequelize: Sequelize,
    dataTypes: typeof DataTypes
) {
    const Order = sequelize.define(
        "Order", {
            OrderID: {
                type: dataTypes.UUIDV4,
                primaryKey: true
            },
            ServiceCategory: {
                type: dataTypes.STRING,
                allowNull: false
            },
            Price: {
                type: dataTypes.INTEGER,
                allowNull: false
            },
            CustomerName: {
                type: dataTypes.STRING,
                allowNull: false
            },
            CustomerEmail: {
                type: dataTypes.STRING,
                allowNull: false
            },
            OrderedAt: {
                type: dataTypes.DATE,
                allowNull: false
            },
            //võõrvõtmed
            ServiceID: {
                type: dataTypes.UUID,
                allowNull: false
            },
            CustomerID: {
                type: dataTypes.UUID,
                allowNull: false
            }
        }
    )
    console.log(Order === sequelize.models.Order);
    return Order;
}