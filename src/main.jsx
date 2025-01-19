import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async'; // Import HelmetProvider for metadata management
import App from './App.jsx';
import store from './redux/store/store.jsx';
import './index.css';

// Wrap the application with both Provider and HelmetProvider
createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </HelmetProvider>
);
