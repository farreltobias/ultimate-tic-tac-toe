import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

const useDimentions = (type: 'width' | 'height') => {
  const [dimention, setDimentions] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setDimentions(Dimensions.get('window')[type]);
    };

    handleResize();

    Dimensions.addEventListener('change', handleResize);
    return () => Dimensions.removeEventListener('change', handleResize);
  }, []);

  return [dimention, setDimentions];
};

export default useDimentions;
