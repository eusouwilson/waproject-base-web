import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from 'components/Layout/Toolbar';
import CardLoader from 'components/Shared/CardLoader';
import EmptyAndErrorMessages from 'components/Shared/Pagination/EmptyAndErrorMessages';
import SearchField from 'components/Shared/Pagination/SearchField';
import TableCellActions from 'components/Shared/Pagination/TableCellActions';
import TableCellSortable from 'components/Shared/Pagination/TableCellSortable';
import TablePagination from 'components/Shared/Pagination/TablePagination';
import TableWrapper from 'components/Shared/TableWrapper';
import usePaginationObservable from 'hooks/usePagination';
import IItem, { IItems } from 'interfaces/models/item';
import RefreshIcon from 'mdi-react/RefreshIcon';
import { useItemOrderData } from 'hooks/itemOrder';

import React, { Fragment, memo, useCallback, useState } from 'react';
import itemService from 'services/item';

import FormDialog from '../FormDialog';
import ListItem from './ListItem';

const itemListPage = memo(() => {
  const { addItem } = useItemOrderData();
  const [item] = useState<IItems>([]);

  const [formOpened, setFormOpened] = useState(false);
  const [current, setCurrent] = useState<IItem>();
  const [params, mergeParams, loading, data, error, , refresh] = usePaginationObservable(
    params => itemService.list(params),
    { orderBy: 'description', orderDirection: 'asc' },
    []
  );

  const handleCreate = useCallback(() => {
    setCurrent(null);
    setFormOpened(true);
  }, []);

  const handleEdit = useCallback((current: IItem) => {
    setCurrent(current);
    setFormOpened(true);
  }, []);

  const handleSave = (current: IItem) => {
    item.push(current);
    addItem(item);
  };

  const formCallback = useCallback(
    (item?: IItem) => {
      setFormOpened(false);
      current ? refresh() : mergeParams({ term: item.description });
    },
    [current, mergeParams, refresh]
  );

  const formCancel = useCallback(() => setFormOpened(false), []);
  const handleRefresh = useCallback(() => refresh(), [refresh]);

  const { total, results } = data || ({ total: 0, results: [] } as typeof data);

  return (
    <Fragment>
      <Toolbar title='Items' />

      <Card>
        <FormDialog opened={formOpened} item={current} onComplete={formCallback} onCancel={formCancel} />
        <CardLoader show={loading} />
        <CardContent>
          <Grid container justify='space-between' alignItems='center' spacing={2}>
            <Grid item xs={12} sm={6} lg={4}>
              <SearchField paginationParams={params} onChange={mergeParams} />
            </Grid>

            <Grid item xs={12} sm={'auto'}>
              <Button fullWidth variant='contained' color='primary' onClick={handleCreate}>
                Adicionar
              </Button>
            </Grid>
          </Grid>
        </CardContent>

        <TableWrapper minWidth={500}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCellSortable
                  paginationParams={params}
                  disabled={loading}
                  onChange={mergeParams}
                  column='codigoItem'
                >
                  Codigo
                </TableCellSortable>
                <TableCellSortable paginationParams={params} disabled={loading} onChange={mergeParams} column='Descri'>
                  Descrição
                </TableCellSortable>
                <TableCellSortable paginationParams={params} disabled={loading} onChange={mergeParams} column='price'>
                  Price
                </TableCellSortable>
                <TableCellSortable paginationParams={params} disabled={loading} onChange={mergeParams} column='opcao'>
                  Opção
                </TableCellSortable>

                <TableCellActions>
                  <IconButton disabled={loading} onClick={handleRefresh}>
                    <RefreshIcon />
                  </IconButton>
                </TableCellActions>
              </TableRow>
            </TableHead>
            <TableBody>
              <EmptyAndErrorMessages
                colSpan={3}
                error={error}
                loading={loading}
                hasData={results.length > 0}
                onTryAgain={refresh}
              />
              {results.map(item => (
                <ListItem
                  key={item.id}
                  item={item}
                  onSave={handleSave}
                  onEdit={handleEdit}
                  onDeleteComplete={formCallback}
                />
              ))}
            </TableBody>
          </Table>
        </TableWrapper>

        <TablePagination total={total} disabled={loading} paginationParams={params} onChange={mergeParams} />
      </Card>
    </Fragment>
  );
});

export default itemListPage;
