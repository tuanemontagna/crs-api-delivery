import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

const Cliente = sequelize.define(
  'clientes',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    cpf: {
      type: DataTypes.STRING(14),
      allowNull: false,
      unique: true,
    },
    dataNascimento: {
      field: 'data_nascimento',
      type: DataTypes.DATEONLY,
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default Cliente;