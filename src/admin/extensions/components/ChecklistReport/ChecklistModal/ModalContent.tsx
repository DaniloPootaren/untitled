import React, {memo, useEffect, useState} from 'react';
import {
  Button,
  DatePicker,
  Field,
  FieldError,
  FieldHint,
  FieldInput,
  FieldLabel,
  Flex,
  Grid,
  GridItem,
} from '@strapi/design-system';
import {ChecklistReportFormModel, Options} from '../../../model';
import CustomSelect from '../../shared/Select';
import {
  checklistSearch,
  hospitalSearch,
  transformApiToOptions,
} from '../helpers';
import {
  Control,
  UseFormRegister,
  UseFormReset,
} from 'react-hook-form/dist/types/form';
import {FieldErrors} from 'react-hook-form/dist/types/errors';
import CustomToggle from '../../shared/Toggle';
import {Controller} from 'react-hook-form';

const ModalContent = (props: {
  register: UseFormRegister<ChecklistReportFormModel>;
  control: Control<ChecklistReportFormModel>;
  errors: FieldErrors<ChecklistReportFormModel>;
  reset: UseFormReset<ChecklistReportFormModel>;
}) => {
  const {register, control, errors, reset} = props;
  const [checklists, setChecklists] = useState<Options[]>();
  const [hospitals, setHospitals] = useState<Options[]>();

  const searchChecklist = React.useCallback(async text => {
    const checklistResponse = await checklistSearch(text);
    setChecklists(transformApiToOptions(checklistResponse));
  }, []);

  const searchHospital = React.useCallback(async text => {
    const hospitalResponse = await hospitalSearch(text);
    setHospitals(transformApiToOptions(hospitalResponse));
  }, []);

  useEffect(() => {
    searchChecklist(null);
    searchHospital(null);
  }, []);

  const resetForm = (): void => {
    reset({
      hospital: '',
      checklist: '',
      ward: '',
      approved: null,
      submitted_date_from: null,
      submitted_date_to: null,
    });
  };

  return (
    <>
      <Grid gap={4}>
        <GridItem>
          <Field required={true}>
            <Flex direction="column" alignItems="flex-start" gap={1}>
              <FieldLabel>Checklist</FieldLabel>
              <CustomSelect
                data={checklists}
                placeholder={'Type something...'}
                control={control}
                name={'checklist'}
                rules={{
                  required: true,
                }}
                error={errors.checklist}
                onSearch={searchChecklist}
              />
            </Flex>
          </Field>
        </GridItem>

        <GridItem>
          <Field>
            <Flex direction="column" alignItems="flex-start" gap={1}>
              <FieldLabel>Hospital</FieldLabel>
              <CustomSelect
                data={hospitals}
                placeholder={'Type something...'}
                control={control}
                name={'hospital'}
                error={errors.hospital}
                onSearch={searchHospital}
              />
              <FieldError />
            </Flex>
          </Field>
        </GridItem>

        <GridItem {...inputStyles}>
          <Field hint="E.g. Ward 3">
            <Flex direction="column" alignItems="flex-start" gap={1}>
              <FieldLabel>Ward</FieldLabel>
              <FieldInput placeholder="Insert ward" {...register('ward')} />
              <FieldError />
              <FieldHint />
            </Flex>
          </Field>
        </GridItem>
      </Grid>

      <Grid gap={4} paddingTop={4}>
        <GridItem {...inputStyles}>
          <CustomToggle label="Approved" name="approved" control={control} />
        </GridItem>

        <GridItem {...inputStyles}>
          <Field>
            <Flex direction="column" alignItems="flex-start" gap={1}>
              <Controller
                render={({field: {onChange, value}}) => (
                  <DatePicker
                    label="Submitted Date (From)"
                    error={errors.submitted_date_from}
                    onChange={onChange}
                    selectedDate={value}
                  />
                )}
                name={'submitted_date_from'}
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
                    label="Submitted Date (To)"
                    error={errors.submitted_date_to}
                    onChange={onChange}
                    selectedDate={value}
                  />
                )}
                name={'submitted_date_to'}
                control={control}
              />
            </Flex>
          </Field>
        </GridItem>

        <GridItem>
          <Button marginTop={5} size={'L'} onClick={resetForm}>
            Reset
          </Button>
        </GridItem>
      </Grid>
    </>
  );
};

const inputStyles = {
  minWidth: '200px',
};

export default memo(ModalContent);
