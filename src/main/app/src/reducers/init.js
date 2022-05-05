import {
  CREATE_GAME_SUCCESS,
  CREATE_GAME_FAIL,
  JOIN_GAME_SUCCESS,
  JOIN_GAME_FAIL,
  CONNECT_SOCKET_SUCCESS,
  CONNECT_SOCKET_FAIL,
} from "../actions/types";

const initialState = {
  game: null,
  player: null,
  stompClient: null,
};

export default function init(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case CREATE_GAME_SUCCESS:
      return {
        ...state,
        game: payload,
        player: payload.player1.playerId,
      };
    case CREATE_GAME_SUCCESS:
      return {
        ...state,
        game: payload,
        player: payload.player1.playerId,
      };
    case CREATE_GAME_FAIL:
    case JOIN_GAME_FAIL:
      return {
        ...state,
        game: null,
        player: null,
      };
    case CONNECT_SOCKET_SUCCESS:
      return {
        ...state,
        game: payload.data,
        stompClient: payload.stompClient,
      };
    case CONNECT_SOCKET_FAIL:
      return {
        ...state,
        stompClient: null,
      };
    default:
      return state;
  }
}
