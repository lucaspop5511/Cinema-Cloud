import AppWrapper from '../components/AppWrapper'
import '../styles/fonts.css';
import '../icon-library'
import '../styles/index.css'
import '../styles/App.css'
import '../styles/Header.css'
import '../styles/Footer.css'
import '../styles/SearchBar.css'
import '../styles/panels/GenrePanel.css'
import '../styles/panels/FilterHeader.css'
import '../styles/panels/DetailPanel.css'
import '../styles/panels/SegmentedControl.css'
import '../styles/Home.css'
import '../styles/Cinema.css'
import '../styles/SearchResults.css'
import '../styles/Detail.css'
import '../styles/Watchlist.css'
import '../styles/auth/LoginModal.css'
import '../styles/auth/AuthButton.css'
import '../styles/WatchlistButton.css'
import '../styles/NowPlayingButton.css'
import '../styles/StreamingProviders.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Cinema Cloud</title>
        <script
          src="https://kit.fontawesome.com/fdca3800c7.js"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body>
        <AppWrapper>
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}