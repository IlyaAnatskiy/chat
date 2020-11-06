import axios from 'axios';
import React from 'react';
import Chat from './components/Chat';

import JoinForm from './components/JoinForm';
import reducer from './reducer';
import socket from './socket';

function App() {
  const [state, dispatch] = React.useReducer(reducer, {
    userName: null,
    roomId: null,
    joined: false,
    users: [],
    messages: [],
  });

  const onLogin = async (obj) => {
    dispatch({
      type: 'JOINED',
      payload: obj,
    });
    socket.emit('ROOM:JOIN', obj);
    const { data } = await axios.get(`/rooms/${obj.roomId}`);
    console.log(data);
    dispatch({
      type: 'SET_DATA',
      payload: data,
    });
  };

  const setUsers = (users) => {
    dispatch({
      type: 'SET_USERS',
      payload: users,
    });
  };

  const addMessage = (message) => {
    console.log(message);
    dispatch({
      type: 'NEW_MESSAGE',
      payload: message,
    });
  };

  React.useEffect(() => {
    socket.on('ROOM:SET:USERS', setUsers);
    socket.on('ROOM:NEW_MESSAGE', addMessage);
  }, []);
  console.log(state);
  return (
    <div className="wrapper">
      {!state.joined ? <JoinForm onLogin={onLogin} /> : <Chat {...state} addMessage={addMessage} />}
    </div>
  );
}

export default App;
