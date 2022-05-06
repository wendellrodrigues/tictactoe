package com.wendell.tictactoe.model;


import lombok.Data;

@Data
public class PlayAgainGame {
    private Player player;
    private Game oldGame;
}
