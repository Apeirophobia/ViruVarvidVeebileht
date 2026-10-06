import { Sequelize, DataTypes } from "sequelize";

export default function ServiceModel(
    sequelize: Sequelize,
    dataTypes: typeof DataTypes
) {
    const Service = sequelize.define(
        "Service", {
            // need uuid
            ServiceID: {
                type: dataTypes.UUIDV4
            },
            ServiceName: {
                type: dataTypes.STRING,
                allowNull: false
            },
            Price: {
                type: dataTypes.INTEGER,
                allowNull: false
            },
            Category: {
                type: dataTypes.STRING,
                allowNull: false
            },
            Description: {
                type: dataTypes.STRING
            }
        }
    )
}
