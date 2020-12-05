exports.errorMessages = {
  routeNotFound: {
    code: 'Resource Not Found',
    message: 'Resource Not Found.',
  },
  internalServerError: {
    code: 'Internal Server Error',
    message: 'Internal Server Error.',
  },
  noPostDataProvided: {
    code: 'Bad Request',
    message: 'No Data Was Posted.',
  },
  noParamsDataProvided: {
    code: 'Bad Request',
    message: 'No Params Data Was Posted.',
  },
  duplicateDataProvided: {
    code: 'Bad Request',
    message: 'Duplicate Data Provided.',
  },
  noDataExist: {
    code: 'Bad Request',
    message: 'Data doesn\'t exist',
  },
  invalidDataProvided: (msg = 'Invalid Data') => {
    return {
      code: 'Bad Request',
      message: msg
    };
  },
  userExists: {
    code: 'Bad Request.',
    message: 'User Already Exists.'
  },
  userNotFound: {
    code: 'Bad Request',
    message: 'User Not Found.'
  },
  invalidEmailOrPassword: {
    code: 'Bad Request',
    message: 'Check Your Email/Password.'
  },
};
