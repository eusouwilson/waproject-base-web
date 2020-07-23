import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import Table from '@material-ui/core/Table';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Alert from 'components/Shared/Alert';
import { IOption } from 'components/Shared/DropdownMenu';
import TableCellActions from 'components/Shared/Pagination/TableCellActions';
import IOrder from 'interfaces/models/order';
import DeleteIcon from 'mdi-react/DeleteIcon';
import EditIcon from 'mdi-react/EditIcon';
import React, { memo, useCallback, useMemo, useState, Fragment, useEffect } from 'react';
import { useCallbackObservable } from 'react-use-observable';
//import  IOrders from 'interfaces/models/orderItem';
import { IItems } from 'interfaces/models/item';

import { dateFormat } from '../../../../../formatters/date';
import { from } from 'rxjs';

import OrderItemService from 'services/orderItem';

interface IProps {
  order: IOrder;
}

const ListItem = memo((props: IProps) => {
  const { order } = props;
  const [open, setOpen] = useState(false);
  const [deleted] = useState(false);
  const [loading] = useState(false);
  const [error, setError] = useState(false);
  const [items, setItems] = useState<IItems>();
  const handleDismissError = useCallback(() => setError(null), []);

  const getItem = useCallback((orderid: number) => {
    let itemTemp: IItems = [];
    let amount: number;
    OrderItemService.current(orderid).subscribe(result => {
      result.map(i => {
        amount = i.amount;
        return itemTemp.push({ ...i.items, amount });
      });
    });

    return setItems(itemTemp);
  }, []);

  useEffect(() => {
    getItem(order.id);
  }, [getItem, order]);

  const handleEdit = useCallback(() => {
    return from(Alert.confirm('Em breve teremos essa funcionalidade'));
  }, []);

  const [handleDelete] = useCallbackObservable(() => {
    return from(Alert.confirm('Em breve teremos essa funcionalidade'));
  }, []);

  const options = useMemo<IOption[]>(() => {
    return [
      { text: 'Editar', icon: EditIcon, handler: handleEdit },
      { text: 'Excluir', icon: DeleteIcon, handler: handleDelete }
    ];
  }, [handleDelete, handleEdit]);

  if (deleted) {
    return null;
  }
  const openDetailsItem = () => {
    setOpen(!open);
  };

  return (
    <Fragment>
      <TableRow>
        <TableCell>
          <IconButton aria-label='expand row' size='small' onClick={openDetailsItem}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{order.id}</TableCell>
        <TableCell>{dateFormat(order.dateOrder)}</TableCell>
        <TableCellActions options={options} loading={loading} error={error} onDismissError={handleDismissError} />
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box margin={1}>
              <Typography variant='h6' gutterBottom component='div'>
                History
              </Typography>
              <Table size='small' aria-label='purchases'>
                <TableHead>
                  <TableRow>
                    <TableCell>Descrição</TableCell>
                    <TableCell>Valor</TableCell>
                    <TableCell align='right'>Quantidade</TableCell>
                    <TableCell align='right'> Total (R$)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items ? (
                    items.map(i => (
                      <TableRow key={i.id}>
                        <TableCell component='th' scope='row'>
                          {i.description}
                        </TableCell>
                        <TableCell>{i.price}</TableCell>
                        <TableCell align='right'>{i.amount}</TableCell>
                        <TableCell align='right'>{Math.round(i.amount * i.price * 100) / 100}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <></>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
});

export default ListItem;
