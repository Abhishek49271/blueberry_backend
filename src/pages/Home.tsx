import Hero from '../sections/Hero'
import Story from '../sections/Story'
import FeaturedCarousel from '../sections/FeaturedCarousel'
import Menu from '../sections/Menu'
import Signature from '../sections/Signature'
import Experience from '../sections/Experience'
import Gallery from '../sections/Gallery'
import Visit from '../sections/Visit'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Hero />
      <Story />
      <FeaturedCarousel />
      <Menu />
      <Signature />
      <Experience />
      <Gallery />
      <Visit />
      <Footer />
    </>
  )
}
