import { DataTypes, Model, UUIDV4 } from "sequelize";
import type { InferAttributes, InferCreationAttributes, CreationOptional, Sequelize } from "sequelize";


export class Order extends Model<InferAttributes<Order>, InferCreationAttributes<Order>> {
    declare OrderID: CreationOptional<string>;
    declare ServiceCategory: CreationOptional<string>;
    declare Price: CreationOptional<number>;
    declare CustomerName: CreationOptional<string>;
    declare CustomerEmail: CreationOptional<string>;
    declare OrderedAt: CreationOptional<Date>;
    declare ServiceID: CreationOptional<string>;
    declare CustomerID: CreationOptional<string>;
}




export default function initOrderModel (
    sequelize: Sequelize
) {
    Order.init(
        {
            OrderID: {
                type: DataTypes.UUID,
                defaultValue: UUIDV4,
                primaryKey: true
            },
            ServiceCategory: {
                type: DataTypes.STRING,
                allowNull: true
            },
            Price: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            CustomerName: {
                type: DataTypes.STRING,
                allowNull: true
            },
            CustomerEmail: {
                type: DataTypes.STRING,
                allowNull: true
            },
            OrderedAt: {
                type: DataTypes.DATE,
                allowNull: true
            },
            //võõrvõtmed
            ServiceID: {
                type: DataTypes.UUID,
                allowNull: true
            },
            CustomerID: {
                type: DataTypes.UUID,
                allowNull: true
            }
        },
        {
            sequelize,
            modelName: "Order"
        }
    )
    console.log(Order === sequelize.models.Order);
    return Order;
}