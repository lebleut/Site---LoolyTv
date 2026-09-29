import { Hero } from "./home/Hero";
import { Features } from "./home/Features";
import { HowItWorks } from "./home/HowItWorks";
import { Parents } from "./home/Parents";
import { Curation } from "./home/Curation";
import { Waitlist } from "./home/Waitlist";

export async function HomeSections() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Parents />
      <Curation />
      <Features />
      <Waitlist />
    </>
  );
}
