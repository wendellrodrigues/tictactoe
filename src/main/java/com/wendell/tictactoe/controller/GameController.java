package com.wendell.tictactoe.controller;


import com.wendell.tictactoe.controller.dao.ConnectionRequest;
import com.wendell.tictactoe.exception.InvalidGameException;
import com.wendell.tictactoe.model.Game;
import com.wendell.tictactoe.model.Play;
import com.wendell.tictactoe.model.Player;
import com.wendell.tictactoe.service.GameService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@AllArgsConstructor
@RequestMapping("/game")
public class GameController {

    private final GameService gameService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @PostMapping("/start")
    public ResponseEntity<Game> start(@RequestBody Player player) {
        //log.info("start game request: {}", player);
        System.out.println(player);
        return ResponseEntity.ok(gameService.createGame(player));
    }

    @PostMapping("/connect")
    public ResponseEntity<Game> connect(@RequestBody ConnectionRequest request) throws InvalidGameException {
        //log.info("connect request: {}", request);
        System.out.print(request);
        return ResponseEntity.ok(gameService.connectToGame(request.getPlayer(), request.getGameId()));
    }

    @PostMapping("/play")
    public ResponseEntity<Game> play(@RequestBody Play request) throws InvalidGameException {
        //log.info("play: {}", request);
        System.out.println(request);
        Game game = gameService.play(request);
        simpMessagingTemplate.convertAndSend("/topic/game-progress" + game.getGameId(), game); //Only sent to browser listening to specific game id
        return ResponseEntity.ok(game);
    }

}
