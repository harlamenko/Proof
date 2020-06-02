import { useContext, useEffect } from 'react';
import { AuthContext } from '../context';

export default () => {
  const { tryLocalSignin, getLocalInfo } = useContext(AuthContext);

  useEffect(() => {
    getLocalInfo();
    tryLocalSignin();
  }, []);

  return null;
};
