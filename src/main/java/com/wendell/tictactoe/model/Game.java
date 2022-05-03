package com.wendell.tictactoe.model;

import lombok.Data;

import javax.persistence.*;

@Data
@Table(name="game")
@Entity
public class Game {

    @Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private String gameId;

    @ManyToOne
    @JoinColumn(name="player1", referencedColumnName = "playerId")
    private Player player1;

    @ManyToOne
    @JoinColumn(name="player2", referencedColumnName = "playerId")
    private Player player2;

    @Column
    private String status;

    @Column
    private int [][] board;

    @Column
    private Integer winner;

    public Player getPlayer2() {
        return player2;
    }
}
