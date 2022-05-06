import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
//import { Navigate } from "react-router-dom";
import styled from "styled-components";
import StartForm from "./forms/StartForm";
import PropTypes from "prop-types";

//Different stomp clients (test)
//import SockJsClient from "react-stomp";
import { Stomp } from "@stomp/stompjs";
import { over } from "stompjs";
import * as SockJS from "sockjs-client";

//Icons
import X_Icon from "../static/X_Icon.png";
import O_Icon from "../static/O_Icon.png";

//Actions
import { createSocketConnection, makeAMove } from "../actions/init";

const Game = (props) => {
  const { game, player, stompClient, connectingSocket } = props;

  const [gameBoard, setGameBoard] = useState({
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
  });

  //Called at load. Create socket connection
  useEffect(() => {
    props.createSocketConnection(game.gameId, stompClient);
  }, []);

  //Listens for state changes of game and re-renders board every time
  useEffect(() => {
    mapGameToBoard(game.board);
  }, [game]);

  //Sets the game board every time a move is made
  const mapGameToBoard = (board) => {
    console.log("mapping game to board");
    setGameBoard({
      0: board[0][0],
      1: board[0][1],
      2: board[0][2],
      3: board[1][0],
      4: board[1][1],
      5: board[1][2],
      6: board[2][0],
      7: board[2][1],
      8: board[2][2],
    });
    console.log(gameBoard);
  };

  const handleMove = (id) => {
    console.log("handling move");
    let x, y;
    if (id == 0) {
      x = 0;
      y = 0;
    } else if (id == 1) {
      x = 0;
      y = 1;
    } else if (id == 2) {
      x = 0;
      y = 2;
    } else if (id == 3) {
      x = 1;
      y = 0;
    } else if (id == 4) {
      x = 1;
      y = 1;
    } else if (id == 5) {
      x = 1;
      y = 2;
    } else if (id == 6) {
      x = 2;
      y = 0;
    } else if (id == 7) {
      x = 2;
      y = 1;
    } else if (id == 8) {
      x = 2;
      y = 2;
    }
    let gameId = game.gameId;
    let playerId = player;
    props.makeAMove(x, y, playerId, gameId);
  };

  //Displays relevant X and O symbols on board based on game state
  const displaySymbol = (id) => {
    if (gameBoard[id] == 0) {
      return <div></div>;
    } else if (gameBoard[id] == 1) {
      return <Symbol src={X_Icon} />;
    } else {
      return <Symbol src={O_Icon} />;
    }
  };

  const TableComponent = () => {
    return (
      <Table>
        <Column>
          <Tile onClick={() => handleMove(0)}>{displaySymbol(0)}</Tile>
          <Tile onClick={() => handleMove(1)}>{displaySymbol(1)}</Tile>
          <Tile onClick={() => handleMove(2)}>{displaySymbol(2)}</Tile>
        </Column>
        <Column>
          <Tile onClick={() => handleMove(3)}>{displaySymbol(3)}</Tile>
          <Tile onClick={() => handleMove(4)}>{displaySymbol(4)}</Tile>
          <Tile onClick={() => handleMove(5)}>{displaySymbol(5)}</Tile>
        </Column>
        <Column>
          <Tile onClick={() => handleMove(6)}>{displaySymbol(6)}</Tile>
          <Tile onClick={() => handleMove(7)}>{displaySymbol(7)}</Tile>
          <Tile onClick={() => handleMove(8)}>{displaySymbol(8)}</Tile>
        </Column>
      </Table>
    );
  };

  const handleView = () => {
    if (connectingSocket) {
      return <div></div>;
    } else {
      return TableComponent();
    }
  };

  return <Fragment>{handleView()}</Fragment>;
};

const Table = styled.div`
  display: grid;
  grid-template-columns: auto auto auto;
`;
const Column = styled.div``;
const Tile = styled.div`
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
  margin-left: 10px;
  background: #dedede;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  transition: 0.5s ease-in;

  :hover {
    transition: 0.5s ease-in;
    background: #b0b0b0;
    cursor: pointer;
  }
`;

const Symbol = styled.img`
  margin: auto;
`;

Game.propTypes = {
  createSocketConnection: PropTypes.func.isRequired,
  makeAMove: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  game: state.init.game,
  player: state.init.player,
  stompClient: state.init.stompClient,
  connectingSocket: state.init.connectingSocket,
});

export default connect(mapStateToProps, { createSocketConnection, makeAMove })(
  Game
);
