import { QueryInterface, DataTypes } from 'sequelize';
import { Roles } from '../../types';

export default {
    up: async (queryInterface: QueryInterface): Promise<void> => {
        await queryInterface.createTable("users", {
            id: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false
            },
            role: {
                type: DataTypes.ENUM(...Object.keys(Roles)),
                allowNull: false,
            },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
            deletedAt: DataTypes.DATE,
        })
    },
    down: async (queryInterface: QueryInterface): Promise<void> => {
        await queryInterface.dropTable("users")
    }
};