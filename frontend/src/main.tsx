import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { Provider } from 'react-redux';
import { store } from './store/redux/store.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* redux를 사용 하기 위해서는 Provider로 감싸야 합니다. */}
    <Provider store={ store }>
      <App />
    </Provider>
  </StrictMode>,
)
