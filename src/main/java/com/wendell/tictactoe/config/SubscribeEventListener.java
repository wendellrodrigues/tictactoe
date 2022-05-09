package com.wendell.tictactoe.config;

import com.wendell.tictactoe.model.Connection;
import com.wendell.tictactoe.model.Game;
import com.wendell.tictactoe.repository.ConnectionRepository;
import com.wendell.tictactoe.repository.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component

public class SubscribeEventListener implements ApplicationListener, SubscribeEventListenerInterface {

    @Autowired
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ConnectionRepository connectionRepository;
    private final GameRepository gameRepository;

    public SubscribeEventListener(SimpMessagingTemplate simpMessagingTemplate, ConnectionRepository connectionRepository, GameRepository gameRepository) {
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.connectionRepository = connectionRepository;
        this.gameRepository = gameRepository;
    }


    @Override
    public void onApplicationEvent(ApplicationEvent event) {
    
    }

    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = sha.getSessionId();
    }

    @EventListener
    public void handleSessionConnect(SessionConnectEvent event) {
        SimpMessageHeaderAccessor message = SimpMessageHeaderAccessor.wrap(event.getMessage());
        String gameId = String.valueOf(message.getNativeHeader("gameId"));
        gameId = gameId.substring( 1, gameId.length() - 1 ); //Update string to remove [ ]
        String connectionId = message.getSessionId();

        //Save new connection in connections table
        Connection connection = new Connection();
        connection.setConnection(connectionId);
        connection.setGameId(gameId);
        connectionRepository.save(connection);

        //Save connections to game table
        Game game = gameRepository.getGame(gameId);

        if(game != null) {
            if(game.getPlayer1Connection() == null) {
                game.setPlayer1Connection(connectionId);
            } else {
                game.setPlayer2Connection(connectionId);
            }
            gameRepository.save(game);
            //Alert the socket
            simpMessagingTemplate.convertAndSend("/topic/game-progress/" + gameId, game);
        }

    }

}