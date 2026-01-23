import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../core/database';
import { PC_STATUS } from '../utils/enums/PcEnum';

export interface PcAttributes {
    id: number;
    name: string;
    mac_address: string;
    ip_address: string;
    status: string;
    is_locked: boolean;
    remaining_time_seconds: number;
    last_heartbeat?: Date;
    created_at?: Date;
    updated_at?: Date;
}

// For creation, id is optional
export interface PcCreationAttributes extends Optional<PcAttributes, 'id' | 'remaining_time_seconds' | 'is_locked'> {}

class PC extends Model<PcAttributes, PcCreationAttributes> implements PcAttributes {
    public id!: number;
    public name!: string;
    public mac_address!: string;
    public ip_address!: string;
    public status!: string;
    public is_locked!: boolean;
    public remaining_time_seconds!: number;
    public last_heartbeat?: Date;

    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

PC.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        mac_address: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        ip_address: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        status: {
            type: DataTypes.ENUM(
                PC_STATUS.Online,
                PC_STATUS.Offline,
                PC_STATUS.Active,
                PC_STATUS.Maintenance,
                PC_STATUS.Restarting
            ),
            defaultValue: PC_STATUS.Offline,
        },
        is_locked: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        remaining_time_seconds: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        last_heartbeat: {
            type: DataTypes.DATE,
        },
    },
    {
        sequelize,
        tableName: 'pcs',
    }
);

export default PC;
