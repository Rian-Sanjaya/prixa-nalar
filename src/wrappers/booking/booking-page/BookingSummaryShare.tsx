import React, { Fragment, useState } from 'react';
import { Text } from 'prixa-design-kit/dist';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import * as htmlToImage from 'html-to-image';
import 'react-datepicker/dist/react-datepicker.css';

const BookingSummaryShare = () => {
  const [isDownloaded, setDownloaded] = useState(true);

  const saveImage = () => {
    setDownloaded(false);
    const bookingAppointment: any = document.getElementById('booking-appointment');
    htmlToImage
      .toJpeg(bookingAppointment, { quality: 0.9, backgroundColor: 'var(--primary)' })
      .then(function(dataUrl: any) {
        const link = document.createElement('a');
        link.download = 'appointment-' + Date.now() + '.jpeg';
        link.href = dataUrl;
        link.click();
        setDownloaded(true);
      });
  };

  return (
    <Fragment>
      {isDownloaded ? (
        <div data-cy="download-appointment" onClick={() => saveImage()} style={{ cursor: 'pointer' }}>
          <FontAwesomeIcon style={{ color: '#FFFFFF', marginRight: '16px' }} icon={faDownload} />
          <Text scale="headerTitle" style={{ color: '#FFFFFF' }}>
            Simpan Gambar
          </Text>
        </div>
      ) : (
        <FontAwesomeIcon style={{ color: 'white' }} icon={faCircleNotch} size="2x" spin />
      )}
    </Fragment>
  );
};

export { BookingSummaryShare };
