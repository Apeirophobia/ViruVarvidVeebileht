import { DataTypes, Model, UUIDV4} from "sequelize";
import type { InferAttributes, InferCreationAttributes, CreationOptional, Sequelize } from "sequelize";


export class Customer extends Model<InferAttributes<Customer>, InferCreationAttributes<Customer>> {
    declare FirstName: string;
    declare LastName: string;
    declare DisplayName: string;
    declare Email: string;
    declare Password: string;

    declare CustomerID: CreationOptional<string>;
    declare OrderIDList: CreationOptional<JSON | null>;
    
}


export default function initCustomerModel (
    sequelize: Sequelize
) {
    Customer.init(
        {
            CustomerID: {
                type: DataTypes.UUID,
                defaultValue: UUIDV4,
                primaryKey: true
            },
            FirstName: {
                type: DataTypes.STRING, 
                allowNull: true 
            },
            LastName: {
                type: DataTypes.STRING, 
                allowNull: true 
            },
            DisplayName: {
                type: DataTypes.STRING, 
                allowNull: true 
            },
            Email: {
                type: DataTypes.STRING, 
                allowNull: true 
            },
            Password: {
                type: DataTypes.STRING, 
                allowNull: true 
            },
            OrderIDList: {
                type: DataTypes.JSON,
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