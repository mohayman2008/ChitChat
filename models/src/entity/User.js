import { EntitySchema } from 'typeorm';

export const UserStatus = {
  ACTIVE: 'active',
  NOT_ACTIVE: 'not_active'
}

export const userSchema = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "varchar",
      length: 48
    },
    createdAt: {
      type: "timestamptz"
    },
    userName: {
      type: "varchar",
      unique: true
    },
    email: {
      type: "varchar",
      unique: true
    },
    password: {
      type: "varchar"
    },
    status: {
      type: "enum",
      enum: UserStatus,
      default: UserStatus.NOT_ACTIVE
    },
    ipVersion: {
      type: "int"
    },
    ip: {
      type: "varchar",
      length: 48
    },
    port: {
      type: "int"
    },
    key: {
      type: "varchar",
      length: 48
    },
    authTime: {
      type: "timestamptz"
    },
  },
  relations: {
    coversations: {
      target: "Conversation",
      type: "many-to-many",
      joinTable: true,
      cascade: true,
    },
  },
});
