import React, { memo, useState } from 'react';
import IItem from 'interfaces/models/item';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';

interface IProps {
  item: IItem;
  onDelete: (item: IItem) => void;
}
const ListItem = memo((props: IProps) => {
  const { item, onDelete } = props;
  const [amount, setAmount] = useState(1);

  function handleRemove() {
    onDelete(item);
  }

  const incrementAmount = () => {
    if (amount < 1) return;
    setAmount(amount + 1);
    item.amount = amount + 1;
  };

  const decrementAmount = () => {
    if (amount === 1) return;
    setAmount(amount - 1);
    item.amount = amount - 1;
  };

  return (
    <TableRow>
      <TableCell align='right'>{item.id}</TableCell>
      <TableCell align='right'>{item.description}</TableCell>
      <TableCell align='right'>{item.price * amount}</TableCell>
      <TableCell align='right'>
        <IconButton color='primary' onClick={incrementAmount}>
          +
        </IconButton>
        <span>{amount}</span>
        <IconButton color='primary' onClick={decrementAmount}>
          -
        </IconButton>
      </TableCell>
      <TableCell align='left'>
        <IconButton color='primary' onClick={handleRemove}>
          remover
        </IconButton>
      </TableCell>
    </TableRow>
  );
});

export default ListItem;
