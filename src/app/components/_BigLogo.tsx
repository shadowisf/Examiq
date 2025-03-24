"use client";

import Image from "next/image";

export default function BigLogo() {
  return (
    <div className="big-logo">
      <Image
        src={"/icons/logo.png"}
        alt="logo"
        width={225}
        height={125}
        priority
      />
    </div>
  );
}
