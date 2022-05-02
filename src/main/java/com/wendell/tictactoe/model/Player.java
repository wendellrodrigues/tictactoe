package com.wendell.tictactoe.model;

import lombok.Data;

import javax.persistence.*;

@Data
@Table(name="player")
@Entity
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "player_id")
    Long playerId;

    @Column(name="name")
    private String name;

    @Column(name="ip_address")
    private String ipAddress;

}
