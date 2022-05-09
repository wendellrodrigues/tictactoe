import styled from "styled-components";

export const LoadingGameWrapper = styled.div`
  display: grid;
  gap: 10px;
  justify-items: center;
`;

export const LoadingGameText = styled.p`
  font-size: 20px;
  font-weight: medium;
  line-height: normal;
`;

export const TitleWrapper = styled(LoadingGameWrapper)`
  margin-bottom: 90px;
`;

export const TitleText = styled.p`
  font-size: 30px;
  font-weight: bold;
  line-height: normal;
`;

export const SubheadlineText = styled.p`
  font-size: 18px;
  font-weight: medium;
  line-height: normal;
`;

export const InformationText = styled.p`
  font-size: 15px;
  font-weight: bold;
  line-height: normal;
`;

export const InfoText = styled.p`
  font-size: 15px;
  font-weight: bold;
  line-height: normal;

  ${(props) => {
    if (props.type === "green")
      return `
            color: green
        `;
    else if (props.type === "red")
      return `
            color: red
        `;
    else
      return `
    color: orange;
    
    `;
  }}
`;

export const TurnWrapper = styled.div`
  display: grid;
  gap: -20px;
  justify-items: center;
`;

export const TableWrapper = styled.div`
  display: grid;
  justify-items: center;
`;

export const Table = styled.div`
  display: grid;
  justify-content: center;
  grid-template-columns: auto auto auto;
  margin-bottom: 20px;
`;

export const Column = styled.div``;

export const Tile = styled.div`
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
  margin-left: 10px;
  background: #dedede;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  transition: 0.5s ease-in;

  :hover {
    transition: 0.5s ease-in;
    background: #b0b0b0;
    cursor: pointer;
  }
`;

export const Symbol = styled.img`
  margin: auto;
`;

export const ButtonWrapper = styled.div`
  margin-top: 20px;
  justify-content: center;
  width: 100px;
`;

export const SubmitButton = styled.div`
  display: grid;
  margin: auto;
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

export const TwoButtonWrapper = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  gap: 20px;
`;

export const ScoreDiv = styled.div`
  display: grid;
  margin: 20px;
  margin-top: 30px;
  padding: 10px;
  width: 300px;
  grid-template-columns: auto auto;
  gap: 20px;

  background: #dedede;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
`;

export const ScoreText = styled.p`
  font-size: 15px;
  font-weight: bold;
  line-height: normal;
  color: ${(props) => (props.type == "green" ? "green" : "red")};
`;
