import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import User from "./UserModel.js";
import Adress from "./AdressModel.js";
import Cupom from "./CupomModel.js";
import Payment from "./PaymentModel.js";

const Order = sequelize.define(
    'orders',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        status: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        total: {
            type: DataTypes.DECIMAL,
            allowNull: true,
        },
        totalDiscount: {
            field: 'total_discount',
            type: DataTypes.DECIMAL,
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

Order.belongsTo(User, {
    as: 'customer',
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
    foreignKey: {
      name: 'idUserCustomer',
      allowNull: false,
      field: 'id_user_customer',
    }
});

Order.belongsTo(User, {
    as: 'deliveryMan',
    onUpdate: 'NO ACTION',
    onDelete: 'SET NULL',
    foreignKey: {
      name: 'idUserDelivery',
      allowNull: true,
      field: 'id_user_delivery',
    }
});

Order.belongsTo(Adress, {
    as: 'adress',
    onUpdate: 'NO ACTION',
    onDelete: 'SET NULL',
    foreignKey: {
      name: 'idAdress',
      allowNull: true,
      field: 'id_adress',
    }
});

Order.belongsTo(Payment, {
    as: 'payment',
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
    foreignKey: {
      name: 'idPayment',
      allowNull: false,
      field: 'id_payment',
    }
});

Order.belongsTo(Cupom, {
    as: 'cupom',
    onUpdate: 'NO ACTION',
    onDelete: 'SET NULL',
    foreignKey: {
      name: 'idCupom',
      allowNull: true,
      field: 'id_cupom',
    }
});

export default Order;