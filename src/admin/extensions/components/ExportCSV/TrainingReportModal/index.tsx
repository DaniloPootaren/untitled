import React, {memo, useState} from 'react';
import {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalLayout,
  Typography,
} from '@strapi/design-system';
import {FileFormat, Options, TrainingReportFormModel} from '../../../model';
import {useForm} from 'react-hook-form';
import {ModalContent} from './ModalContent';
import {FooterActions} from './FooterActions';
import {fetchData} from '../../../utils/contentApis';
import {axiosRequestConfig} from '../../../helpers/exportCSV';
import {
  downloadCSVFile,
  getFileNameFromContentDisposition,
} from '../../../helpers/download';
import {useNotification} from '@strapi/helper-plugin';
import {constructTrainingUrl, getCurrentSlug} from '../../../utils/url';
import {useLocation} from 'react-router-dom';

const TrainingReportModal = (props: {onClose: () => void}) => {
  const {onClose} = props;
  const [loading, setLoading] = useState<FileFormat>(null);
  const toggleNotification = useNotification();
  const location = useLocation();
  const currentSlug = getCurrentSlug(location.pathname);

  const form = useForm<TrainingReportFormModel>();
  const {
    register,
    control,
    formState: {errors},
    setValue,
    reset,
    getValues,
  } = form;

  const exportAsSheet = async (
    url: string,
    fileFormat: FileFormat,
  ): Promise<void> => {
    try {
      const values = getValues();
      setLoading(fileFormat);
      const response = await fetchData(url, {
        ...axiosRequestConfig,
        params: {...values, title: (values.title as Options)?.value},
      });
      downloadCSVFile(
        response.data,
        getFileNameFromContentDisposition(response.headers),
        response.headers['content-type'],
      );
    } catch (err) {
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
  };

  return (
    <ModalLayout onClose={onClose}>
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2">
          Generate Report For Training Results
        </Typography>
      </ModalHeader>

      <ModalBody>
        <ModalContent
          register={register}
          control={control}
          errors={errors}
          reset={reset}
          setValue={setValue}
        />
      </ModalBody>

      <ModalFooter
        endActions={
          <FooterActions
            loading={loading}
            onDownload={fileFormat =>
              exportAsSheet(
                constructTrainingUrl(currentSlug, location.search, fileFormat),
                fileFormat,
              )
            }
          />
        }></ModalFooter>
    </ModalLayout>
  );
};

export default memo(TrainingReportModal);
