import React, { useState, Fragment, useEffect } from "react";
import { connect } from "react-redux";
//import { Navigate } from "react-router-dom";
import styled from "styled-components";
import StartForm from "./forms/StartForm";
import Game from "./Game";
import PropTypes from "prop-types";

const Landing = (props) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
  });

  const { game, player } = props;

  const content = () => {
    if (game) {
      return <Game />;
    } else {
      return (
        <StartForm
          formData={formData}
          setFormData={(formData) => setFormData(formData)}
        />
      );
    }
  };

  return (
    <Fragment>
      <Wrapper>
        <Content>{content()}</Content>
      </Wrapper>
    </Fragment>
  );
};

//Styled Components
const Wrapper = styled.div`
  height: auto;
  width: 100%;
  height: 100%;
  justify-content: center;
  margin-top: 200px;
`;

const Content = styled.div`
  position: relative;
  display: grid;
  margin: auto;
  width: 90%;
  justify-content: center;
  align-items: top;
  padding: 20px;
`;

const mapStateToProps = (state) => ({
  game: state.init.game,
  player: state.init.player,
});

export default connect(mapStateToProps)(Landing);
