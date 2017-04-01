/* eslint import/prefer-default-export: 0 */
/* eslint consistent-return: 0 */
import { ADMIN, ROOT, USER, ADMINID, ROOTID, USERID } from '../../../config';

export function seed(knex, Promise) {
  return Promise.join(
    knex('roles').where({ id: ADMINID }).then((rows) => {
      if (rows.length < 1) {
        return knex('roles').insert([{ name: ADMIN, id: ADMINID }, { name: ROOT, id: ROOTID }, { name: USER, id: USERID }]).then(f => f);
      }
    })
  );
}
