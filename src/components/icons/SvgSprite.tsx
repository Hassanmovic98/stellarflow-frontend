"use client";

import { useEffect } from "react";
import { ICON_IDS } from "./iconIds";
export { ICON_IDS } from "./iconIds";
export type { IconId } from "./iconIds";

let injected = false;

export default function SvgSprite() {
  useEffect(() => {
    if (injected) return;
    injected = true;

    fetch("/sprite.svg")
      .then((res) => res.text())
      .then((svg) => {
        const container = document.createElement("div");
        container.style.display = "none";
        container.innerHTML = svg;
        document.body.insertBefore(container, document.body.firstChild);
      })
      .catch(() => {
        injected = false;
      });
  }, []);

  return null;
}
