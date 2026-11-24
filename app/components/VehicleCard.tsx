"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { mileageKm, type Vehicle } from "../data/vehicles";
import { usePrice } from "./CurrencyProvider";
import PhotoPlaceholder from "./PhotoPlaceholder";

const km = new Intl.NumberFormat("es-UY");
const FUEL_LABELS: Record<Vehicle["fuelType"], string> = {
  Electric: "Eléctrico",
  Gasoline: "Nafta",
  Hybrid: "Híbrido",
  Diesel: "Diésel",
};

/** Class for compact (true), full (false), or compact-on-mobile ("mobile"). */
function pick(
  compact: boolean | "mobile",
  compactCls: string,
  fullCls: string,
  mobileCls: string,
) {
  if (compact === true) return compactCls;
  if (compact === "mobile") return `${compactCls} ${mobileCls}`;
  return fullCls;
}

export default function VehicleCard({
  vehicle,
  compact = false,
  animateIn = true,
  hideLocation = false,
}: {
  vehicle: Vehicle;
  /** Omit the location line (used on the homepage grids). */
  hideLocation?: boolean;
  /** `true` always compact; `"mobile"` compact below the sm breakpoint only. */
  compact?: boolean | "mobile";
  /** Fade the card in on mount. Off, it is fully visible in the server HTML. */
  animateIn?: boolean;
}) {
  const reduce = useReducedMotion();
  const price = usePrice();
  const [imageFailed, setImageFailed] = useState(false);
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;

  return (
    <motion.article
      layout
      data-testid={`vehicle-card-${vehicle.id}`}
      initial={animateIn ? { opacity: 0, y: reduce ? 0 : 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.15 } }}
      whileHover={reduce ? undefined : { y: -4 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", duration: 0.5, bounce: 0.1 }}
      className={`group relative w-full min-w-0 cursor-pointer overflow-hidden rounded-xl ${compact === "mobile" ? "max-sm:rounded-none" : ""} border border-line bg-[var(--card-bg)] shadow-[var(--card-shadow)] backdrop-blur-xl focus-within:ring-2 focus-within:ring-fg/60 flex flex-col ${compact === true ? "aspect-square" : "max-sm:aspect-auto aspect-[3/4]"}`}
    >
      <div
        className={`relative w-full overflow-hidden bg-neutral-900 ${
          compact === true
            ? "min-h-0 flex-[3]"
            : compact === "mobile"
              ? "aspect-square shrink-0"
              : "aspect-square shrink-0 max-sm:aspect-[4/3]"
        }`}
      >
        {!vehicle.image ? (
          <PhotoPlaceholder />
        ) : imageFailed ? (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-950" />
        ) : (
          <Image
            src={vehicle.image}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            onError={() => setImageFailed(true)}
            className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] motion-safe:group-hover:scale-[1.06]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
        <p
          className={`absolute right-3 top-2 z-10 font-semibold tabular-nums tracking-tight text-white drop-shadow ${pick(compact, "text-base", "text-xl", "sm:text-xl")}`}
        >
          {price(vehicle)}
        </p>
      </div>

      <div
        className={`relative flex min-h-0 flex-col justify-center overflow-hidden ${
          compact === true ? "flex-[2]" : "flex-1"
        } ${pick(
          compact,
          `px-3 ${hideLocation ? "py-1" : "py-1.5"}`,
          "px-4 py-1.5",
          "sm:px-4 sm:py-1.5",
        )}`}
      >
        <h3
          className={`mr-8 truncate font-medium tracking-tight text-fg ${hideLocation ? "leading-tight" : ""} ${pick(compact, "text-base", "text-lg", "sm:text-lg")} ${compact === "mobile" ? "max-sm:text-sm" : ""}`}
        >
          <Link
            href={`/autos/${vehicle.id}`}
            className="outline-none after:absolute after:inset-0"
          >
            {vehicle.make} {vehicle.model}
          </Link>
        </h3>
        <p
          className={`mr-8 mt-0 font-medium uppercase tracking-widest text-muted ${pick(compact, "text-[10px]", "text-xs", "sm:text-xs")} ${compact === "mobile" ? "max-sm:text-[9px]" : ""}`}
        >
          {vehicle.year} · {FUEL_LABELS[vehicle.fuelType]} ·{" "}
          {km.format(mileageKm(vehicle.mileage))} km
        </p>
        <Link
          href={`/autos/${vehicle.id}`}
          aria-label={`Ver la ficha del ${title}`}
          data-testid={`open-${vehicle.id}`}
          className={`absolute inset-y-0 right-3 z-10 my-auto flex shrink-0 ${compact === true ? "h-7 w-7" : compact === "mobile" ? "h-7 w-7 max-sm:h-6 max-sm:w-6" : "h-7 w-7"} items-center justify-center rounded-full border border-line text-muted transition-[color,transform,border-color] duration-150 hover:border-fg/40 hover:text-fg group-hover:translate-x-0.5 active:scale-95`}
        >
          <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        </Link>
      </div>
    </motion.article>
  );
}
