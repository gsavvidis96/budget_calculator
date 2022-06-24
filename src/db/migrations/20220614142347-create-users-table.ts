import { QueryInterface, DataTypes } from 'sequelize';
import { Providers, Roles } from '../../types';

export default {
    up: async (queryInterface: QueryInterface): Promise<void> => {
        await queryInterface.createTable("users", {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false
            },
            createdWith: {
                type: DataTypes.ENUM(...Object.keys(Providers)),
                allowNull: false,
            },
            providerId: DataTypes.STRING,
            password: DataTypes.STRING,
            role: {
                type: DataTypes.ENUM(...Object.keys(Roles)),
                allowNull: false,
            },
            emailVerified: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
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