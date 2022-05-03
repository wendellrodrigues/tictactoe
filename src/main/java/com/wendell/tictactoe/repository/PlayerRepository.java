package com.wendell.tictactoe.repository;


import com.wendell.tictactoe.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {
    //Select * FROM game where id = ?
    @Query("SELECT s FROM Player s WHERE s.playerId = ?1")
    Player findPlayerById(String gameId);
}
