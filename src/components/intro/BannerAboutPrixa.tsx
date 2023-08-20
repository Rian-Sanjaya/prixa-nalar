import React from 'react';
import { Card, Text } from 'prixa-design-kit/dist';

const imgAboutPrixa = `${process.env.REACT_APP_ASSET_URL}/home/Bg-About-Prixa.png`;

const BannerAboutPrixa = () => {
  return (
    <section id="about-prixa-section">
      <Card className="about-prixa-container">
        <div style={{ padding: '24px 24px 40px' }}>
          <div className="title">
            <Text scale="pagesubtitle">Tentang Prixa</Text>
          </div>
          <div className="subtitle">
            <Text scale="heroTitle">Teman Sehatmu</Text>
          </div>
          <div className="description">
            <Text scale="headerSubtitle" style={{ lineHeight: 1.5, fontWeight: 500 }}>
              Hadir menemani setiap langkahmu menuju hidup yang lebih sehat. Untuk sekarang dan masa yang akan datang,
              untuk Anda dan generasi selanjutnya.
            </Text>
          </div>
          <div className="read-button">
            <button>Baca Selengkapnya</button>
          </div>
        </div>
        <div
          className="about-prixa-img"
          style={{
            width: '100%',
            height: '200px',
            backgroundImage: `url(${imgAboutPrixa})`,
            backgroundSize: 'cover',
            backgroundPosition: '0 -47px',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* <img loading="lazy" src={imgAboutPrixa} alt="About Prixa" /> */}
        </div>
      </Card>
    </section>
  );
};

export default BannerAboutPrixa;
