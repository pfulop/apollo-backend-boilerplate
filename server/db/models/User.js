import { Model } from 'objection';
import bcrypt from 'bcrypt';
import RootModel from './RootModel';
import Role from './Role';

export default class User extends RootModel {
  static get tableName() {
    return 'users';
  }
  $beforeUpdate() {
    this.updated_at = new Date().toISOString();

    if (this.password) { this.password = this.hashPassword(this.password); } else {
      delete this.password;
    }

    this.updated_at = new Date().getTime();
    if (this.tempPassword) {
      this.tempPassword = this.hashPassword(this.tempPassword);
    } else {
      this.tempPassword = null;
    }
  }
  $beforeInsert() {
    this.password = hashPassword(this.password);
    this.created_at = new Date().getTime();
  }
  verifyPassword(password) {
    let temp = false;
    if (this.tempPassword) {
      temp = bcrypt.compareSync(password, this.tempPassword);
    }
    return temp || bcrypt.compareSync(password, this.password);
  }

  static hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
  }
  static findById(id) {
    return this.query().eager('role').findById(id);
  }
  static authenticate(email, password) {
    return this.query().eager('role').where({
      email,
    }).first()
    .then((user) => {
      if (!user) {
        throw 'Not Found';
      }
      if (!user.verifyPassword(password)) {
        throw 'Wrong Credentials';
      }
      return user;
    });
  }
  static get relationMappings() {
    return {
      role: {
        relation: Model.BelongsToOneRelation,
        modelClass: Role,
        join: {
          from: 'users.roleId',
          to: 'roles.id',
        },
      },
    };
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['roleId', 'email', 'password', 'fullname', 'languageId'],

      properties: {
        id: { type: 'integer' },
        email: { type: 'string' },
        password: { type: 'string' },
        tempPassword: { type: 'string' },
        roleId: { type: 'integer' },
        created_at: { type: 'string' },
        updated_at: { type: 'string' },
      },
    };
  }
}
