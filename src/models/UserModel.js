import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

const User = sequelize.define(
    'users',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userName: {
            field: 'user_name',
            unique: true,
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        cpf: {
            type: DataTypes.STRING(14),
            allowNull: false,
            unique: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING(16),
            allowNull: false,
        },
        passwordHash: {
            field: 'password_hash',
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        cart: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        codigoTemporario: {
            field: 'codigo_temporario',
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        expiracaoCodigoTemporario: {
            field: 'expiracao_codigo_temporario',
            type: DataTypes.DATE,
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

export default User;