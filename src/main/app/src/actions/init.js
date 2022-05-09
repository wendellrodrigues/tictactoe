import axios from "axios";
import { over } from "stompjs";
import * as SockJS from "sockjs-client";

import store from "../store";

//Implement some sort of alert system
import {
  CREATE_GAME_SUCCESS,
  CREATE_GAME_FAIL,
  JOIN_GAME_SUCCESS,
  JOIN_GAME_FAIL,
  CONNECT_SOCKET_SUCCESS,
  CONNECT_SOCKET_FAIL,
  CONNECTING_SOCKET,
  FINISHED_CONNECTING_SOCKET,
  MOVE_SUCCESS,
} from "./types";

//Create game action
export const createGame =
  ({ name }) =>
  async (dispatch) => {
    //Set CONNECTING socket to true
    dispatch({
      type: CONNECTING_SOCKET,
    });

    //Set Headers
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    //Set body
    const body = JSON.stringify({ name });

    //Make request
    try {
      const res = await axios.post(`/game/start`, body, config);
      await dispatch({
        type: CREATE_GAME_SUCCESS,
        payload: res.data, //Game
      });
    } catch (err) {
      dispatch({
        type: CREATE_GAME_FAIL,
      });
    }

    //ONWARDS FOR NEW SOCKET CONNECTION TRY
    let stompClient;
    let gameId = await store.getState().init.game.gameId;
    let playerId = await store.getState().init.player.playerId;

    localStorage.setItem("playerId", playerId);

    const onConnected = () => {
      dispatch({
        type: FINISHED_CONNECTING_SOCKET,
      });
      stompClient.subscribe(`/topic/game-progress/${gameId}`, onReceived);
    };

    //Function dispatches error to reducer
    const onError = () => {
      dispatch({
        type: CONNECT_SOCKET_FAIL,
      });
    };

    let Sock = new SockJS("/play");
    stompClient = over(Sock);
    stompClient.connect({ gameId }, onConnected, onError);

    //Function dispatches success with game payload and stomp client
    const onReceived = (payload) => {
      let data = JSON.parse(payload.body);
      dispatch({
        type: CONNECT_SOCKET_SUCCESS,
        payload: { data: data, stompClient: stompClient, sock: Sock }, //Game
      });
    };
  };

//Function for creating new game with local storage Id
export const createGameWithPlayerId = (id, name) => async (dispatch) => {
  //Set CONNECTING socket to true

  const player = {
    name: name,
    playerId: id,
  };

  //Set CONNECTING socket to true
  dispatch({
    type: CONNECTING_SOCKET,
  });

  //Set Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  //Set body
  const body = JSON.stringify(player);

  //Make request
  try {
    const res = await axios.post(`/game/startWithPlayerId`, body, config);
    await dispatch({
      type: CREATE_GAME_SUCCESS,
      payload: res.data, //Game
    });
  } catch (err) {
    dispatch({
      type: CREATE_GAME_FAIL,
    });
  }

  //ONWARDS FOR NEW SOCKET CONNECTION TRY
  let stompClient;
  let gameId = await store.getState().init.game.gameId;
  let playerId = await store.getState().init.player.playerId;

  localStorage.setItem("playerId", playerId);

  const onConnected = () => {
    dispatch({
      type: FINISHED_CONNECTING_SOCKET,
    });
    stompClient.subscribe(`/topic/game-progress/${gameId}`, onReceived);
  };

  //Function dispatches error to reducer
  const onError = () => {
    dispatch({
      type: CONNECT_SOCKET_FAIL,
    });
  };

  let Sock = new SockJS("/play");
  stompClient = over(Sock);
  stompClient.connect({ gameId }, onConnected, onError);

  //Function dispatches success with game payload and stomp client
  const onReceived = (payload) => {
    let data = JSON.parse(payload.body);
    dispatch({
      type: CONNECT_SOCKET_SUCCESS,
      payload: { data: data, stompClient: stompClient, sock: Sock }, //Game
    });
  };
};

//Function for creating new game after end of game
export const playAgain = (player, oldGame, stompClient) => async (dispatch) => {
  //Set CONNECTING socket to true
  dispatch({
    type: CONNECTING_SOCKET,
  });

  //Set Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  //Set body
  const body = JSON.stringify({
    player,
    oldGame,
  });

  //Make request
  try {
    const res = await axios.post(`/game/playAgain`, body, config);
    dispatch({
      type: CREATE_GAME_SUCCESS,
      payload: res.data, //Game
    });
  } catch (err) {
    dispatch({
      type: CREATE_GAME_FAIL,
    });
  }

  //ONWARDS FOR NEW STOMP CLIENT CONNECTION HERE (CAN DELETE IF NOT GOOD)
  let stompClient;
  let gameId = await store.getState().init.game.gameId;

  const onConnected = () => {
    dispatch({
      type: FINISHED_CONNECTING_SOCKET,
    });
    stompClient.subscribe(`/topic/game-progress/${gameId}`, onReceived);
  };

  //Function dispatches error to reducer
  const onError = () => {
    dispatch({
      type: CONNECT_SOCKET_FAIL,
    });
  };

  let Sock = new SockJS("/play");
  stompClient = over(Sock);
  stompClient.connect({}, onConnected, onError);

  //Function dispatches success with game payload and stomp client
  const onReceived = (payload) => {
    let data = JSON.parse(payload.body);
    dispatch({
      type: CONNECT_SOCKET_SUCCESS,
      payload: { data: data, stompClient: stompClient, sock: Sock }, //Game
    });
  };
};

