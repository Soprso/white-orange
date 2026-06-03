import React from "react";
import Hero from "../components/Hero";
import FeaturedProjects from "../components/FeaturedProjects";
import AboutAndSkills from "../components/AboutAndSkills";

const Home = () => {
  return (
    <main>
      <Hero />
      <FeaturedProjects />
      <AboutAndSkills />
    </main>
  );
};

export default Home;
