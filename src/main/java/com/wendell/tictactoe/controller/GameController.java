package com.wendell.tictactoe.controller;


import com.wendell.tictactoe.controller.dao.ConnectionRequest;
import com.wendell.tictactoe.exception.InvalidGameException;
import com.wendell.tictactoe.model.Game;
import com.wendell.tictactoe.model.Play;
import com.wendell.tictactoe.model.PlayAgainGame;
import com.wendell.tictactoe.model.Player;
import com.wendell.tictactoe.service.GameService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;


@CrossOrigin
@RestController
@Slf4j
@AllArgsConstructor
@RequestMapping("/game")
public class GameController {

    private final GameService gameService;
    @Autowired
    private final SimpMessagingTemplate simpMessagingTemplate;

    @PostMapping("/start")
    public ResponseEntity<Game> start(@RequestBody Player player) {
        //log.info("start game request: {}", player);
        Game game = gameService.createGame(player);
        simpMessagingTemplate.convertAndSend("/topic/game-progress/" + game.getGameId(), game);
        return ResponseEntity.ok(game);
    }

    @PostMapping("/playAgain")
    public ResponseEntity<Game> playAgain(@RequestBody PlayAgainGame againGame) {
        Player player = againGame.getPlayer();
        Game oldGame = againGame.getOldGame();
        Game game = gameService.playAgain(player, oldGame);
        simpMessagingTemplate.convertAndSend("/topic/game-progress/" + oldGame.getGameId(), oldGame);
        simpMessagingTemplate.convertAndSend("/topic/game-progress/" + game.getGameId(), game);
        return ResponseEntity.ok(game);
    }

    @PostMapping("/connect")
    public ResponseEntity<Game> connect(@RequestBody ConnectionRequest request) throws InvalidGameException {
        //log.info("connect request: {}", request);
        System.out.print(request);
        Game game = gameService.connectToGame(request.getPlayer(), request.getGameId());
        simpMessagingTemplate.convertAndSend("/topic/game-progress/" + game.getGameId(), game);
        return ResponseEntity.ok(game);
    }

    @PostMapping("/play")
    public ResponseEntity<Game> play(@RequestBody Play request) throws InvalidGameException {
        //log.info("play: {}", request);
        System.out.println(request);
        Game game = gameService.play(request);
        simpMessagingTemplate.convertAndSend("/topic/game-progress/" + game.getGameId(), game); //Only sent to browser listening to specific game id
        return ResponseEntity.ok(game);
    }

}
