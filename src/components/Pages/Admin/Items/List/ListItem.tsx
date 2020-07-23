import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Alert from 'components/Shared/Alert';
import { IOption } from 'components/Shared/DropdownMenu';
import TableCellActions from 'components/Shared/Pagination/TableCellActions';
import IItem from 'interfaces/models/item';
import DeleteIcon from 'mdi-react/DeleteIcon';
import EditIcon from 'mdi-react/EditIcon';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { useCallbackObservable } from 'react-use-observable';
import { from } from 'rxjs';

interface IProps {
  item: IItem;
  onEdit: (item: IItem) => void;
  onSave: (item: IItem) => void;
  onDeleteComplete: () => void;
}

const ListItem = memo((props: IProps) => {
  const { item, onSave } = props;
  const [deleted] = useState(false);
  const [loading] = useState(false);
  const [error, setError] = useState(false);

  const handleDismissError = useCallback(() => setError(null), []);

  const handlerSave = useCallback(() => {
    onSave(item);
  }, [onSave, item]);

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

  return (
    <TableRow>
      <TableCell>{item.id}</TableCell>
      <TableCell>{item.description}</TableCell>
      <TableCell>{item.price}</TableCell>

      <TableCell>
        <Button variant='contained' color='primary' onClick={handlerSave}>
          Adicionar ao Carrinho
        </Button>
      </TableCell>
      <TableCellActions options={options} loading={loading} error={error} onDismissError={handleDismissError} />
    </TableRow>
  );
});

export default ListItem;
