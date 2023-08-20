import React from 'react';
import { Text } from 'prixa-design-kit/dist';

const imgCoronaryHeart = `${process.env.REACT_APP_ASSET_URL}/home/Img-Penyakit-Jantung-Koroner.png`;
const imgBronchialAsthma = `${process.env.REACT_APP_ASSET_URL}/home/Img-Asma-Bronkial.png`;
const imgGERD = `${process.env.REACT_APP_ASSET_URL}/home/Img-GERD.png`;
const imgARDS = `${process.env.REACT_APP_ASSET_URL}/home/Img-ARDS.png`;

const BannerPrixaDict = (): JSX.Element => {
  const dictContent = [
    {
      text: 'Penyakit Jantung Koroner',
      subtext: '2 menit membaca',
      img: imgCoronaryHeart,
      enable: true,
      link: '',
    },
    {
      text: 'Asma Bronkial',
      subtext: '1 menit membaca',
      img: imgBronchialAsthma,
      enable: true,
      link: '',
    },
    {
      text: 'GERD',
      subtext: '3 menit membaca',
      img: imgGERD,
      enable: true,
      link: '',
    },
    {
      text: 'ARDS',
      subtext: '3 menit membaca',
      img: imgARDS,
      enable: true,
      link: '',
    },
  ];

  return (
    <section id="prixa-dict-section">
      <div className="text">
        <Text scale="pageTitle">Kamus Prixa</Text>
        <Text scale="feedbackLink" style={{ cursor: 'pointer' }}>
          Lihat Semua
        </Text>
      </div>
      {dictContent.map((data, i) => {
        if ((i + 1) % 2 === 1) {
          return (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
              <DictContentBlock
                text={data.text}
                subtext={data.subtext}
                img={data.img}
                enable={data.enable}
                link={data.link}
              />
              <DictContentBlock
                text={dictContent[i + 1].text}
                subtext={dictContent[i + 1].subtext}
                img={dictContent[i + 1].img}
                enable={dictContent[i + 1].enable}
                link={dictContent[i + 1].link}
              />
            </div>
          );
        } else {
          return <span key={i} />;
        }
      })}
    </section>
  );
};

const DictContentBlock = ({
  text,
  subtext,
  img,
  enable,
  link,
}: {
  text: string;
  subtext: string;
  img: string;
  enable: boolean;
  link: string;
}): JSX.Element => {
  const imagePlate = (
    <div>
      <div style={{ width: '140px', height: '140px', marginBottom: '8px' }}>
        <img
          loading="lazy"
          src={img}
          alt="Kamus Prixa"
          style={{ width: '100%', height: 'auto', borderRadius: '16px' }}
        />
      </div>
      <div>
        <Text scale="headerTitle">{text}</Text>
      </div>
      <div style={{ display: 'flex', marginTop: '4px' }}>
        <Text scale="headerSubtitle" style={{ fontWeight: 100 }}>
          {subtext}
        </Text>
      </div>
    </div>
  );

  if (enable) {
    return imagePlate;
  } else {
    return <span></span>;
  }
};

export default BannerPrixaDict;
