import React from 'react';
import { useHistory } from 'react-router-dom';
import MultiCarousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Text } from 'prixa-design-kit/dist';

const carouselHome = `${process.env.REACT_APP_ASSET_URL}/carousel/prixa-app-intro.png`;
const carouselKeluhan = `${process.env.REACT_APP_ASSET_URL}/carousel/home-keluhan.png`;
const carouselPertanyaan = `${process.env.REACT_APP_ASSET_URL}/carousel/home-pertanyaan.png`;

const CustomDot = ({ onClick, active }: any): JSX.Element => {
  return <button className={active ? 'carousel-dot active' : 'carousel-dot'} onClick={() => onClick()}></button>;
};

const CustomButtonGroupAsArrows = ({ next, carouselState }: any): JSX.Element => {
  const history = useHistory();
  const { currentSlide } = carouselState;

  const handleNext = (next: any) => {
    if (currentSlide === 4) {
      history.push('/coupon');
    } else {
      next();
    }
  };

  return (
    <div
      className="carousel-next-button"
      style={{
        display: 'inline-block',
        position: 'absolute',
        right: 0,
        marginRight: '40px',
        fontWeight: 'bold',
        color: 'var(--primary)',
        fontSize: '16px',
        cursor: 'pointer',
      }}
      onClick={() => handleNext(next)}
    >
      Lanjut
    </div>
  );
};

const LandingCarousel = () => {
  return (
    <MultiCarousel
      additionalTransfrom={0}
      arrows={false}
      autoPlay={false}
      autoPlaySpeed={3000}
      centerMode={false}
      className=""
      containerClass="container"
      customDot={<CustomDot />}
      dotListClass=""
      draggable
      focusOnSelect={false}
      infinite
      itemClass=""
      keyBoardControl
      minimumTouchDrag={80}
      renderButtonGroupOutside={true}
      customButtonGroup={<CustomButtonGroupAsArrows />}
      renderDotsOutside
      responsive={{
        desktop: {
          breakpoint: {
            max: 3000,
            min: 1024,
          },
          items: 1,
        },
        mobile: {
          breakpoint: {
            max: 464,
            min: 0,
          },
          items: 1,
        },
        tablet: {
          breakpoint: {
            max: 1024,
            min: 464,
          },
          items: 1,
        },
      }}
      showDots
      sliderClass=""
      slidesToSlide={1}
      swipeable
    >
      <div className="animated fadeInUp">
        <div
          style={{
            width: '100%',
            height: '250px',
            margin: 'auto',
            backgroundImage: `url(${carouselHome})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '50% 50%',
          }}
        ></div>
        <div className="prixa-title" style={{ marginTop: '64px', width: '100%' }}>
          <Text scale="question" className="text-carousel">
            Lorem ipsum
          </Text>
          <Text scale="content" className="text-carousel margin-smallT">
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
            dolore magna
          </Text>
        </div>
      </div>
      <div>
        <div
          style={{
            width: '100%',
            height: '250px',
            margin: 'auto',
            backgroundImage: `url(${carouselKeluhan})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '50% 50%',
          }}
        ></div>
        <div className="prixa-title" style={{ marginTop: '64px', width: '100%' }}>
          <Text scale="question" className="text-carousel">
            Lorem ipsum
          </Text>
          <Text scale="content" className="text-carousel margin-smallT">
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
            dolore magna
          </Text>
        </div>
      </div>
      <div>
        <div
          style={{
            width: '100%',
            height: '250px',
            margin: 'auto',
            backgroundImage: `url(${carouselPertanyaan})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '50% 50%',
          }}
        ></div>
        <div className="prixa-title" style={{ marginTop: '64px', width: '100%' }}>
          <Text scale="question" className="text-carousel">
            Lorem ipsum
          </Text>
          <Text scale="content" className="text-carousel margin-smallT">
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
            dolore magna
          </Text>
        </div>
      </div>
    </MultiCarousel>
  );
};

export default LandingCarousel;
