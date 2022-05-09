import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Lottie from "react-lottie";
import { loadingOpts, waitingOpts } from "../config/lottieConfig";

//Icons
import X_Icon from "../static/X_Icon.png";
import O_Icon from "../static/O_Icon.png";

//Actions
import { makeAMove, playAgain, joinNewGame } from "../actions/init";

//Styles
import {
  LoadingGameWrapper,
  LoadingGameText,
  TitleWrapper,
  TitleText,
  SubheadlineText,
  InformationText,
  InfoText,
  TurnWrapper,
  TableWrapper,
  Table,
  Tile,
  Column,
  Symbol,
  ButtonWrapper,
  SubmitButton,
  SubmitText,
  TwoButtonWrapper,
  ScoreDiv,
  ScoreText,
} from "../styles/GameStyles";

const Game = (props) => {
  const { game, player, type, stompClient, sock, connectingSocket } = props;

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

  const [score, setScore] = useState({
    yourWins: 0,
    opponentWins: 0,
  });

  const setInitialScore = (game) => {
    //Handle local score on loads
    let player1 = game.player1;
    let player2 = game.player2;

    if (player1 !== null && player2 !== null) {
      let gameId;
      if (type === "creator") {
        gameId = game.player2.playerId;
      } else {
        gameId = game.player1.playerId;
      }

      let score = JSON.parse(localStorage.getItem(gameId));
      if (!score) {
        localStorage.setItem(gameId, JSON.stringify([0, 0]));
        score = [0, 0];
      }

      let yourWins = score[0];
      let opponentWins = score[1];

      setScore({
        yourWins,
        opponentWins,
      });
    }
  };

  //Listens for state changes of game and re-renders board every time
  useEffect(() => {
    mapGameToBoard(game.board);
    setInitialScore(game);
  }, [game]);

  //For setting localStorage score after game is finished
  useEffect(() => {
    if (game.status === "finished") {
      let self;
      let opponent;
      let winnerNum = game.winner;
      let winner;
      if (winnerNum === 1) winner = game.player1.playerId;
      else winner = game.player2.playerId;

      if (type === "creator") {
        self = game.player1.playerId;
        opponent = game.player2.playerId;
      } else {
        self = game.player2.playerId;
        opponent = game.player1.playerId;
      }

      let score = JSON.parse(localStorage.getItem(opponent));

      let yourWins = score[0];
      let opponentWins = score[1];
      let newScore = [];

      if (winner === self) {
        yourWins += 1;
      } else {
        opponentWins += 1;
      }
      newScore = [yourWins, opponentWins];
      localStorage.setItem(opponent, JSON.stringify(newScore));

      setScore({
        yourWins,
        opponentWins,
      });
    }
  }, [game.winner]);

  //Disconnect sockjs connection upon page unload
  window.addEventListener("beforeunload", (event) => {
    // Cancel the event as stated by the standard.
    event.preventDefault();
    // Chrome requires returnValue to be set.
    event.returnValue = "";

    if (stompClient) stompClient.disconnect(); ///Disconnect from last game's socket connection

    sock.close(); //Not sure if needed
  });

  //Sets the game board every time a move is made
  const mapGameToBoard = (board) => {
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
  };

  //Function that handles making a move
  const handleMove = (id) => {
    let x, y;
    if (id === 0) {
      x = 0;
      y = 0;
    } else if (id === 1) {
      x = 0;
      y = 1;
    } else if (id === 2) {
      x = 0;
      y = 2;
    } else if (id === 3) {
      x = 1;
      y = 0;
    } else if (id === 4) {
      x = 1;
      y = 1;
    } else if (id === 5) {
      x = 1;
      y = 2;
    } else if (id === 6) {
      x = 2;
      y = 0;
    } else if (id === 7) {
      x = 2;
      y = 1;
    } else if (id === 8) {
      x = 2;
      y = 2;
    }
    let gameId = game.gameId;
    let playerId = player.playerId;
    props.makeAMove(x, y, playerId, gameId);
  };

  //Displays relevant X and O symbols on board based on game state
  const displaySymbol = (id) => {
    if (gameBoard[id] === 0) {
      return <div></div>;
    } else if (gameBoard[id] === 1) {
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
        {ScoreBoard()}
      </TableWrapper>
    );
  };

  //Exit button component
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

  //Rematch button logic
  const rematchButton = () => {
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
              props.joinNewGame(player, game.nextGame);
            }}
          >
            <SubmitText>Rematch!</SubmitText>
          </SubmitButton>
        </ButtonWrapper>
      );
    }

    return Button;
  };

  const displayBelowBoardText = () => {
    let totalTurns = game.totalTurns;

    if (!game.player2) {
      return (
        <TurnWrapper>
          <InformationText>Waiting for opponent to join game</InformationText>
          <Lottie options={waitingOpts} height={100} width={100} />
        </TurnWrapper>
      );
    } else if (game.winner) {
      return WinnerText();
    } else if (totalTurns > 8 && game.winner === null) {
      return (
        <TurnWrapper>
          <InfoText type="orange">Tie Game</InfoText>
          <TwoButtonWrapper>
            {exitButton}
            {rematchButton()}
          </TwoButtonWrapper>
        </TurnWrapper>
      );
    } else {
      return TurnText();
    }
  };

  const WinnerText = () => {
    let winner = game.winner;
    if (type === "creator") {
      if (winner === 1) {
        return (
          <TurnWrapper>
            <InfoText type="green">Congratulations! You won!</InfoText>
            <TwoButtonWrapper>
              {exitButton}
              {rematchButton()}
            </TwoButtonWrapper>
          </TurnWrapper>
        );
      } else {
        return (
          <TurnWrapper>
            <InfoText type="red">You lost. Better luck next time!</InfoText>
            <TwoButtonWrapper>
              {exitButton}
              {rematchButton()}
            </TwoButtonWrapper>
          </TurnWrapper>
        );
      }
    } else {
      if (winner === 2) {
        return (
          <TurnWrapper>
            <InfoText type="green">Congratulations! You won!</InfoText>
            <TwoButtonWrapper>
              {exitButton}
              {rematchButton()}
            </TwoButtonWrapper>
          </TurnWrapper>
        );
      } else {
        return (
          <TurnWrapper>
            <InfoText type="red">You lost. Better luck next time!</InfoText>
            <TwoButtonWrapper>
              {exitButton}
              {rematchButton()}
            </TwoButtonWrapper>
          </TurnWrapper>
        );
      }
    }
  };

  //Text that goes below board
  const TurnText = () => {
    if (type === "creator") {
      if (game.turn === 1) {
        return (
          <TurnWrapper>
            <InfoText type="green">{`It is your turn`}</InfoText>
          </TurnWrapper>
        );
      } else {
        let opponentName = game.player2.name;
        if (opponentName.length === 0) opponentName = "your opponent";
        return (
          <TurnWrapper>
            <InfoText type="red">{`It is ${opponentName}'s turn`}</InfoText>
          </TurnWrapper>
        );
      }
    } else {
      if (game.turn === 2) {
        return (
          <TurnWrapper>
            <InfoText type="green">{`It is your turn`}</InfoText>
          </TurnWrapper>
        );
      } else {
        let opponentName = game.player1.name;
        if (opponentName.length === 0) opponentName = "your opponent";
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
      if (type === "creator") {
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

      if (type === "creator") {
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

  const ScoreBoard = () => {
    if (game.player1 && game.player2) {
      let self;
      let opponent;
      let yourName;
      let opponentName;

      if (type === "creator") {
        self = game.player1;
        opponent = game.player2;
      } else {
        self = game.player2;
        opponent = game.player1;
      }

      yourName = self.name;
      opponentName = opponent.name;

      if (yourName === "") yourName = "You";
      if (opponentName === "") opponentName = "Opponent";

      const yourWins = score.yourWins;
      const opponentWins = score.opponentWins;

      return (
        <ScoreDiv>
          <ScoreText type="green">{`${yourName}: ${yourWins}`}</ScoreText>
          <ScoreText type="red">{`${opponentName}: ${opponentWins}`}</ScoreText>
        </ScoreDiv>
      );
    } else {
      return <div></div>;
    }
  };

  const handleView = () => {
    if (connectingSocket) {
      return (
        <LoadingGameWrapper>
          <Lottie options={loadingOpts} height={200} width={200} />
          <LoadingGameText>{`Connecting to game: ${game.gameId}`}</LoadingGameText>
        </LoadingGameWrapper>
      );
    } else {
      return TableComponent();
    }
  };

  return <Fragment>{handleView()}</Fragment>;
};

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
  makeAMove,
  playAgain,
  joinNewGame,
})(Game);
