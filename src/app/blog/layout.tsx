import { Suspense } from "react";
import "../globals.css";

import BlogListSkeleton from "@/components/Skelaton";
import StyledComponentsRegistry from "@/lib/register";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Car Shop",
  description: "This is blog page",
  keywords: ["product", "discount", "modern", "test", "web development"],
  authors: [{ name: "Marta Full Stack" }],
  creator: "Matra",
  openGraph: {
    title: "Car Blogs",
    description: "Car shop website that you can explore and order",
    url: "",
    siteName: "Car Rental",
    images: [
      {
        url: "https://imgs.search.brave.com/SVYEabTzcQSVZWQl9wiH3bdeXk-0I0RnY3H21gex6sU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jbGlw/YXJ0LWxpYnJhcnku/Y29tL25ld19nYWxs/ZXJ5LzEyMS0xMjE3/NjA4X3Nwb3J0cy1j/YXItY2xpcGFydC1j/YXItY2xpcGFydC13/aXRob3V0LWJhY2tn/cm91bmQucG5n",
        width: 1200,
        height: 630,
        alt: "Car Rental Open Graph Image",
      },
    ],
  },
};
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center items-center">
      <StyledComponentsRegistry>
        <Suspense fallback={<BlogListSkeleton />}>{children}</Suspense>
      </StyledComponentsRegistry>
    </div>
  );
}
