import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import Categories from "./CategoriesModel.js";

const Product = sequelize.define(
    'products',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true
      }
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
)

Product.belongsTo(Categories, {
    as: 'categories',
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
    foreignKey: {
      name: 'idCategories',
      allowNull: false,
      field: 'id_categories',
    }
  });
  
  export default Product;