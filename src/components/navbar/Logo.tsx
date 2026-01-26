import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { LogoProps } from "@/lib/types";

export const Logo: React.FC<LogoProps> = ({ data }) => {
  const logoData = data.logo;
  const logoUrl =
    logoData && typeof logoData === "object" ? logoData.url : null;

  const logoAlt =
    (logoData && typeof logoData === "object" && logoData.alt) ||
    data.companyName ||
    "Logo";

  return (
    <div className="shrink-0 flex items-center gap-2">
      <Link href="/" className="flex items-center gap-2">
        {logoUrl && (
          <Image
            src={logoUrl}
            alt={logoAlt}
            width={0}
            height={0}
            sizes="100vw"
            className="h-10 w-10 object-contain"
            priority
          />
        )}
        {data.companyName && (
          <span className="font-bold text-xl text-foreground tracking-tight">
            {data.companyName}
          </span>
        )}
        {!logoUrl && !data.companyName && (
          <span className="font-bold text-xl text-foreground tracking-tight">
            Faktura
          </span>
        )}
      </Link>
    </div>
  );
};
