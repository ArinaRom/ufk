import { useContext, useEffect } from 'react';
import { AuthContext } from '../../Context';

import axios from 'axios';

export const useToken = () => {
  const { token, setToken } = useContext(AuthContext);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const checkLogin = async () => {
        try {
          // axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          // await axios.get('http://localhost/api/user/auth');
          // setToken(storedToken)
        } catch (error) {
          axios.defaults.headers.common['Authorization'] = '';
          console.error('Ошибка при выполнении запроса:', error);
        }
      };

      checkLogin();
    }
  }, []);

  const addToken = (val) => {
    setToken(val);
		localStorage.setItem('token', JSON.stringify(val))
  };

  const removeToken = () => {
    setToken(null);
		localStorage.removeItem('token')
  };

  return { token, addToken, removeToken };
};
