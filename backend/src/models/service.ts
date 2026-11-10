import { DataTypes, Model } from "sequelize";
import type { InferAttributes, InferCreationAttributes, CreationOptional, Sequelize } from "sequelize";

export class Service extends Model<InferAttributes<Service>, InferCreationAttributes<Service>> {
  declare ServiceName: string;
  declare Price: number;
  declare Category: string;

  declare ServiceID: CreationOptional<string>;
  declare Description: CreationOptional<string | null>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export default function initServiceModel(sequelize: Sequelize) {
  Service.init(
    {
      ServiceID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      ServiceName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Service"
    }
  );

  return Service;
}
