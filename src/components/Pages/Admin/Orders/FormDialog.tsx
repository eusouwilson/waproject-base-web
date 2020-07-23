import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Slide from '@material-ui/core/Slide';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from 'components/Shared/Fields/Text';
import Toast from 'components/Shared/Toast';
import { logError } from 'helpers/rxjs-operators/logError';
import { useFormikObservable } from 'hooks/useFormikObservable';
import IOrder from 'interfaces/models/order';
import React, { forwardRef, Fragment, memo, useCallback } from 'react';
import orderItemService from 'services/orderItem';
import { useItemOrderData } from 'hooks/itemOrder';

/* import { useRetryableObservable } from 'react-use-observable';*/
import { tap } from 'rxjs/operators';
import orderService from 'services/order';
import * as yup from 'yup';
import IItem from 'interfaces/models/item';

interface IProps {
  opened: boolean;
  order?: IOrder;
  item?: IItem;
  onComplete?: (order: IOrder) => void;
  onCancel: () => void;
}

const validationSchema = yup.object().shape({
  client: yup.string().required().min(5).max(50)
});

const useStyle = makeStyles({
  content: {
    width: 600,
    maxWidth: 'calc(95vw - 50px)'
  },
  heading: {
    marginTop: 20,
    marginBottom: 10
  }
});

const FormDialog = memo((props: IProps) => {
  const { itemData } = useItemOrderData();

  const classes = useStyle(props);

  const formik = useFormikObservable<IOrder>({
    validationSchema,
    onSubmit(model) {
      return orderService.save(model).pipe(
        tap(order => {
          itemData.map(i => {
            let teste = {
              itemId: i.id,
              amount: i.amount,
              orderId: order.id
            };
            return orderItemService.save(teste).subscribe({
              next: result => console.log(result),
              complete: () => console.log('done')
            });
          });
          Toast.show(`${order.id} do cliente: ${order.UserName} foi salvo`);
          props.onComplete(order);
        }),
        logError(true)
      );
    }
  });

  const handleEnter = useCallback(() => {
    formik.setValues(props.order ?? formik.initialValues, false);
  }, [formik, props.order]);

  const handleExit = useCallback(() => {
    formik.resetForm();
  }, [formik]);

  return (
    <Dialog
      open={props.opened}
      disableBackdropClick
      disableEscapeKeyDown
      onEnter={handleEnter}
      onExited={handleExit}
      TransitionComponent={Transition}
    >
      {formik.isSubmitting && <LinearProgress color='primary' />}

      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>
          {formik.values.id ? 'Editar' : 'Novo'} Pedido Nº {formik.values.id}
        </DialogTitle>

        <DialogContent className={classes.content}>
          <Fragment>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label='Cliente' name='client' type='text' formik={formik} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label='Data' name='dateOrder' type='date' formik={formik} />
              </Grid>
            </Grid>
          </Fragment>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onCancel}>Cancelar</Button>
          <Button color='primary' variant='contained' type='submit' disabled={formik.isSubmitting}>
            Salvar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
});

const Transition = memo(
  forwardRef((props: any, ref: any) => {
    return <Slide direction='up' {...props} ref={ref} />;
  })
);

export default FormDialog;
