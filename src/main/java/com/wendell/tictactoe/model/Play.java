package com.wendell.tictactoe.model;

import lombok.Data;

@Data
public class Play {
    private Integer playerType;
    private Integer xCoordinate;
    private Integer yCoordinate;
    private String id;
}
