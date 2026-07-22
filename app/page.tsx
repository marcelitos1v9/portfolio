import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import Hero from "@/components/sections/Hero"
import About from "@/components/sections/About"
import Expertise from "@/components/sections/Expertise"
import Projects from "@/components/sections/Projects"
import Timeline from "@/components/sections/Timeline"
import Contact from "@/components/sections/Contact"
import { getGithubStats } from "@/lib/data/github"

export default async function Home() {
  // Fetched server-side with 1-hour revalidation; never blocks on failure.
  const githubStats = await getGithubStats()

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Expertise />
        <Projects githubStats={githubStats} />
        <Timeline />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
