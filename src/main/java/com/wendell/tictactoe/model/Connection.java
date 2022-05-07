package com.wendell.tictactoe.model;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.*;

@Data
@Table(name="connection")
@Entity
public class Connection {

    @Id
    @Column
    private String connection;

    @Column
    private String gameId;
}
