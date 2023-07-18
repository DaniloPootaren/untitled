import React, {memo, useCallback, useState} from 'react';
import {
  Box,
  Button,
  Field,
  FieldError,
  FieldHint,
  FieldInput,
  FieldLabel,
  Flex,
  Stack,
} from '@strapi/design-system';
import {useIntl} from 'react-intl';
import {Write} from '@strapi/icons';
import {LeafletDialog} from './Map';
import {LatLngLiteral} from 'leaflet';
import {coordinateRegex} from '../index';

const transformLatLngToString = (pos: LatLngLiteral): string => {
  const dp = 6;
  return `${pos.lat.toFixed(dp)}, ${pos.lng.toFixed(dp)}`;
};

// -20.323, 33.444
const transformStringToLatLng = (value: string): LatLngLiteral | null => {
  if (!value.match(coordinateRegex)) {
    return null;
  }
  const [lat, lng] = value.split(',');
  return {
    lng: +lng.trim(),
    lat: +lat.trim(),
  };
};

const component = ({
  attribute,
  onChange,
  name,
  value,
  disabled,
  labelAction,
  intlLabel,
  required,
  description,
  error,
}: any) => {
  const {formatMessage} = useIntl();
  const [showMap, setShowMap] = useState<boolean>();
  const position: LatLngLiteral | null = value
    ? transformStringToLatLng(value)
    : null;

  const saveData = useCallback((val?: LatLngLiteral) => {
    setShowMap(false);

    if (val) {
      onChange({
        target: {
          name,
          value: transformLatLngToString(val),
          type: 'text',
        },
      });
    }
  }, []);

  const errorMsg = useCallback(() => {
    if (error === 'The value does not match the regex.') {
      return 'Allowed format: -20.1233, 57.9343';
    }
    return error;
  }, [error]);

  return (
    <Flex>
      <Field
        name={name}
        id={name}
        error={errorMsg()}
        hint="e.g. -20.1233, 57.9343">
        <Stack spacing={1}>
          <FieldLabel action={labelAction} required={required}>
            {formatMessage(intlLabel)}
          </FieldLabel>

          <FieldInput
            type="text"
            placeholder="Insert coordinates here"
            disabled={disabled}
            required={required}
            value={value}
            onChange={onChange}
          />
          <FieldHint />
          <FieldError />
        </Stack>
      </Field>

      <Box paddingLeft={2} width={'150px'}>
        <Button
          size="L"
          endIcon={<Write />}
          onClick={() => setShowMap(true)}
          fullWidth>
          Open Map
        </Button>
      </Box>

      {showMap && (
        <LeafletDialog onClose={saveData} persistedPosition={position} />
      )}
    </Flex>
  );
};

export default memo(component);
