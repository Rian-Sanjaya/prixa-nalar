import React, { Suspense } from 'react';
import Routes from '../routes/routes';
import { LoadPage } from './diagnostic/LoadPage';

const App = () => {
  return (
    <Suspense fallback={<LoadPage />}>
      <Routes />
    </Suspense>
  );
};

export default App;
