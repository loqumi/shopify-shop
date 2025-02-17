import {useEffect, useState} from 'react';

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    setIsVisible(currentScrollY > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-20 right-20 w-[35px] h-[35px] flex justify-center items-center rounded-full !bg-main-green text-white transition-opacity ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{transition: 'opacity 0.3s'}}
      aria-label="Scroll to top"
    >
      <img src={'/arrow-up.svg'} alt={'arrow-up'} />
    </button>
  );
}

export default ScrollToTopButton;
