package com.wendell.tictactoe.model;

import lombok.Data;

@Data
public class Play {
    private Integer playerType;
    private Integer coordinateX;
    private Integer coordinateY;
    private String gameId;
}
