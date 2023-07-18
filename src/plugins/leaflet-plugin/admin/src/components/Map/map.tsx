import React, {memo, useMemo, useRef} from 'react';
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import {LatLngLiteral} from 'leaflet';

const component = (props: {
  setPosition: (latlng: LatLngLiteral) => void;
  position: LatLngLiteral;
}) => {
  const {setPosition, position} = props;
  const markerRef = useRef<any>(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
        }
      },
    }),
    [],
  );

  return (
    <MapContainer
      center={position}
      maxZoom={18}
      zoom={13}
      scrollWheelZoom
      minZoom={5}
      style={{
        height: 300,
      }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        ref={markerRef}
        position={position}
        draggable
        eventHandlers={eventHandlers}>
        <Popup />
      </Marker>
    </MapContainer>
  );
};

export const LeafletMap = memo(component);
