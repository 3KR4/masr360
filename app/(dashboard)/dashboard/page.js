import Image from "next/image";
import "@/styles/pages/home.css";
import Categories from "@/components/home/Categories";
import Navigations from "@/components/Navigations";

export default function DashBoard() {
  return (
    <>
      <div className="overview">
        <Navigations items={[]} container={`main`} isDashBoard={true} />
        xxxxxxxxxxxxx
      </div>
    </>
  );
}
