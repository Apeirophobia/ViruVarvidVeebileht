import { Sequelize, DataTypes } from "sequelize";

export default function ContactModel (
    sequelize: Sequelize,
    dataTypes: typeof DataTypes
) {
    const Contact = sequelize.define(
        "Contact", {
            ContactID: {
                type: dataTypes.UUIDV4
            },
            Name: {
                type: dataTypes.STRING
            },
            Email: {
                type: dataTypes.STRING,
                allowNull: true
            },
            PhoneNumber: {
                type: dataTypes.STRING,
                allowNull: true
            }
        }
    )
}