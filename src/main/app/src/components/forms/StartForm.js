import React, { useRef, useState, Fragment, useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import PropTypes from "prop-types";
import { createGame } from "../../actions/init";

//Icon
import KeyIcon from "../../static/icons/key.svg";

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
  const onJoinGame = () => {};

  return (
    <Wrapper>
      <Form>
        <InputWrapper id="name">
          <Input name="name-input">
            <Icon src={KeyIcon} name="name" />
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
        <InputWrapper>
          <Input name="name">
            <Icon src={KeyIcon} name="name" />
            <TextField
              type="text"
              placeholder="Code"
              value={code}
              onChange={(e) => onChange(e)}
            />
          </Input>
        </InputWrapper>
      </Form>
    </Wrapper>
  );
};

const Spacer = styled.div`
  margin-bottom: 60px;
`;

StartForm.propTypes = {
  createGame: PropTypes.func.isRequired,
};

export default connect(null, { createGame })(StartForm);
