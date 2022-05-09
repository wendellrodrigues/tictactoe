import React, { useRef, useState, Fragment, useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import PropTypes from "prop-types";
import {
  createGame,
  createGameWithPlayerId,
  joinGame,
  joinWithPlayerId,
} from "../../actions/init";

//Icon
import KeyIcon from "../../static/icons/key.svg";
import UserIcon from "../../static/icons/user.svg";

//Styles
import {
  Wrapper,
  Form,
  InputWrapper,
  Input,
  Icon,
  TextField,
  ButtonWrapper,
  SubmitButton,
  SubmitText,
  AlertWrapper,
  AlertText,
  JoinGameWrapper,
  Spacer,
  OrText,
} from "../../styles/FormStyles";

const StartForm = (props) => {
  const { formData, setFormData } = props;
  let { name, code } = formData;

  //When user alters the form
  const onChange = (e) => {
    console.log(e);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //When user clicks "Create Game"
  const onCreateGame = () => {
    let playerId = localStorage.getItem("playerId");
    if (playerId) {
      props.createGameWithPlayerId(playerId, name);
    } else {
      props.createGame({ name });
    }
  };

  //When user clicks "Join Game"
  const onJoinGame = () => {
    let playerId = localStorage.getItem("playerId");
    if (playerId) {
      const player = {
        name,
        playerId,
      };
      props.joinWithPlayerId(player, code);
    } else {
      props.joinGame({ name, code });
    }
  };

  return (
    <Wrapper>
      <Form>
        <InputWrapper id="name">
          <Input name="name-input">
            <Icon src={UserIcon} name="name" />
            <TextField
              type="text"
              placeholder="Name"
              name="name"
              value={name}
              onChange={(e) => onChange(e)}
              required
            />
          </Input>
        </InputWrapper>
        <Spacer />
        <ButtonWrapper>
          <SubmitButton
            onClick={(formData) => {
              onCreateGame(formData);
            }}
          >
            <SubmitText>Create Game</SubmitText>
          </SubmitButton>
        </ButtonWrapper>
        <OrText>OR</OrText>
        <JoinGameWrapper>
          <InputWrapper>
            <Input name="name">
              <Icon src={KeyIcon} name="name" />
              <TextField
                type="text"
                placeholder="Code"
                name="code"
                value={code}
                onChange={(e) => onChange(e)}
              />
            </Input>
          </InputWrapper>
          <ButtonWrapper>
            <SubmitButton
              onClick={(formData) => {
                onJoinGame(formData);
              }}
            >
              <SubmitText>Join Game</SubmitText>
            </SubmitButton>
          </ButtonWrapper>
        </JoinGameWrapper>
      </Form>
    </Wrapper>
  );
};

StartForm.propTypes = {
  createGameWithPlayerId: PropTypes.func.isRequired,
  createGame: PropTypes.func.isRequired,
  joinGame: PropTypes.func.isRequired,
  joinWithPlayerId: PropTypes.func.isRequired,
};

export default connect(null, {
  createGame,
  createGameWithPlayerId,
  joinGame,
  joinWithPlayerId,
})(StartForm);
