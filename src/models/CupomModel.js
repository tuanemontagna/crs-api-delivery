import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

const Cupom = sequelize.define(
    'cupoms',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        code: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        value: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        uses: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'update_at'
    }
)

export default Cupom;