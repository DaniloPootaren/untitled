import React, {memo, useEffect, useState} from 'react';
import {
  Control,
  UseFormRegister,
  UseFormReset,
  UseFormSetValue,
} from 'react-hook-form/dist/types/form';
import {Options, TrainingReportFormModel} from '../../../model';
import {FieldErrors} from 'react-hook-form/dist/types/errors';
import {
  Button,
  DatePicker,
  Field,
  FieldLabel,
  Flex,
  Grid,
  GridItem,
} from '@strapi/design-system';
import {Controller} from 'react-hook-form';
import CustomSelect from '../../shared/Select';
import {searchTitles} from '../helpers';

const inputStyles = {
  minWidth: '200px',
};

const Component = (props: {
  register: UseFormRegister<TrainingReportFormModel>;
  control: Control<TrainingReportFormModel>;
  errors: FieldErrors<TrainingReportFormModel>;
  setValue: UseFormSetValue<TrainingReportFormModel>;
  reset: UseFormReset<TrainingReportFormModel>;
}) => {
  const {register, control, errors, reset} = props;

  const [titles, setTitles] = useState<Options[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const resetForm = (): void => {
    reset({
      title: '',
      start_date_from: '',
      start_date_to: '',
      end_date_from: '',
      end_date_to: '',
    });
  };

  const searchTitle = React.useCallback(async text => {
    try {
      setIsLoading(true);
      const response: {title: string}[] = await searchTitles(text);
      setTitles(response.map(item => ({label: item.title, value: item.title})));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    searchTitle('');
  }, []);

  return (
    <>
      <Grid gap={4}>
        <GridItem {...inputStyles}>
          <Field required={true}>
            <Flex direction="column" alignItems="flex-start" gap={1}>
              <FieldLabel>Title</FieldLabel>
              <CustomSelect
                data={titles}
                placeholder={'Type something...'}
                control={control}
                name={'title'}
                rules={{
                  required: true,
                }}
                error={errors.title}
                onSearch={searchTitle}
              />
            </Flex>
          </Field>
        </GridItem>

        <GridItem {...inputStyles}>
          <Field>
            <Flex direction="column" alignItems="flex-start" gap={1}>
              <Controller
                render={({field: {onChange, value}}) => (
                  <DatePicker
                    label="Start Date (From)"
                    error={errors.start_date_from}
                    onChange={onChange}
                    selectedDate={value}
                  />
                )}
                name={'start_date_from'}
                control={control}
              />
            </Flex>
          </Field>
        </GridItem>

        <GridItem {...inputStyles}>
          <Field>
            <Flex direction="column" alignItems="flex-start" gap={1}>
              <Controller
                render={({field: {onChange, value}}) => (
                  <DatePicker
                    label="Start Date (To)"
                    error={errors.start_date_to}
                    onChange={onChange}
                    selectedDate={value}
                  />
                )}
                name={'start_date_to'}
                control={control}
              />
            </Flex>
          </Field>
        </GridItem>
      </Grid>

      <Grid gap={4} paddingTop={4}>
        <GridItem {...inputStyles}>
          <Field>
            <Flex direction="column" alignItems="flex-start" gap={1}>
              <Controller
                render={({field: {onChange, value}}) => (
                  <DatePicker
                    label="End Date (From)"
                    error={errors.end_date_from}
                    onChange={onChange}
                    selectedDate={value}
                  />
                )}
                name={'end_date_from'}
                control={control}
              />
            </Flex>
          </Field>
        </GridItem>

        <GridItem {...inputStyles}>
          <Field>
            <Flex direction="column" alignItems="flex-start" gap={1}>
              <Controller
                render={({field: {onChange, value}}) => (
                  <DatePicker
                    label="End Date (To)"
                    error={errors.end_date_to}
                    onChange={onChange}
                    selectedDate={value}
                  />
                )}
                name={'end_date_to'}
                control={control}
              />
            </Flex>
          </Field>
        </GridItem>
      </Grid>

      <Grid gap={4} paddingTop={4}>
        <GridItem>
          <Button
            marginTop={5}
            size={'L'}
            onClick={resetForm}
            isLoading={isLoading}>
            Reset
          </Button>
        </GridItem>
      </Grid>
    </>
  );
};

export const ModalContent = memo(Component);
