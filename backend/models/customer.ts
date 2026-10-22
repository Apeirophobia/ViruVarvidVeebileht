import { DataTypes, Model} from "sequelize";
import type { InferAttributes, InferCreationAttributes, CreationOptional, Sequelize } from "sequelize";


export class Customer extends initCustomerModel<InferAttributes<Customer>, InferCreationAttributes<Customer>> {
    declare FirstName: string;
    declare LastName: string;
    declare DisplayName: string;
    declare Email: string;
    declare Password: string;

    declare CustomerID: CreationOptional<string>;
    declare OrderIDList: CreationOptional<string>;
    
}


export default function initCustomerModel (
    sequelize: Sequelize
) {
    Customer.init(
        "Customer", {
            CustomerID: {
                type: DataTypes.UUIDV4,
                primaryKey: true
            },
            FirstName: {
                type: DataTypes.STRING, 
                allowNull: false 
            },
            LastName: {
                type: DataTypes.STRING, 
                allowNull: false 
            },
            DisplayName: {
                type: DataTypes.STRING, 
                allowNull: false 
            },
            Email: {
                type: DataTypes.STRING, 
                allowNull: false 
            },
            Password: {
                type: DataTypes.STRING, 
                allowNull: false 
            },
            OrderIDList: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                allowNull: true
            }
        },
        {
            sequelize,
            modelName: "Customer"
        }
    )

    console.log(Customer === sequelize.models.Customer);
    return Customer;
}