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
} from "../actions/types";

const initialState = {
  game: null,
  player: null,
  stompClient: null,
  connectingSocket: false,
  name: null,
  opponentName: null,
  type: null, //Creator or joiner
};

export default function init(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case CREATE_GAME_SUCCESS:
      return {
        ...state,
        game: payload,
        player: payload.player1.playerId,
        type: "creator",
        name: payload.player1.name,
      };
    case JOIN_GAME_SUCCESS:
      return {
        ...state,
        game: payload,
        player: payload.player2.playerId,
        type: "joiner",
        name: payload.player2.name,
      };
    case CREATE_GAME_FAIL:
    case JOIN_GAME_FAIL:
      return {
        ...state,
        player: null,
      };
    case CONNECT_SOCKET_SUCCESS:
      return {
        ...state,
        game: payload.data,
        stompClient: payload.stompClient,
        connectingSocket: false,
      };
    case CONNECT_SOCKET_FAIL:
      return {
        ...state,
        stompClient: null,
        connectingSocket: false,
      };
    case CONNECTING_SOCKET:
      return {
        ...state,
        connectingSocket: true,
      };
    case FINISHED_CONNECTING_SOCKET:
      return {
        ...state,
        connectingSocket: false,
      };
    case MOVE_SUCCESS:
      return {
        ...state,
        game: payload,
      };
    default:
      return state;
  }
}
