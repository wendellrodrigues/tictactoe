package com.wendell.tictactoe.controller.dao;

import com.wendell.tictactoe.model.Player;
import lombok.Data;

@Data
public class ConnectionRequest {
    private Player player;
    private String gameId;
}
