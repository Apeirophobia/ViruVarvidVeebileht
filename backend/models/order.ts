import { DataTypes, Model } from "sequelize";
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
                type: DataTypes.UUIDV4,
                primaryKey: true
            },
            ServiceCategory: {
                type: DataTypes.STRING,
                allowNull: false
            },
            Price: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            CustomerName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            CustomerEmail: {
                type: DataTypes.STRING,
                allowNull: false
            },
            OrderedAt: {
                type: DataTypes.DATE,
                allowNull: false
            },
            //võõrvõtmed
            ServiceID: {
                type: DataTypes.UUID,
                allowNull: false
            },
            CustomerID: {
                type: DataTypes.UUID,
                allowNull: false
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