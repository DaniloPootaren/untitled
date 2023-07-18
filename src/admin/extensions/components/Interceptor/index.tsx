import React, {memo, useEffect} from 'react';
import {isEmpty} from 'lodash';
import {editViewValidator} from '../../utils/validation';

const {
  useCMEditViewDataManager,
  useNotification,
} = require('@strapi/helper-plugin');

const Component = () => {
  const {modifiedData, formErrors, layout} = useCMEditViewDataManager();
  const toggleNotification = useNotification();

  useEffect(() => {
    if (!isEmpty(formErrors)) {
      const validator = editViewValidator[layout.uid];
      const error = validator?.(modifiedData);
      if (error) {
        toggleNotification({
          type: 'warning',
          message: error.error,
        });
      }
    }
  }, [formErrors]);

  return <></>;
};

export const Interceptor = memo(Component);
