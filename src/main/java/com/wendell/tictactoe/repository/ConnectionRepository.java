package com.wendell.tictactoe.repository;

import com.wendell.tictactoe.model.Connection;
import com.wendell.tictactoe.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, Long> {
    //Select * FROM game where id = ?

    @Query("SELECT s FROM Connection s WHERE s.connection = ?1")
    Connection getConnection(String connection);
}