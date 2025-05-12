import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

const Categories = sequelize.define(
    'categories',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        }
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'update_at'
    }
)

export default Categories;