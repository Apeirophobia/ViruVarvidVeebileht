import { DataTypes, Model } from "sequelize";
import type { CreationOptional, InferAttributes, InferCreationAttributes, Sequelize } from "sequelize";

export class Contact extends Model<InferAttributes<Contact>, InferCreationAttributes<Contact>> {
    declare ContactID: CreationOptional<string>;
    declare Name: string | null;
    declare Email: string | null;
    declare PhoneNumber: string | null;
}

export default function initContactModel(sequelize: Sequelize) {
    Contact.init(
        {
            ContactID: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            Name: {
                type: DataTypes.STRING
            },
            Email: {
                type: DataTypes.STRING,
                allowNull: true
            },
            PhoneNumber: {
                type: DataTypes.STRING,
                allowNull: true
            }
        },
        {
            sequelize,
            modelName: "Contact"
        }
    );

    return Contact;
}
