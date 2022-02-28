import { useRef } from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import theme from "theme";
import createEmotionCache from "utils/createEmotionCache";
import { SnackbarProvider } from "notistack";
import axios from "utils/http-anxios";
import { SWRConfig } from "swr";
import { isIsoDate } from "helpers/dateHelpers";

import LayoutWrapper from "layouts/LayoutWrapper";
import IconButton from "@mui/material/IconButton";
import { CustomIcon } from "components/Icons";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-lazy-load-image-component/src/effects/blur.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "../styles/globals.css";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const notistackRef = useRef();
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const onClickDismiss = (key) => () => {
    notistackRef.current.closeSnackbar(key);
  };
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>MYEZGM</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SWRConfig
          value={{
            fetcher: async (resource) => {
              const fetch = await axios.get(resource);
              const data = JSON.parse(
                fetch.request.response,
                function (key, value) {
                  if (typeof value === "string") {
                    if (isIsoDate(value)) {
                      return new Date(value);
                    }
                  }
                  return value;
                }
              );
              return data;
            },
            revalidateOnFocus: false,
          }}
        >
          <SnackbarProvider
            maxSnack={3}
            ref={notistackRef}
            action={(key) => (
              <IconButton onClick={onClickDismiss(key)}>
                <CustomIcon icon="close" color="white" />
              </IconButton>
            )}
          >
            <LayoutWrapper>
              <Component {...pageProps} />
            </LayoutWrapper>
          </SnackbarProvider>
        </SWRConfig>
      </ThemeProvider>
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
