import { redirect } from "next/navigation";

// The preview moved to /experiences/testing, where it sits inside the real site
// layout. This keeps any link already shared with the old address working.
export const metadata = {
  robots: { index: false, follow: false },
};

export default function Page() {
  redirect("/experiences/testing");
}
