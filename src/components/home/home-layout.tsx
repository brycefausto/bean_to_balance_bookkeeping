import { PropsWithChildren } from "react";
import HomeHeader from "./home-header";
import HomeFooter from "./home-footer";

export default async function HomeLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <HomeHeader />
      {children}
      <HomeFooter />
    </div>
  );
}
