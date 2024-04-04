// components/Snake.js
import React from 'react';
import styled from 'styled-components';

const Snake = ({ snake }) => {
  return (
    <>
      {snake.map((segment, index) => (
        <SnakeSegment key={index} style={{ top: segment.y * 20, left: segment.x * 20 }} />
      ))}
    </>
  );
};

const SnakeSegment = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  background-color: green;
`;

export default Snake;
