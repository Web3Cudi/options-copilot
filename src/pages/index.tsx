import { useAtomValue, useSetAtom } from "jotai";
import dynamic from "next/dynamic";

import { Calendar } from "@/components/Calendar/Calendar";
import { TagsContainer } from "@/features/tags";
import { TradeDatePicker } from "@/features/tradeHistory";
import { StatsContainer } from "@/features/tradeStats";
import { dateStatPickerAtom, statsDateAtom } from "@/features/tradeStats/atoms";

import Layout from "../components/Layout";
import useAuth from "../hooks/useAuth";
import { supabase } from "../utils/supabaseClient";

const LineChart = dynamic(() => import("@/components/Chart/LineChart"), {
  ssr: false,
});
const Home = () => {
  const { signOut } = useAuth();
  const setTradeRange = useSetAtom(statsDateAtom);
  const dateRange = useAtomValue(dateStatPickerAtom);

  const handleSelectDate = (value) => {
    setTradeRange(value);
  };

  return (
    <Layout>
      <button onClick={() => signOut()}>Log Out</button>
      <div className="flex justify-between items-end">
        <div className="text-3xl font-bold text-white">Dashboard</div>
        <TradeDatePicker value={dateRange} selectDate={handleSelectDate} />
      </div>
      <div className="flex space-y-5">
        <div className="flex-1">
          <TagsContainer />
          <div className="relative flex-1 mt-5 bg-base-100 p-4 rounded-lg mr-12 max-h-[27rem]">
            <LineChart />
          </div>
        </div>
        <div className="space-y-5">
          <StatsContainer />
          <Calendar />
        </div>
      </div>
    </Layout>
  );
};

export default Home;

export async function getServerSideProps({ req }) {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user) {
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }
  return { props: { user } };
}
