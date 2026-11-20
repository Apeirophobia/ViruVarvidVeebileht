import type { UUID } from "node:crypto";
import { DataTypes, Model, UUIDV4 } from "sequelize";
import type { InferAttributes, InferCreationAttributes, CreationOptional, Sequelize } from "sequelize";
import type { Json } from "sequelize/lib/utils";

export class UserCollection extends Model<InferAttributes<UserCollection>,
InferCreationAttributes<UserCollection>> {
    //musthave
    declare CollectionName: string
    declare ServicesIDs: Json
    declare UserId: string

    //canhave
    declare id: CreationOptional<string | null>
    declare CollectionDescription: CreationOptional<string | null>

    //dbhave
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

export default function initUserCollectionModel(
    sequelize: Sequelize
) {
    UserCollection.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: UUIDV4,
                primaryKey: true
            },
            CollectionName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            CollectionDescription: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            // võõrvõtmed
            ServicesIDs: {
                type: DataTypes.JSON,
                allowNull: false
            },
            UserId: {
                type: DataTypes.UUID,
                allowNull: false
            },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: "UserCollection",
        }
    )
    
    return UserCollection
}