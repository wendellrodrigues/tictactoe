package com.wendell.tictactoe.model;

import lombok.Data;

@Data
public class Play {
    private Player player;
    private Integer coordinateX;
    private Integer coordinateY;
    private String gameId;
}
