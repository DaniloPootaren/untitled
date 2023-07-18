import React, {memo} from 'react';
import {ToggleInput} from '@strapi/design-system';
import {Control, Controller} from 'react-hook-form';

const CustomToggle = (props: {
  label: string;
  name: string;
  control: Control<any>;
}) => {
  const {label, name, control} = props;

  return (
    <Controller
      render={({field: {onChange, value}}) => (
        <ToggleInput
          label={label}
          name={name}
          checked={value}
          onChange={onChange}
          onLabel="True"
          offLabel="False"
        />
      )}
      name={name}
      control={control}
    />
  );
};

export default memo(CustomToggle);
