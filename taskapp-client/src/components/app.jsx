import React, {useState} from "react";
import { App, SnackbarProvider } from "zmp-ui";
import { RecoilRoot } from "recoil";

import Router from "./Router";

const MyApp = () => {
  return (
    <RecoilRoot>
      <App>
        <SnackbarProvider>
          <div className="bg-white">
            <Router />
          </div>
        </SnackbarProvider>
      </App>
    </RecoilRoot>
  );
};
export default MyApp;
