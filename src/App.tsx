import React from "react";
import "./App.less";
import WebRoutes from "./WebRoutes";
import "antd/dist/antd.less";
import { RecoilRoot } from "recoil";
import locale_th from "antd/lib/locale-provider/th_TH";
import { ConfigProvider } from "antd";
import BuddhaEra from "dayjs/plugin/buddhistEra";
import dayjs from "dayjs";
import { QueryClient, QueryClientProvider } from "react-query";

dayjs.extend(BuddhaEra);
dayjs.locale("th");

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnReconnect: true,
      },
    },
  });
  const newLocale = {
    ...locale_th,
    DatePicker: {
      ...locale_th.DatePicker,
      lang: {
        ...locale_th?.DatePicker?.lang,
        yearFormat: "BBBB",
        dateFormat: "DD/MM/BBBB",
      },
    },
  };

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider locale={locale_th}>
          <WebRoutes />
        </ConfigProvider>
      </QueryClientProvider>
    </RecoilRoot>
  );
}

export default App;
