import React from 'react';
import styled from 'styled-components';

const Fruit = ({ fruit, bonus }) => {
  return <StyledFruit style={{ top: fruit.y * 20, left: fruit.x * 20 }} bonus={bonus} />;
};

const StyledFruit = styled.div`
  position: absolute;
  width: ${props => props.bonus ? '60px' : '40px'}; /* Adjust width based on bonus prop */
  height: ${props => props.bonus ? '60px' : '40px'}; /* Adjust height based on bonus prop */
  background-color: ${props => props.bonus ? 'yellow' : 'red'}; /* Use yellow color for bonus fruit */
  border-radius: 50%;
`;

export default Fruit;