//Join game action
export const joinGame =
  ({ name, code }) =>
  async (dispatch) => {
    //Set Headers
    dispatch({
      type: CONNECTING_SOCKET,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = `
    {
      "player": {
        "name": "${name}"
      },
      "gameId": "${code}"
    }
    `;

    //Make request
    try {
      const res = await axios.post(`/game/connect`, body, config);
      dispatch({
        type: JOIN_GAME_SUCCESS,
        payload: res.data, //Game
      });
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
      }
      dispatch({
        type: JOIN_GAME_FAIL,
      });
    }

    //ONWARDS FOR NEW STOMP CLIENT CONNECTION HERE (CAN DELETE IF NOT GOOD)
    let stompClient;
    let gameId = await store.getState().init.game.gameId;
    let playerId = await store.getState().init.player.playerId;

    //Save playerId to local storage
    localStorage.setItem("playerId", playerId);

    const onConnected = () => {
      dispatch({
        type: FINISHED_CONNECTING_SOCKET,
      });
      stompClient.subscribe(`/topic/game-progress/${gameId}`, onReceived);
    };

    //Function dispatches error to reducer
    const onError = () => {
      dispatch({
        type: CONNECT_SOCKET_FAIL,
      });
    };

    let Sock = new SockJS("/play");
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);

    //Function dispatches success with game payload and stomp client
    const onReceived = (payload) => {
      let data = JSON.parse(payload.body);
      dispatch({
        type: CONNECT_SOCKET_SUCCESS,
        payload: { data: data, stompClient: stompClient, sock: Sock }, //Game
      });
    };
  };

//Function for joining new game (with local storage token)
export const joinWithPlayerId = (player, code) => async (dispatch) => {
  //Set Headers
  dispatch({
    type: CONNECTING_SOCKET,
  });

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = `
    {
      "player": {
        "name": "${player.name}",
        "playerId": "${player.playerId}"
      },
      "gameId": "${code}"
    }
    `;

  //Make request
  try {
    const res = await axios.post(`/game/connectWithPlayerId`, body, config);
    dispatch({
      type: JOIN_GAME_SUCCESS,
      payload: res.data, //Game
    });
  } catch (err) {
    dispatch({
      type: JOIN_GAME_FAIL,
    });
  }

  //ONWARDS FOR NEW STOMP CLIENT CONNECTION HERE (CAN DELETE IF NOT GOOD)
  let stompClient;
  let gameId = await store.getState().init.game.gameId;

  const onConnected = () => {
    dispatch({
      type: FINISHED_CONNECTING_SOCKET,
    });
    stompClient.subscribe(`/topic/game-progress/${gameId}`, onReceived);
  };

  //Function dispatches error to reducer
  const onError = () => {
    dispatch({
      type: CONNECT_SOCKET_FAIL,
    });
  };

  let Sock = new SockJS("/play");
  stompClient = over(Sock);
  stompClient.connect({}, onConnected, onError);

  //Function dispatches success with game payload and stomp client
  const onReceived = (payload) => {
    let data = JSON.parse(payload.body);
    dispatch({
      type: CONNECT_SOCKET_SUCCESS,
      payload: { data: data, stompClient: stompClient, sock: Sock }, //Game
    });
  };
};

//Function for joining new game (chain from old game)
export const joinNewGame = (player, code) => async (dispatch) => {
  //Set Headers
  dispatch({
    type: CONNECTING_SOCKET,
  });

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = `
    {
      "player": {
        "name": "${player.name}",
        "playerId": "${player.playerId}"
      },
      "gameId": "${code}"
    }
    `;

  //Make request
  try {
    const res = await axios.post(`/game/connectWithId`, body, config);
    dispatch({
      type: JOIN_GAME_SUCCESS,
      payload: res.data, //Game
    });
  } catch (err) {
    dispatch({
      type: JOIN_GAME_FAIL,
    });
  }

  //ONWARDS FOR NEW STOMP CLIENT CONNECTION HERE (CAN DELETE IF NOT GOOD)
  let stompClient;
  let gameId = await store.getState().init.game.gameId;

  const onConnected = () => {
    dispatch({
      type: FINISHED_CONNECTING_SOCKET,
    });
    stompClient.subscribe(`/topic/game-progress/${gameId}`, onReceived);
  };

  //Function dispatches error to reducer
  const onError = () => {
    dispatch({
      type: CONNECT_SOCKET_FAIL,
    });
  };

  let Sock = new SockJS("/play");
  stompClient = over(Sock);
  stompClient.connect({}, onConnected, onError);

  //Function dispatches success with game payload and stomp client
  const onReceived = (payload) => {
    let data = JSON.parse(payload.body);
    dispatch({
      type: CONNECT_SOCKET_SUCCESS,
      payload: { data: data, stompClient: stompClient, sock: Sock }, //Game
    });
  };
};

//Makes a move on the board
export const makeAMove = (x, y, playerId, gameId) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = `
    {
      "player": {
        "playerId": "${playerId}"
      },
      "coordinateX" :"${x}",
      "coordinateY" : "${y}",
      "gameId" : "${gameId}"
    }
  `;

  //Make request
  try {
    const res = await axios.post(`/game/play`, body, config);
    dispatch({
      type: MOVE_SUCCESS,
      payload: res.data, //Game
    });
  } catch (err) {}
};
