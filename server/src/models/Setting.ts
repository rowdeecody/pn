import { DataTypes, Model } from 'sequelize';
import sequelize from '../core/database';

export interface SettingAttributes {
    key: string;
    value: string;
    type: string;
}

class Setting extends Model<SettingAttributes> implements SettingAttributes {
    public key!: string;
    public value!: string;
    public type!: string;
}

Setting.init(
    {
        key: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            defaultValue: 'string',
        },
    },
    {
        sequelize,
        tableName: 'settings',
        timestamps: false,
    }
);

export default Setting;
