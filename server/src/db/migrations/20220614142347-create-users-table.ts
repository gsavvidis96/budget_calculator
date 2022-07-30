import { QueryInterface, DataTypes } from 'sequelize';
import { Roles } from '../../types';

export default {
    up: async (queryInterface: QueryInterface): Promise<void> => {
        await queryInterface.createTable("users", {
            id: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            role: {
                type: DataTypes.ENUM(...Object.keys(Roles)),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false
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