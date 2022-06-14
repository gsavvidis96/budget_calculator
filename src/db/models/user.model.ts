import { Table, Column, Model, HasOne, CreatedAt, UpdatedAt, DeletedAt, Default, AfterDestroy } from 'sequelize-typescript'
import { Optional, DataTypes } from 'sequelize'
import { Providers, Roles } from '../../types';
// import Profile, { ProfileCreationAttributes } from './profile.model';

export interface UserAttributes {
    id: string;
    email: string;
    createdWith: Providers;
    providerId?: string;
    password?: string;
    role: Roles
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
    @Default(DataTypes.UUIDV4)
    @Column({
        type: DataTypes.UUID,
        primaryKey: true,
    })
    id!: string

    @Column({
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    })
    email!: string

    @Column({
        type: DataTypes.ENUM(...Object.keys(Providers)),
        allowNull: false,
    })
    createdWith!: Providers

    @Column({
        type: DataTypes.STRING
    })
    providerId?: string

    @Column({
        type: DataTypes.STRING
    })
    password?: string

    @Column({
        type: DataTypes.ENUM(...Object.keys(Roles)),
        allowNull: false,
    })
    role!: Roles

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