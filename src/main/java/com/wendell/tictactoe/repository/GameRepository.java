package com.wendell.tictactoe.repository;


import com.wendell.tictactoe.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
    //Select * FROM game where id = ?
    @Query("SELECT s FROM Game s WHERE s.game_id = ?1")
    Optional<Game> findGameById(String gameId);
}
