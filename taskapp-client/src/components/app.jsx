import React, {useState} from "react";
import { App, SnackbarProvider } from "zmp-ui";
import { RecoilRoot } from "recoil";

import Router from "./Router";

const MyApp = () => {
  return (
    <RecoilRoot>
      <App>
        <SnackbarProvider>
          <Router />
        </SnackbarProvider>
      </App>
    </RecoilRoot>
  );
};
export default MyApp;
