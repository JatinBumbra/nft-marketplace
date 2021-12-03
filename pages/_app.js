import '../styles/globals.css';
import { AppState } from '../state';
import ScreenLayout from '../components/ScreenLayout';

function Marketplace({ Component, pageProps }) {
  return (
    <AppState>
      <ScreenLayout>
        <Component {...pageProps} />
      </ScreenLayout>
    </AppState>
  );
}

export default Marketplace;
