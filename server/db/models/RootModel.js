import { Model } from 'objection';

export default class RootModel extends Model {
  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }
  $beforeInsert() {
    this.created_at = new Date().toISOString();
  }
  static get generateGraphSchema() {
    const required = {};
    const relations = {};
    const convertType = (type) => {
      switch (type) {
        case 'string': return 'String';
        case 'integer': return 'Int';
        case 'number': return 'Float';
        case 'boolean': return 'Boolean';
        default: return 'i will throw error';
      }
    };
    let typeDef = `type ${this.name} {`;

    Object.keys(this.jsonSchema.required).forEach(k => (required[this.jsonSchema.required[k]] = true));
    Object.keys(this.relationMappings).forEach((k) => {
      const relation = this.relationMappings[k];
      if (relation.relation === Model.HasManyRelation || relation.relation === Model.ManyToManyRelation) {
        relations[k] = `[${relation.modelClass.name}]`;
      } else {
        relations[k] = `${relation.modelClass.name}`;
      }
    });
    Object.keys(this.jsonSchema.properties).forEach((k) => {
      if (!{}.hasOwnProperty.call(relations, k) && k.indexOf('password') < 0) {
        const type = this.jsonSchema.properties[k].type;

        if (k === 'id') { typeDef += `${k}: ID!`; } else {
          typeDef += `${k}: ${convertType(type)}`;
        }

        if ({}.hasOwnProperty.call(required, k)) {
          typeDef += '!';
        }

        typeDef += ' ';
      }
    });
    Object.keys(relations).forEach((k) => {
      typeDef += `${k}: ${relations[k]}`;
      if ({}.hasOwnProperty.call(required, k) || {}.hasOwnProperty.call(required, `${k}Id`)) { typeDef += '!'; }
      typeDef += ' ';
    });

    typeDef += '}';
    return typeDef;
  }
}
