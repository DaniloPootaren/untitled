import React, {memo, useEffect, useState} from 'react';
import Select from 'react-select';
import {ChecklistReportFormModel, Options} from '../../../model';
import {Control, Controller, FieldError} from 'react-hook-form';
import {UseControllerProps} from 'react-hook-form/dist/types/controller';
import CustomError from '../Error';
import {useDebounce} from '../../../hooks/useDebounce';

const CustomSelect = (props: {
  data: Options[];
  control: Control<any>;
  name: string;
  placeholder: string;
  rules?: UseControllerProps['rules'];
  error: FieldError;
  onSearch?: (text: string) => void;
}) => {
  const {data, control, name, placeholder, rules, error, onSearch} = props;
  const [searchText, setSearchText] = useState('');
  const debounce = useDebounce(searchText);

  useEffect(() => {
    if (onSearch && debounce?.trim()) {
      onSearch(debounce.trim());
    }
  }, [debounce]);

  const onInputChange = React.useCallback((val: string): void => {
    setSearchText(val);
  }, []);

  return (
    <>
      <Controller
        render={({field: {onChange, value}}) => (
          <Select
            options={data}
            value={value}
            onInputChange={onInputChange}
            placeholder={placeholder}
            menuPosition={'fixed'}
            onChange={onChange}
            styles={{
              control: baseStyles => ({
                ...baseStyles,
                ...inputStyles,
              }),
            }}
          />
        )}
        name={name}
        control={control}
        rules={rules}
      />
      <CustomError id={name} error={error?.type} />
    </>
  );
};

const inputStyles = {
  width: '200px',
};

export default memo(CustomSelect);
