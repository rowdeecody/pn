import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../core/database';

export interface TransactionAttributes {
    id: number;
    pc_id: number | null;
    amount: number;
    type: string;
    created_at?: Date;
}

export interface TransactionCreationAttributes extends Optional<TransactionAttributes, 'id' | 'type' | 'pc_id'> {}

class Transaction extends Model<TransactionAttributes, TransactionCreationAttributes> implements TransactionAttributes {
    public id!: number;
    public pc_id!: number | null;
    public amount!: number;
    public type!: string;

    public readonly created_at!: Date;
}

Transaction.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        pc_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            defaultValue: 'coin_insert',
        },
    },
    {
        sequelize,
        tableName: 'transactions',
        updatedAt: false, // transactions are logs, usually immutable
    }
);

export default Transaction;
