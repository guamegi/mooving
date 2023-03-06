import React from "react";
import styled from "styled-components/native";

const Text = styled.Text`
  /* color: rgba(255, 255, 255, 0.8); */
  color: ${(props) => props.theme.textColor};
  font-size: 10px;
`;

interface VotesProps {
  votes: number;
}

const Votes: React.FC<VotesProps> = ({ votes }) => {
  return <Text>⭐️{votes.toFixed(1)}/10</Text>;
};
export default Votes;
