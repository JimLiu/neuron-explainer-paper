import React from "react";


export default ({ images, hide_caption }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const goToNextSlide = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  const goToPrevSlide = () => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };

  const caption = images[currentIndex].caption;
  const carouselBttnStyle = {
    position: 'absolute',
    zIndex: 2,
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    width: '50px',
    borderRadius: '3px',
    padding: '10px',
    cursor: 'pointer',
  };

return (
  <>
  <div style={{ position: "relative", alignItems: 'center', overflow: 'hidden' }}>
    <button style={{...carouselBttnStyle, left: '0px'}} onClick={goToPrevSlide}>
      Prev
    </button>
    <div style={{width: 'calc(100% - 120px)', marginLeft: '60px', }}>
      <img style={{width: '100%'}} src={images[currentIndex].src} alt="carousel" />
    </div>
    <button style={{...carouselBttnStyle, right: '0px'}} onClick={goToNextSlide}>
      Next
    </button>
  </div>
    { hide_caption ? null : 
    <div style={{lineHeight: '1.1em', textAlign: 'center', fontSize: '10px', color: 'black'}}>{caption}</div>
    }
  </>
);
};

