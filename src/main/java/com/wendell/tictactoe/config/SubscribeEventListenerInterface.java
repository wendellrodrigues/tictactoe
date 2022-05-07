package com.wendell.tictactoe.config;

import com.wendell.tictactoe.model.Player;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

public interface SubscribeEventListenerInterface {
    void handleSessionDisconnect(SessionDisconnectEvent event);
    void handleSessionConnect(SessionConnectEvent event);
}
