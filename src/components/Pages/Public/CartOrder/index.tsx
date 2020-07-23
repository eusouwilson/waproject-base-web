import React, { memo } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import TableBody from '@material-ui/core/TableBody';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useTheme } from '@material-ui/core/styles';
import { useItemOrderData } from 'hooks/itemOrder';
import { useObservable } from 'react-use-observable';
import { logError } from 'helpers/rxjs-operators/logError';
import { makeStyles } from '@material-ui/core/styles';
import { map } from 'rxjs/operators';
import authService from 'services/auth';
import ListItem from './ListItem';
import orderItemService from 'services/orderItem';
import orderService from 'services/order';
import LinearProgress from '@material-ui/core/LinearProgress';
import Toast from 'components/Shared/Toast';

const useStyles = makeStyles({
  table: {
    minWidth: 500,
    maxWidth: 'calc(95vw - 20px)'
  }
});

const CartOrder = memo(() => {
  const classes = useStyles();

  const { openedCart, opened, itemData, removeItem, addItem, load } = useItemOrderData();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [user] = useObservable(() => {
    return authService.getUser().pipe(
      map(user => ({
        userId: user.id,
        UserName: `${user.firstName}  ${user.lastName}`
      })),
      logError()
    );
  }, []);
  if (!user) {
    return null;
  }

  const handleSaveOrder = () => {
    let teste = {
      userId: user.userId
    };
    return orderService.save(teste).subscribe({
      next: order => {
        itemData.map(i => {
          let data = {
            itemId: i.id,
            amount: i.amount,
            orderId: order.id
          };
          return orderItemService.save(data).subscribe({
            next: () => {
              addItem([]);
              openedCart();
            }
          });
        });
        Toast.show(`O pedido ${order.id} do ${user.UserName} foi salvo`);
      }
    });
  };

  return (
    <div>
      {load && <LinearProgress color='primary' />}

      <Dialog fullScreen={fullScreen} open={opened} onClose={openedCart} aria-labelledby='responsive-dialog-title'>
        <DialogTitle id='responsive-dialog-title'>{user.UserName}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label='simple table'>
                <TableHead>
                  <TableRow>
                    <TableCell align='right'>Codigo</TableCell>
                    <TableCell align='right'>Descrição</TableCell>
                    <TableCell align='right'>Preço</TableCell>
                    <TableCell align='right'>Quantidade</TableCell>
                    <TableCell align='right'>opçoes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itemData.map(item => {
                    return <ListItem key={item.id} item={item} onDelete={removeItem} />;
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={openedCart} color='primary'>
            Fechar
          </Button>
          <Button onClick={handleSaveOrder} color='primary' autoFocus>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});

export default CartOrder;
