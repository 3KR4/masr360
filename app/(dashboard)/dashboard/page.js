import Image from "next/image";
import "@/styles/pages/home.css";
import Navigations from "@/components/Navigations";

export default function DashBoard() {
  return (
    <>
      <div className="dash-holder">
        <Navigations items={[]} container={`no`} isDashBoard={true} />
      </div>
    </>
  );
}
