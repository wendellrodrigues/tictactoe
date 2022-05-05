import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
//import { Navigate } from "react-router-dom";
import styled from "styled-components";
import StartForm from "./forms/StartForm";
import PropTypes from "prop-types";

//Different stomp clients (test)
//import SockJsClient from "react-stomp";
import { Stomp } from "@stomp/stompjs";
import { over } from "stompjs";
import * as SockJS from "sockjs-client";

//Actions
import { createSocketConnection } from "../actions/init";

const Game = (props) => {
  const { game, player, stompClient } = props;

  useEffect(() => {
    props.createSocketConnection(game.gameId, stompClient);
  }, []);

  return (
    <div>
      <p></p>
    </div>
  );
};

Game.propTypes = {
  createSocketConnection: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  game: state.init.game,
  player: state.init.player,
  stompClient: state.init.stompClient,
});

export default connect(mapStateToProps, { createSocketConnection })(Game);
