import React, {memo, useCallback, useState} from 'react';
import {
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalLayout,
  Typography,
} from '@strapi/design-system';
import {CheckCircle, Trash} from '@strapi/icons';
import {LeafletMap} from './map';
import {LatLngLiteral} from 'leaflet';

enum Type {
  danger,
  success,
}

const buttonIcons = {
  [Type.danger]: <Trash />,
  [Type.success]: <CheckCircle />,
};

const latlng: LatLngLiteral = {
  lat: -20.280764,
  lng: 57.506841,
};

const component = (props: {
  onClose: (val?: LatLngLiteral) => void;
  persistedPosition: LatLngLiteral | null;
}) => {
  const [position, setPosition] = useState<LatLngLiteral>(
    props.persistedPosition ?? latlng,
  );

  const positionHandler = useCallback((val: LatLngLiteral) => {
    setPosition(val);
  }, []);

  return (
    <ModalLayout labelledBy="title" onClose={() => props.onClose()}>
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
          Select Coordinate on Map
        </Typography>
      </ModalHeader>
      <ModalBody position="relative">
        <LeafletMap position={position} setPosition={positionHandler} />
      </ModalBody>
      <ModalFooter
        endActions={
          <>
            <Button onClick={() => props.onClose()} variant="tertiary">
              Cancel
            </Button>
            <Button
              variant="success-light"
              startIcon={buttonIcons[Type.success]}
              onClick={() => props.onClose(position)}>
              Save
            </Button>
          </>
        }
      />
    </ModalLayout>
  );
};

export const LeafletDialog = memo(component);
