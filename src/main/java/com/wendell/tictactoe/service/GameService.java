package com.wendell.tictactoe.service;


import com.wendell.tictactoe.model.Game;
import com.wendell.tictactoe.model.Player;
import com.wendell.tictactoe.repository.GameRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class GameService {


    private final GameRepository gameRepository; //For connecting to db

    @Autowired
    public GameService(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    /**
     * Method that creates a new game, a board, sets the id and player1, and saves game to database table 'game'
     * @param player the player who creates a new game
     * @return the newly created game
     */
    public Game createGame(Player player) {
        Game newGame = new Game(); //Create new instance of game
        newGame.setBoard(new int[3][3]); //Create new tictactoe board (3X3)
        newGame.setGameId(UUID.randomUUID().toString()); //Create new id (to be stored and shared)
        newGame.setPlayer1(player); //Set first player to creator
        newGame.setStatus("new"); //Set status to new game
        gameRepository.save(newGame); //Save game to DB
        return newGame;
    }

}
