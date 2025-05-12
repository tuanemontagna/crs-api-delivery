import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import User from "./UserModel.js";

const Adress = sequelize.define(
    'adresses',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        zipCode: {
            field: 'zip_code',
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        state: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        street: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        district: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        numberForget: {
            field: 'number_forget',
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'update_at'
    }
)

Adress.belongsTo(User, {
    as: 'user',
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
    foreignKey: {
      name: 'idUser',
      allowNull: false,
      field: 'id_user',
    }
});

export default Adress;