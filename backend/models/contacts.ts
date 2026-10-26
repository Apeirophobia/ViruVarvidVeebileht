import { Sequelize, DataTypes } from "sequelize";

export default function ContactModel (
    sequelize: Sequelize,
    dataTypes: typeof DataTypes
) {
    const Contact = sequelize.define(
        "Contact", {
            ContactID: {
                type: DataTypes.UUIDV4,
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
        }
    )
}