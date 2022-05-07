import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
//import { Navigate } from "react-router-dom";
import styled from "styled-components";
import StartForm from "./forms/StartForm";
import PropTypes from "prop-types";
import Lottie from "react-lottie";

//Icons
import X_Icon from "../static/X_Icon.png";
import O_Icon from "../static/O_Icon.png";

//Lottie animations
import loadingSpinner from "../static/loading.json";
import waitingDots from "../static/waiting.json";

//Actions
import {
  createSocketConnection,
  makeAMove,
  playAgain,
  joinNewGame,
} from "../actions/init";

const Game = (props) => {
  const {
    game,
    player,
    type,
    opponentName,
    stompClient,
    sock,
    connectingSocket,
  } = props;

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

  //Lottie config
  const loadingOpts = {
    loop: true,
    autoplay: true,
    animationData: loadingSpinner,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  //Lottie config
  const waitingOpts = {
    loop: true,
    autoplay: true,
    animationData: waitingDots,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  //Listens for state changes of game and re-renders board every time
  useEffect(() => {
    mapGameToBoard(game.board);
  }, [game]);

  window.addEventListener("beforeunload", (event) => {
    // Cancel the event as stated by the standard.
    event.preventDefault();
    // Chrome requires returnValue to be set.
    event.returnValue = "";

    stompClient.disconnect(); ///Disconnect from last game's socket connection
    sock.close(); //Not sure if needed
  });

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
    let playerId = player.playerId;
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
      <TableWrapper>
        {HeadText()}
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
        {displayBelowBoardText()}
      </TableWrapper>
    );
  };

  const displayBelowBoardText = () => {
    if (!game.player2) {
      return (
        <TurnWrapper>
          <InformationText>Waiting for opponent to join game</InformationText>
          <Lottie options={waitingOpts} height={100} width={100} />
        </TurnWrapper>
      );
    } else if (game.winner) {
      return WinnerText();
    } else {
      return TurnText();
    }
  };

  const WinnerText = () => {
    let Button;

    //Checks to see if one of the players started a rematch.
    //Button logic either creates a new game or joins already created game
    if (!game.nextGame) {
      Button = (
        <ButtonWrapper>
          <SubmitButton
            onClick={() => {
              stompClient.disconnect(); ///Disconnect from last game's socket connection
              sock.close(); //Not sure if needed
              props.playAgain(player, game, stompClient);
            }}
          >
            <SubmitText>Rematch!</SubmitText>
          </SubmitButton>
        </ButtonWrapper>
      );
    } else {
      Button = (
        <ButtonWrapper>
          <SubmitButton
            onClick={() => {
              stompClient.disconnect(); ///Disconnect from last game's socket connection
              sock.close(); //Not sure if needed
              props.joinNewGame(game.nextGame);
            }}
          >
            <SubmitText>Rematch!</SubmitText>
          </SubmitButton>
        </ButtonWrapper>
      );
    }

    const exitButton = (
      <ButtonWrapper>
        <SubmitButton
          onClick={() => {
            stompClient.disconnect(); ///Disconnect from last game's socket connection
            sock.close(); //Not sure if needed
            window.location.reload();
          }}
        >
          <SubmitText>Exit</SubmitText>
        </SubmitButton>
      </ButtonWrapper>
    );

    let winner = game.winner;
    if (type == "creator") {
      if (winner == 1) {
        return (
          <TurnWrapper>
            <InfoText type="green">Congratulations! You won!</InfoText>
            <TwoButtonWrapper>
              {exitButton}
              {Button}
            </TwoButtonWrapper>
          </TurnWrapper>
        );
      } else {
        return (
          <TurnWrapper>
            <InfoText type="red">You lost. Better luck next time!</InfoText>
            <TwoButtonWrapper>
              {exitButton}
              {Button}
            </TwoButtonWrapper>
          </TurnWrapper>
        );
      }
    } else {
      if (winner == 2) {
        return (
          <TurnWrapper>
            <InfoText type="green">Congratulations! You won!</InfoText>
            <TwoButtonWrapper>
              {exitButton}
              {Button}
            </TwoButtonWrapper>
          </TurnWrapper>
        );
      } else {
        return (
          <TurnWrapper>
            <InfoText type="red">You lost. Better luck next time!</InfoText>
            <TwoButtonWrapper>
              {exitButton}
              {Button}
            </TwoButtonWrapper>
          </TurnWrapper>
        );
      }
    }
  };

  //Text that goes below board
  const TurnText = () => {
    let turn = game.turn;

    if (type == "creator") {
      if (game.turn == 1) {
        return (
          <TurnWrapper>
            <InfoText type="green">{`It is your turn`}</InfoText>
          </TurnWrapper>
        );
      } else {
        let opponentName = game.player2.name;
        if (opponentName.length == 0) opponentName = "your opponent";
        return (
          <TurnWrapper>
            <InfoText type="red">{`It is ${opponentName}'s turn`}</InfoText>
          </TurnWrapper>
        );
      }
    } else {
      if (game.turn == 2) {
        return (
          <TurnWrapper>
            <InfoText type="green">{`It is your turn`}</InfoText>
          </TurnWrapper>
        );
      } else {
        let opponentName = game.player1.name;
        if (opponentName.length == 0) opponentName = "your opponent";
        return (
          <TurnWrapper>
            <InfoText type="red">{`It is ${opponentName}'s turn`}</InfoText>
          </TurnWrapper>
        );
      }
    }
  };

  const HeadText = () => {
    let creatorName = game.player1.name;
    let titleText = "";

    //Handle title possibilities
    if (creatorName.length > 0) {
      titleText = `${creatorName}'s game`;
    } else {
      if (type == "creator") {
        titleText = "Your game";
      } else {
        titleText = "Opponent's game";
      }
    }

    let subHeadline;

    if (!game.player2) {
      subHeadline = (
        <SubheadlineText>{`Share this game: ${game.gameId}`}</SubheadlineText>
      );
    } else {
      let opponentName;

      if (type == "creator") {
        opponentName = game.player2.name;
      } else {
        opponentName = game.player1.name;
      }
      if (opponentName.length > 0) {
        subHeadline = (
          <SubheadlineText>{`Playing against ${opponentName}`}</SubheadlineText>
        );
      } else {
        subHeadline = (
          <SubheadlineText>{`Playing against opponent`}</SubheadlineText>
        );
      }
    }

    return (
      <TitleWrapper>
        <TitleText>{titleText}</TitleText>
        {subHeadline}
      </TitleWrapper>
    );
  };

  const handleView = () => {
    if (connectingSocket) {
      return (
        <LoadingGameWrapper>
          <Lottie options={loadingOpts} height={400} width={400} />
          <LoadingGameText>{`Connecting to game: ${game.gameId}`}</LoadingGameText>
        </LoadingGameWrapper>
      );
    } else {
      return TableComponent();
    }
  };

  return <Fragment>{handleView()}</Fragment>;
};

