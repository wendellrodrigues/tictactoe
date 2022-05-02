package com.wendell.tictactoe.model;

import lombok.Data;

import javax.persistence.*;

@Data
@Table(name="game")
@Entity
public class Game {

    @Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "game_id")
    private String gameId;

    @OneToOne
    @PrimaryKeyJoinColumn(name="player_id")
    private Player player1;

    @OneToOne
    @PrimaryKeyJoinColumn(name="player_id")
    private Player player2;

    @Column(name="status")
    private String status;

    @Column(name="board")
    private int [][] board;

    @Column(name="winner")
    private Integer winner;

}
