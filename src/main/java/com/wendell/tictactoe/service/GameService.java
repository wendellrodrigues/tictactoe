package com.wendell.tictactoe.service;

import com.wendell.tictactoe.exception.InvalidGameException;
import com.wendell.tictactoe.model.Game;
import com.wendell.tictactoe.model.Play;
import com.wendell.tictactoe.model.Player;
import com.wendell.tictactoe.repository.GameRepository;
import com.wendell.tictactoe.repository.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class GameService {

    private final GameRepository gameRepository; //For connecting to db
    private final PlayerRepository playerRepository;

    @Autowired
    public GameService(GameRepository gameRepository, PlayerRepository playerRepository) {
        this.gameRepository = gameRepository;
        this.playerRepository = playerRepository;
    }

    /**
     * Method that creates a new game, a board, sets the id and player1, and saves game to database table 'game'
     * @param player the name of the player who creates a new game
     * @return the newly created game
     */
    public Game createGame(Player player) {
        Game newGame = new Game(); //Create new instance of game
        player.setPlayerId(UUID.randomUUID().toString());
        newGame.setBoard(new int[3][3]); //Create new tictactoe board (3X3)
        newGame.setGameId(UUID.randomUUID().toString()); //Create new id (to be stored and shared)
        newGame.setTotalTurns(0);
        playerRepository.save(player); //Save player to db player table
        newGame.setPlayer1(player); //Set first player to creator
        newGame.setStatus("new"); //Set status to new game
        gameRepository.save(newGame); //Save game to db game table
        return newGame;
    }

    public Game playAgain(Player player, Game oldGame) {
        Game newGame = createGame(player);  //Create a new game
        String newGameId = newGame.getGameId(); //Get the new game id
        oldGame.setNextGame(newGameId); //Set the next game property of old game id to new
        gameRepository.save(oldGame);
        gameRepository.save(newGame);
        return newGame;
    }

    /**
     * Method that allows for a second player to join the game
     * @param player2 A player that joins the game (string)
     * @param gameId
     * @return game
     * @throws InvalidGameException
     */
    public Game connectToGame(Player player2, String gameId) throws InvalidGameException {

        //Check if game exists
        if(!gameRepository.checkExistGame(gameId).isPresent()) {
            throw new InvalidGameException("Game does not exist");
        }

        //Get game
        Game game = gameRepository.getGame(gameId);

        //Change status to in progress
        game.setStatus("in-progress");

        //Check if game is full (naturally handles games that are finished as well)
        if(game.getPlayer2() != null) {
            throw new InvalidGameException("Game is not available");
        }

        //Save player2
        player2.setPlayerId(UUID.randomUUID().toString());
        playerRepository.save(player2);
        game.setPlayer2(player2);
        game.setTurn(2);
        gameRepository.save(game);

        return game;
    }


    /**
     * Allows for a player to make a move on the tic tac toe board
     *
     * @param move consists of
     *             Integer playerType
     *             Integer coordinateX
     *             Integer coordinateY
     *             String  gameId
     * @return game
     * @throws InvalidGameException
     */
    public Game play(Play move) throws InvalidGameException {
        //Check if game exists
        if(!gameRepository.checkExistGame(move.getGameId()).isPresent()) {
            throw new InvalidGameException("Game does not exist");
        }

        Game game = gameRepository.getGame(move.getGameId());

        if(game.getStatus().equals("finished")) {
            throw new InvalidGameException("Game is already over");
        }
        if(game.getStatus().equals("new")) {
            throw new InvalidGameException("Please wait for player 2 to join the game");
        }

        String playerId = move.getPlayer().getPlayerId();

        Integer type;
        if(game.getPlayer1().getPlayerId().equals(playerId)) {
            type = 1;
        } else if(game.getPlayer2().getPlayerId().equals(playerId)) {
            type = 2;
        } else {
            throw new InvalidGameException("You are not authorized to play this game");
        }

        Integer turn = game.getTurn();
        if(turn != type) {
            throw new InvalidGameException("Please wait for your turn");
        }

        int [][] board = game.getBoard();

        int xCoordinate = move.getCoordinateX();
        int yCoordinate = move.getCoordinateY();

        //Check if move has already been made
        if(board[xCoordinate][yCoordinate] != 0) {
            throw new InvalidGameException("You cannot make this move");
        }

        //Set board to the player type (1 or 2)
        board[xCoordinate][yCoordinate] = type;

        //See if X or O won
        Boolean xWinner = checkWinner(game.getBoard(), 1);
        Boolean oWinner = checkWinner(game.getBoard(), 2);

        if(xWinner) {
            game.setWinner(1); //Change to player in Model
            game.setStatus("finished");
        } else if(oWinner) {
            game.setWinner(2); //Change to player in Model
            game.setStatus("finished");
        }

        //Switch turn
        if(type == 2) {
            game.setTurn(1);
        } else {
            game.setTurn(2);
        }

        //Set total turns
        int totalTurns = game.getTotalTurns();
        game.setTotalTurns(totalTurns + 1);

        //Update the game (optional)
        gameRepository.save(game);

        return game;
    }

    /**
     * Checks to see if a player type (1 or 2) is a winner
     * @param board int [][] board
     * @param type Player type (1 or 2)
     * @return boolean if won or not won
     */
    private Boolean checkWinner(int[][] board, Integer type) {
        //Create 1d array
        int [] boardArray = new int[9];
        int count = 0;
        //Flatten 2d array to 1d array
        for(int i=0; i<board.length; i++) {
            for(int j=0; j<board[i].length; j++) {
                boardArray[count] = board[i][j];
                count++;
            }
        }

        int [][] winCombinations = {{0,1,2}, {3,4,5}, {6,7,8}, {0,3,6}, {1,4,7}, {2,5,8}, {0,4,8}, {2,4,6}};

        for(int i=0; i<winCombinations.length; i++) {
            int counter = 0;
            for(int j=0; j<winCombinations[i].length; j++) {
                if(boardArray[winCombinations[i][j]] == type) {
                    counter++;
                    if(counter == 3) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

}
