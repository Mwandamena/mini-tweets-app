import React from "react";

export default function Container({ children }) {
  return (
    <section className="relative max-w-[2520px] px-4 sm:px-2 md:px-10 lg:px-24">
      {children}
    </section>
  );
}
