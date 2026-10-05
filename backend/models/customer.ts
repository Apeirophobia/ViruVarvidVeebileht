import { Sequelize, DataTypes } from "sequelize";

export default function CustomerModel (
    sequelize: Sequelize,
    dataTypes: typeof DataTypes
) {
    const Customer = sequelize.define(
        "Customer", {
            CustomerId: {
                type: dataTypes.UUIDV4
            },
            FirstName: {
                type: dataTypes.STRING, 
                allowNull: false 
            },
            LastName: {
                type: dataTypes.STRING, 
                allowNull: false 
            },
            DisplayName: {
                type: dataTypes.STRING, 
                allowNull: false 
            },
            Password: {
                type: dataTypes.STRING, 
                allowNull: false 
            },
            OrderListId: {
                type: dataTypes.ARRAY(dataTypes.STRING),
                allowNull: true
            }
        }
    )
}