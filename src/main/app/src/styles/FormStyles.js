import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  width: 600px;
  background: #fffff;
  height: auto;
  border-radius: 15px;
  box-shadow: 0px 0px 5px #bababa;
`;

export const Form = styled.div`
  display: grid;
  position: relative;
  padding: 0px;
  margin: auto;
  padding: 10px;
  width: 100%;
  gap: 0px;
  justify-items: center;
`;

export const InputWrapper = styled.div`
  width: 100%;
  padding: 10px;
  justify-content: start;
`;

export const Input = styled.div`
  overflow: hidden;
  display: grid;
  grid-template-columns: 40px auto;
  align-items: center;
  position: relative;
  border-color:#e77b7b
  border-style: solid;
  margin: auto;
  border-width: 3px;
  border-radius: 10px;
  align-items: center;
  width: 100%;
  height: 45px;
  background: #ffffff;
  box-shadow: 0px 0px 5px #bababa;
  transition: 0.3s linear;

`;

export const Icon = styled.img`
  display: grid;
  position: relative;
  margin-left: 20px;
  width: 15px;
  height: 15px;
  opacity: 0.7;
`;

export const TextField = styled.input`
  overflow: hidden;
  background: none;
  border: none;
  margin-left: 10px;
  outline: none;
  color: #353535;
  line-height: normal;
`;

export const ButtonWrapper = styled(InputWrapper)`
  justify-content: center;
`;

export const SubmitButton = styled.div`
  display: grid;
  margin: auto;
  width: 100%;
  height: 45px;
  background: #171717;
  border-radius: 10px;
  justify-items: center;
  align-items: center;
  transition: 0.2s ease-in;
  box-shadow: 0px 0px 5px #bababa;
  :hover {
    background: #1c1c1c;
    cursor: pointer;
  }
`;

export const SubmitText = styled.p`
  color: white;
  font-size: 17px;
  font-weight: bold;
  line-height: normal;
`;

export const AlertWrapper = styled(InputWrapper)`
  padding: 0px;
  padding-left: 15px;
`;

export const AlertText = styled.p`
  line-height: normal;
  font-size: 10px;
  margin-left: 5px;
  margin-top: 10px;
  color: #f07a7a;
`;
