"use client";
import { useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { mainContext } from "@/Contexts/mainContext";

export default function NotFound() {
  const { locale } = useContext(mainContext);
  const isAr = locale === "AR";

  return (
    <div className="error-page brand-404">
      <div className="brand-404__stage">
        <div className="digits" dir="ltr" aria-label="404">
          <span aria-hidden="true">4</span>
          <span className="zero" aria-hidden="true">
            <span className="brand-logo brand-logo--sun">
              <Image className="on-light" src="/brand/sun-brown.png" width={600} height={600} alt="" />
              <Image className="on-dark" src="/brand/sun-cream.png" width={600} height={600} alt="" />
            </span>
          </span>
          <span aria-hidden="true">4</span>
        </div>
        <div className="brand-404__falcon">
          <Image
            src="/brand/mascot/falcon-thinking.webp"
            width={600}
            height={646}
            alt={isAr ? "الصقر بيفكر" : "The falcon looking puzzled"}
          />
        </div>
      </div>

      <h4>{isAr ? "الطريق ده مش على الخريطة" : "This path isn't on the map"}</h4>
      <p>
        {isAr
          ? "حتى أشطر مستكشف بيتوه ساعات. الصفحة دي مش موجودة أو اتنقلت لمكان تاني."
          : "Even the best explorers take a wrong turn. This page doesn't exist or has moved somewhere else."}
      </p>
      <div className="btns">
        <Link href="/" className="main-button back-light-animation">
          {isAr ? "ارجع للرئيسية" : "Back to Home"}
        </Link>
        <Link href="/discover" className="main-button ghost">
          {isAr ? "اكتشف مصر" : "Discover Egypt"}
        </Link>
      </div>
    </div>
  );
}
