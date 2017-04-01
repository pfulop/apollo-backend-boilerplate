import Knex from 'knex';
import { Model } from 'objection';
import { development } from './knexfile';

export const knex = Knex(development); // eslint-disable-line
Model.knex(knex);
