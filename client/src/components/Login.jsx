import React, { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const { login, backend } = useContext(AuthContext);
  const [mode, setMode] = useState('login');
  const [name,email,password] = ['','','']; // wire up inputs…

  const submit = async e => {
    e.preventDefault();
    try {
      const url = `${backend}/api/user/${mode}`;
      const { data } = await axios.post(url, { name,email,password });
      if (data.success) {
        login(data.token,data.user);
        toast.success('Welcome!');
      } else toast.error(data.message);
    } catch(e) {
      toast.error(e.message);
    }
  };

  return (
    <form onSubmit={submit}>
      {/* your inputs + toggle between “login” / “register” */}
      <button type="submit">{mode}</button>
    </form>
  );
}
