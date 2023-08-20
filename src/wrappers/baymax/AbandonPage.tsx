import React, { useEffect } from 'react';
import { Button } from 'prixa-design-kit/dist';

export const AbandonSidesheet = (): JSX.Element => {
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      window.location.href = '/';
    }, 60000);

    return (): void => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      className="margin-largeX margin-baseT margin-xLargeB padding-baseB"
      style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', textAlign: 'center' }}
    >
      <img
        alt="patient abandon consulatation session"
        src={`${process.env.REACT_APP_ASSET_URL}/illustration/no-consent.png`}
        style={{ width: '100%', height: 'auto' }}
        className="margin-baseB"
      />
      <p
        className="margin-baseB"
        style={{
          lineHeight: '1.5rem',
        }}
      >
        Sesi konsultasi Anda diakhiri karena tidak ada respon selama lebih dari 5 menit. Kembali ke Beranda dan pilih{' '}
        <b>Konsultasi via Chat</b> untuk memulai sesi konsultasi baru.
      </p>
      <Button
        onClick={(): void => {
          window.location.href = '/';
        }}
        size="xLarge"
        variant="primary"
      >
        Kembali ke Beranda
      </Button>
    </div>
  );
};

export default AbandonSidesheet;
