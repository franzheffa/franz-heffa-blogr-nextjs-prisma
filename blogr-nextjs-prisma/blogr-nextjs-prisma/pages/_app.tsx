import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import '../components/styles.css';
export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={(pageProps as any).session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
