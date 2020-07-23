import React, { memo } from 'react';
import IconButton from '@material-ui/core/IconButton';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import Badge from '@material-ui/core/Badge';
import { useItemOrderData } from 'hooks/itemOrder';
import { makeStyles } from '@material-ui/core/styles';
import CartOrder from '../Pages/Public/CartOrder';
const useStyles = makeStyles(() => ({
  button: {
    marginRight: 25,
    padding: 0
  },
  cart: {
    width: 40,
    height: 40,
    fontSize: 16
  }
}));

const CartMenu: React.FC = memo((props: {}) => {
  const classes = useStyles(props);
  const { itemData, openedCart } = useItemOrderData();

  return (
    <div>
      <IconButton color='inherit' className={classes.button} onClick={openedCart}>
        <Badge badgeContent={itemData.length} color='primary'>
          <ShoppingBasketIcon color='secondary' fontSize='large' />
        </Badge>
      </IconButton>
      <CartOrder />
    </div>
  );
});

export default CartMenu;
