import { useState, useEffect } from 'react';

export const useScrollToFetch = () => {
  const [isNeedFetching, setIsNeedFetching] = useState<boolean>(false);

  useEffect(() => {
    const scrolledComponent = document.documentElement;

    const handleScroll = () => {
      const isBottom = scrolledComponent.scrollHeight - scrolledComponent.scrollTop <= scrolledComponent.clientHeight;

      if (isBottom && !isNeedFetching) setIsNeedFetching(true);
    };

    scrolledComponent.addEventListener('scroll', handleScroll);
    scrolledComponent.addEventListener('mousewheel', handleScroll);

    return () => {
      scrolledComponent.removeEventListener('scroll', handleScroll);
      scrolledComponent.removeEventListener('mousewheel', handleScroll);
    };
  });

  return [isNeedFetching, setIsNeedFetching] as const;
};

export default useScrollToFetch;
