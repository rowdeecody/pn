import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../core/database';

export interface SessionAttributes {
    id: number;
    pc_id: number;
    start_time: Date;
    end_time?: Date;
    coins_inserted: number;
    amount_paid: number;
    status: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface SessionCreationAttributes extends Optional<
    SessionAttributes,
    'id' | 'start_time' | 'end_time' | 'coins_inserted' | 'amount_paid' | 'status'
> {}

class Session extends Model<SessionAttributes, SessionCreationAttributes> implements SessionAttributes {
    public id!: number;
    public pc_id!: number;
    public start_time!: Date;
    public end_time?: Date;
    public coins_inserted!: number;
    public amount_paid!: number;
    public status!: string;
}

Session.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        pc_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        start_time: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        end_time: {
            type: DataTypes.DATE,
        },
        coins_inserted: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        amount_paid: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },
        status: {
            type: DataTypes.ENUM('active', 'completed', 'cancelled'),
            defaultValue: 'active',
        },
    },
    {
        sequelize,
        tableName: 'sessions',
    }
);

export default Session;
