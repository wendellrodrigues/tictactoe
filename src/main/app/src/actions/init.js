import axios from "axios";
import { over } from "stompjs";
import * as SockJS from "sockjs-client";

//Implement some sort of alert system
import {
  CREATE_GAME_SUCCESS,
  CREATE_GAME_FAIL,
  JOIN_GAME_SUCCESS,
  JOIN_GAME_FAIL,
  CONNECT_SOCKET_SUCCESS,
  CONNECT_SOCKET_FAIL,
} from "./types";

//Create game action
export const createGame =
  ({ name }) =>
  async (dispatch) => {
    console.log("creating game");
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
      dispatch({
        type: CREATE_GAME_SUCCESS,
        payload: res.data, //Game
      });
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        console.log(errors);
      }
      dispatch({
        type: CREATE_GAME_FAIL,
      });
    }
  };

//Create socket connection action
export const createSocketConnection =
  (gameId, stompClient) => async (dispatch) => {
    //Helper function for when connected
    const onConnected = () => {
      stompClient.subscribe(`/topic/game-progress/${gameId}`, onReceived);
    };

    //Function dispatches error to reducer
    const onError = () => {
      console.log(onError);
      dispatch({
        type: CONNECT_SOCKET_FAIL,
      });
    };

    let Sock = new SockJS("/play");
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);

    //Function dispatches success with game payload and stomp client
    const onReceived = (payload) => {
      console.log("received");
      let data = JSON.parse(payload.body);
      console.log(data);
      dispatch({
        type: CONNECT_SOCKET_SUCCESS,
        payload: { data: data, stompClient: stompClient }, //Game
      });
    };
  };
