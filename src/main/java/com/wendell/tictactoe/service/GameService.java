package com.wendell.tictactoe.service;

import com.wendell.tictactoe.exception.InvalidGameException;
import com.wendell.tictactoe.model.Game;
import com.wendell.tictactoe.model.Player;
import com.wendell.tictactoe.repository.GameRepository;
import com.wendell.tictactoe.repository.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
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
        playerRepository.save(player); //Save player to db player table
        newGame.setPlayer1(player); //Set first player to creator
        newGame.setStatus("new"); //Set status to new game
        gameRepository.save(newGame); //Save game to db game table
        return newGame;
    }

    public Game connectToGame(Player player2, String gameId) throws InvalidGameException {

        //Check if game exists
        if(!gameRepository.checkExistGame(gameId).isPresent()) {
            throw new InvalidGameException("Game does not exist");
        }

        //Get game
        Game game = gameRepository.getGame(gameId);

        //Check if game is full (naturally handles games that are already over as well)
        if(game.getPlayer2() != null) {
            throw new InvalidGameException("Game is not available");
        }

        //Save player2
        player2.setPlayerId(UUID.randomUUID().toString());
        playerRepository.save(player2);
        game.setPlayer2(player2);
        gameRepository.save(game);

        return game;
    }

}
