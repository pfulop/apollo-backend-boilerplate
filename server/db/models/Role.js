import { Model } from 'objection';
import RootModel from './RootModel';
import User from './User';

export default class Role extends RootModel {
  static get tableName() {
    return 'roles';
  }
  findById(id) {
    return this.query().findById(id);
  }
  static get relationMappings() {
    return {
      users: {
        relation: Model.HasManyRelation,
        modelClass: User,
        join: {
          from: 'roles.id',
          to: 'users.roleId',
        },
      },
    };
  }


  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],

      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        created_at: { type: 'string' },
        updated_at: { type: 'string' },
      },
    };
  }
}
