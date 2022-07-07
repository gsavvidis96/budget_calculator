import { Table, Column, Model, HasOne, CreatedAt, UpdatedAt, DeletedAt } from 'sequelize-typescript'
import { Optional, DataTypes } from 'sequelize'
import { Providers, Roles } from '../../types';
// import Profile, { ProfileCreationAttributes } from './profile.model';

export interface UserAttributes {
    id: string;
    email: string;
    role: Roles
    provider: Providers
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {
    // profile?: ProfileCreationAttributes
}

@Table({
    modelName: "User",
    tableName: "users",
    paranoid: true,
})
export default class User extends Model<UserAttributes, UserCreationAttributes> {
    @Column({
        type: DataTypes.STRING,
        primaryKey: true
    })
    id!: string

    @Column({
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    })
    email!: string

    @Column({
        type: DataTypes.ENUM(...Object.keys(Roles)),
        allowNull: false,
    })
    role!: Roles

    @Column({
        type: DataTypes.ENUM(...Object.keys(Providers)),
        allowNull: false,
    })
    provider!: Providers

    @CreatedAt
    @Column
    createdAt?: Date;

    @UpdatedAt
    @Column
    updatedAt?: Date;

    @DeletedAt
    @Column
    deletedAt?: Date;

    // @HasOne(() => Profile)
    // profile!: Profile

    // @AfterDestroy
    // static async afterDestroyHook(user: User, options: any) {
    //     try {
    //         const profile = await user.$get("profile");

    //         await profile?.destroy({
    //             transaction: options.transaction
    //         })
    //     } catch (e) {
    //         throw e;
    //     }
    // }
}