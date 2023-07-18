import React, {memo, useState} from 'react';
import {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalLayout,
  Typography,
} from '@strapi/design-system';
import FooterActions from './FooterActions';
import {ChecklistReportFormModel, ComponentEnum, Options} from '../../../model';
import ModalContent from './ModalContent';
import {useForm} from 'react-hook-form';
import {checklistReportHandler} from '../helpers';
import {
  downloadCSVFile,
  getFileNameFromContentDisposition,
} from '../../../helpers/download';

const {useNotification} = require('@strapi/helper-plugin');

const ChecklistModal = (props: {onClose: () => void}) => {
  const {onClose} = props;

  const toggleNotification = useNotification();
  const [loading, setLoading] = useState<ComponentEnum>();
  const form = useForm<ChecklistReportFormModel>();
  const {
    trigger,
    getValues,
    register,
    control,
    formState: {errors},
    reset,
  } = form;

  const downloadReport = React.useCallback(async (type: ComponentEnum) => {
    const isValid = await trigger();

    if (!isValid) {
      return;
    }
    const {
      hospital,
      checklist,
      ward,
      approved,
      submitted_date_from,
      submitted_date_to,
    } = getValues();

    try {
      setLoading(type);
      const response = await checklistReportHandler(type, {
        checklist: (checklist as Options).value,
        hospital: (hospital as Options)?.value,
        checklistName: (checklist as Options).label,
        hospitalName: (hospital as Options)?.label,
        ward,
        approved,
        submitted_date_from,
        submitted_date_to,
      });

      downloadCSVFile(
        response.data,
        getFileNameFromContentDisposition(response.headers),
        response.headers['content-type'],
      );
    } catch (err: any) {
      const error = err.response.data;
      if (error) {
        new Blob([err.response.data]).text().then(res => {
          const errorObj = JSON.parse(res);
          toggleNotification({
            type: 'warning',
            message: errorObj.error.message,
          });
        });
      }
    } finally {
      setLoading(null);
    }
  }, []);

  return (
    <ModalLayout onClose={onClose}>
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2">
          Generate Report For Submitted Checklists
        </Typography>
      </ModalHeader>

      <ModalBody>
        <ModalContent
          register={register}
          control={control}
          errors={{
            ...errors,
          }}
          reset={reset}
        />
      </ModalBody>

      <ModalFooter
        endActions={
          <FooterActions action={downloadReport} loading={loading} />
        }></ModalFooter>
    </ModalLayout>
  );
};

export default memo(ChecklistModal);
