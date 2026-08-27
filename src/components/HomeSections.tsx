import { Hero } from "./home/Hero";
import { Features } from "./home/Features";
import { HowItWorks } from "./home/HowItWorks";
import { Parents } from "./home/Parents";
import { Waitlist } from "./home/Waitlist";

export async function HomeSections() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Parents />
      <Waitlist />
    </>
  );
}
