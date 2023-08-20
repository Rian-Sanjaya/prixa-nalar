import React from 'react';
import { useHistory } from 'react-router-dom';
import { Text } from 'prixa-design-kit/dist';

const historyImg = `${process.env.REACT_APP_ASSET_URL}/home/CTA-History.png`;
const historyActivity = `${process.env.REACT_APP_ASSET_URL}/home/CTA-Activity-Transaction.png`;

const BannerHistoryActivity = () => {
  const historyContent = [
    {
      text: 'Riwayat Prixa',
      description: 'Catatan Hasil Prixa sebelumnya',
      img: historyImg,
      enable: true,
      link: '/diagnosis-history/result',
    },
    {
      text: 'Aktivitas & Transaksi',
      description: 'Yang telah Anda lakukan di Prixa',
      img: historyActivity,
      enable: true,
      link: '/diagnosis-history/activity',
    },
  ];

  return (
    <section id="history-activity-section">
      <div className="title">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
          <Text scale="pageTitle" style={{ lineHeight: '20px' }}>
            Kelola Kesehatan
          </Text>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
          <Text scale="pageTitle" style={{ lineHeight: '20px' }}>
            dari Genggaman Tangan
          </Text>
        </div>
      </div>
      {historyContent.map((data, i) => {
        return (
          <HistoryContentBlock
            key={i}
            text={data.text}
            description={data.description}
            img={data.img}
            enable={data.enable}
            link={data.link}
          />
        );
      })}
    </section>
  );
};

const HistoryContentBlock = ({
  text,
  description,
  img,
  enable,
  link,
}: {
  text: string;
  description: string;
  img: string;
  enable: boolean;
  link: string;
}): JSX.Element => {
  const history = useHistory();

  const imagePlate = (
    <div
      style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', cursor: 'pointer' }}
      onClick={(): void => history.push({ pathname: link })}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '8px',
          border: '2px solid var(--secondary)',
          padding: '10px',
          boxSizing: 'border-box',
        }}
      >
        <img loading="lazy" src={img} alt="iconBanner" style={{ width: '100%', height: 'auto' }} />
      </div>
      <div style={{ marginLeft: '24px' }}>
        <div style={{ display: 'flex', marginBottom: '4px' }}>
          <Text scale="headerTitle" style={{ color: 'var(--secondary)' }}>
            {text}
          </Text>
        </div>
        <div style={{ display: 'flex' }}>
          <Text scale="headerSubtitle" style={{ color: 'var(--muted)', fontWeight: 500 }}>
            {description}
          </Text>
        </div>
      </div>
    </div>
  );

  return enable ? imagePlate : <span></span>;
};

export default BannerHistoryActivity;