const LoadingGameWrapper = styled.div`
  display: grid;
  gap: 10px;
  justify-items: center;
`;

const LoadingGameText = styled.p`
  font-size: 30px;
  font-weight: bold;
  line-height: normal;
`;

const TitleWrapper = styled(LoadingGameWrapper)`
  margin-bottom: 90px;
`;

const TitleText = styled.p`
  font-size: 30px;
  font-weight: bold;
  line-height: normal;
`;

const SubheadlineText = styled.p`
  font-size: 18px;
  font-weight: bold;
  line-height: normal;
`;

const InformationText = styled.p`
  font-size: 15px;
  font-weight: bold;
  line-height: normal;
`;

const InfoText = styled.p`
  font-size: 15px;
  font-weight: bold;
  line-height: normal;
  color: ${(props) => (props.type == "green" ? "green" : "red")};
`;

const TurnWrapper = styled.div`
  display: grid;
  gap: -20px;
  justify-items: center;
`;

const TableWrapper = styled.div``;

const Table = styled.div`
  display: grid;
  justify-content: center;
  grid-template-columns: auto auto auto;
  margin-bottom: 20px;
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

const ButtonWrapper = styled.div`
  margin-top: 20px;
  justify-content: center;
  width: 100px;
`;

const SubmitButton = styled.div`
  display: grid;
  margin: auto;
  height: 45px;
  background: #171717;
  border-radius: 10px;
  justify-items: center;
  align-items: center;
  transition: 0.2s ease-in;
  box-shadow: 0px 0px 5px #bababa;
  :hover {
    background: #1c1c1c;
    cursor: pointer;
  }
`;

export const SubmitText = styled.p`
  color: white;
  font-size: 17px;
  font-weight: bold;
  line-height: normal;
`;

export const TwoButtonWrapper = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  gap: 20px;
`;

Game.propTypes = {
  createSocketConnection: PropTypes.func.isRequired,
  makeAMove: PropTypes.func.isRequired,
  playAgain: PropTypes.func.isRequired,
  joinNewGame: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  game: state.init.game,
  player: state.init.player,
  type: state.init.type,
  opponentName: state.init.opponentName,
  stompClient: state.init.stompClient,
  sock: state.init.sock,
  connectingSocket: state.init.connectingSocket,
});

export default connect(mapStateToProps, {
  createSocketConnection,
  makeAMove,
  playAgain,
  joinNewGame,
})(Game);
