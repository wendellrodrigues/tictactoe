import React, { useRef, useState, Fragment, useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import PropTypes from "prop-types";
import { createGame, joinGame } from "../../actions/init";

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
    props.createGame({ name });
  };

  //When user clicks "Join Game"
  const onJoinGame = () => {
    props.joinGame({ name, code });
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

const JoinGameWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: auto auto;
`;

const Spacer = styled.div`
  margin-bottom: 60px;
`;

StartForm.propTypes = {
  createGame: PropTypes.func.isRequired,
  joinGame: PropTypes.func.isRequired,
};

export default connect(null, { createGame, joinGame })(StartForm);
