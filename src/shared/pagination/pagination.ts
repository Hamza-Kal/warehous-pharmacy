// eslint-disable-next-line @typescript-eslint/no-var-requires
const _ = require('lodash');

import { paginationConstant } from './pagination.constant';

export const paginationParser = (reqQuery) => {
  const fields = ['page', 'limit', 'needPagination'];

  const pagination = _.pick(reqQuery, fields);

  const page = +pagination.page || 0;

  pagination.limit = +pagination.limit || paginationConstant.limit;

  pagination.skip = page * pagination.limit;

  pagination.needPagination =
    pagination.needPagination === 'false'
      ? false
      : paginationConstant.needPagination;
  const criteria = _.omit(reqQuery, fields);
  return { pagination, criteria };
};
