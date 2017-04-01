/* eslint import/prefer-default-export: 0 */
/* eslint consistent-return: 0 */

import bcrypt from 'bcrypt';
import { ADMINID } from '../../../config';

export function seed(knex, Promise) {
  return Promise.resolve()
  .then(() =>
  knex('users').where({ id: 1 }).then((rows) => {
    if (rows.length < 1) {
      return knex('users').insert({ id: 1, created_at: Date.now(), updated_at: Date.now(), roleId: ADMINID, email: 'office@regex.sk', password: bcrypt.hashSync('VsetciSuKokoti2016', bcrypt.genSaltSync(10), null) }).then(f => f);
    }
  })
  ).then(() =>
  knex('users').where({ id: 2 }).then((rows) => {
    if (rows.length < 1) {
      return knex('users').insert({ id: 2, created_at: Date.now(), updated_at: Date.now(), roleId: ADMINID, email: 'foro@eduma.sk', password: bcrypt.hashSync('poznanie', bcrypt.genSaltSync(10), null) }).then(f => f);
    }
  })
  ).then(f => f);
}
