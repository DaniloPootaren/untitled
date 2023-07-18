import {memo} from 'react';
import {Typography} from '@strapi/design-system';
import React from 'react';
import {getErrorMessage} from '../../../helpers/form';

const CustomError = (props: {id: string; error: string}) => {
  const {id, error} = props;
  return (
    <Typography
      variant="pi"
      as="p"
      id={`${id}-error`}
      textColor="danger600"
      data-strapi-field-error>
      {getErrorMessage(error)}
    </Typography>
  );
};

export default memo(CustomError);
