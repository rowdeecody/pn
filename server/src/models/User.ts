import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../core/database';
import { STATUSES } from '../utils/enums/UserEnum';

export interface UserAttributes {
    id: number;
    name: string;
    username: string;
    email: string;
    password_hash: string;
    role: string;
    status: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'role' | 'status'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public name!: string;
    public username!: string;
    public email!: string;
    public password_hash!: string;
    public role!: string;
    public status!: string;

    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: 'admin',
        },
        status: {
            type: DataTypes.ENUM(STATUSES.Active, STATUSES.Inactive, STATUSES.Suspended),
            defaultValue: STATUSES.Active,
        },
    },
    {
        sequelize,
        tableName: 'users',
    }
);

export default User;
