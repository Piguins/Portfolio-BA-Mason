import Hero from '../Hero'
import Skills from '../Skills'
import Portfolio from '../Portfolio'
import Experience from '../Experience'
import { IMAGES } from '../../constants/images'
import './Home.css'

const Home = () => {

  return (
    <div className="home">
      {/* Top decorative shapes */}
      <div className="top-shapes">
        <div className="gradient-shape gradient-shape-1"></div>
        <div className="gradient-shape gradient-shape-2"></div>
        <div className="lines-decoration">
          <img src={IMAGES.linesDecoration} alt="" />
        </div>
      </div>

      <Hero />
      <Skills />
      <Experience />
      <Portfolio />
    </div>
  )
}

export default Home

