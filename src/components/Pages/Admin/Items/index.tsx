import React, { memo } from 'react';
import { Route, Switch } from 'react-router-dom';

import ItemListPage from './List';

const ItemIndexPage = memo(() => {
  return (
    <Switch>
      <Route path='/' component={ItemListPage} />
    </Switch>
  );
});

export default ItemIndexPage;
