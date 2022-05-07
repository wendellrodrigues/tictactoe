package com.wendell.tictactoe.model;

import lombok.Data;

import javax.persistence.*;
import java.util.UUID;

@Data
@Table(name="player")
@Entity
public class Player {

    @Id
    @Column
    private String playerId;

    @Column
    private String name;

//    @Column
//    private String ipAddress;

    public Player() {}

    public Player(String name) {
        this.name = name;
    }

    public Player(String name, String playerId) {
        this.name = name;
        this.playerId = playerId;
    }
}
