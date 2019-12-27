import React from 'react';
import '../style.css';
import Cell from './Cell';

const Row = ({ row }) => {
  return(
    <tr>
    {row.map((cell, i) => <Cell key={i} value={cell} />)}
    </tr>
  );
}

export default Row; 
