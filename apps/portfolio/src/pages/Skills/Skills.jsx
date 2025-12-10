import './Skills.css'
import { IMAGES } from '../../constants/images'
import { useTranslations } from '../../hooks/useTranslations'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { specializationsService } from '../../services/specializationsService'

const Skills = () => {
  const t = useTranslations()
  const [hoveredLogo, setHoveredLogo] = useState(null)
  const [specializations, setSpecializations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch specializations (for cards)
        const specsData = await specializationsService.getAll()
        const formattedSpecs = specializationsService.formatSpecializations(specsData)
        setSpecializations(formattedSpecs)
      } catch (err) {
        console.error('Failed to load specializations:', err)
        // Fallback to translations
        setSpecializations([
          {
            id: 1,
            number: t.skills.skill1.number,
            title: t.skills.skill1.title,
            description: t.skills.skill1.description,
            iconUrl: null,
          },
          {
            id: 2,
            number: t.skills.skill2.number,
            title: t.skills.skill2.title,
            description: t.skills.skill2.description,
            iconUrl: null,
          },
          {
            id: 3,
            number: t.skills.skill3.number,
            title: t.skills.skill3.title,
            description: t.skills.skill3.description,
            iconUrl: null,
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [t.skills])

  // Use API data if available, otherwise fallback to translations
  const displaySpecs = specializations.length > 0 
    ? specializations.slice(0, 3) // Show max 3 cards
    : [
        {
          id: 1,
          number: t.skills.skill1.number,
          title: t.skills.skill1.title,
          description: t.skills.skill1.description,
        },
        {
          id: 2,
          number: t.skills.skill2.number,
          title: t.skills.skill2.title,
          description: t.skills.skill2.description,
        },
        {
          id: 3,
          number: t.skills.skill3.number,
          title: t.skills.skill3.title,
          description: t.skills.skill3.description,
        },
      ]

  const logoVariants = {
    initial: { scale: 0, opacity: 0, rotate: -180 },
    animate: (i) => ({
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }),
    hover: {
      scale: 1.2,
      rotate: [0, -10, 10, -10, 0],
      transition: {
        rotate: {
          repeat: Infinity,
          duration: 0.5,
          ease: "easeInOut"
        },
        scale: {
          type: "spring",
          stiffness: 400,
          damping: 10
        }
      }
    }
  }

  const cardVariants = {
    initial: { opacity: 0, y: 50 },
    animate: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + i * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }),
    hover: {
      y: -10,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  }

  return (
    <section id="about" className="skills-section">
      <div className="skills-container">
        <h2 className="skills-title">{t.skills.title}</h2>
        <div className="skills-content-wrapper">
          <div className="skills-logos">
            {/* Orbital paths - quỹ đạo */}
            <svg className="orbital-paths" viewBox="0 0 500 500" preserveAspectRatio="xMidYMid meet">
              {/* Outer orbit paths */}
              <circle className="orbit-path orbit-path-1" cx="250" cy="250" r="180" fill="none" stroke="rgba(88, 63, 188, 0.15)" strokeWidth="1" strokeDasharray="5,5" />
              <circle className="orbit-path orbit-path-2" cx="250" cy="250" r="220" fill="none" stroke="rgba(125, 224, 234, 0.15)" strokeWidth="1" strokeDasharray="5,5" />
              <circle className="orbit-path orbit-path-3" cx="250" cy="250" r="160" fill="none" stroke="rgba(88, 63, 188, 0.12)" strokeWidth="1" strokeDasharray="5,5" />
              <circle className="orbit-path orbit-path-4" cx="250" cy="250" r="190" fill="none" stroke="rgba(125, 224, 234, 0.12)" strokeWidth="1" strokeDasharray="5,5" />
              <circle className="orbit-path orbit-path-5" cx="250" cy="250" r="200" fill="none" stroke="rgba(88, 63, 188, 0.1)" strokeWidth="1" strokeDasharray="5,5" />
              <circle className="orbit-path orbit-path-6" cx="250" cy="250" r="170" fill="none" stroke="rgba(125, 224, 234, 0.1)" strokeWidth="1" strokeDasharray="5,5" />
              <circle className="orbit-path orbit-path-7" cx="250" cy="250" r="210" fill="none" stroke="rgba(88, 63, 188, 0.08)" strokeWidth="1" strokeDasharray="5,5" />
              <circle className="orbit-path orbit-path-8" cx="250" cy="250" r="185" fill="none" stroke="rgba(125, 224, 234, 0.08)" strokeWidth="1" strokeDasharray="5,5" />
              <circle className="orbit-path orbit-path-9" cx="250" cy="250" r="195" fill="none" stroke="rgba(88, 63, 188, 0.08)" strokeWidth="1" strokeDasharray="5,5" />
            </svg>
            {IMAGES.skillsCirclesBg && (
              <div className="skills-circles-bg">
                <img src={IMAGES.skillsCirclesBg} alt="" onError={(e) => e.target.parentElement.style.display = 'none'} />
              </div>
            )}
            {IMAGES.sqlLogo && (
              <motion.div
                className="logo-item logo-1"
                variants={logoVariants}
                initial="initial"
                animate="animate"
                custom={0}
                whileHover="hover"
                onHoverStart={() => setHoveredLogo(1)}
                onHoverEnd={() => setHoveredLogo(null)}
              >
                <motion.img
                  src={IMAGES.sqlLogo}
                  alt="SQL"
                  onError={(e) => e.target.parentElement.style.display = 'none'}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />
                {hoveredLogo === 1 && (
                  <motion.div
                    className="logo-glow"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 2, opacity: [0, 0.5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </motion.div>
            )}
            {IMAGES.excelLogo && (
              <motion.div
                className="logo-item logo-2"
                variants={logoVariants}
                initial="initial"
                animate="animate"
                custom={1}
                whileHover="hover"
                onHoverStart={() => setHoveredLogo(2)}
                onHoverEnd={() => setHoveredLogo(null)}
              >
                <motion.img src={IMAGES.excelLogo} alt="Excel" onError={(e) => e.target.parentElement.style.display = 'none'} />
                {hoveredLogo === 2 && <motion.div className="logo-glow" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 2, opacity: [0, 0.5, 0] }} transition={{ duration: 1, repeat: Infinity }} />}
              </motion.div>
            )}
            {IMAGES.powerBILogo && (
              <motion.div
                className="logo-item logo-3"
                variants={logoVariants}
                initial="initial"
                animate="animate"
                custom={2}
                whileHover="hover"
                onHoverStart={() => setHoveredLogo(3)}
                onHoverEnd={() => setHoveredLogo(null)}
              >
                <motion.img src={IMAGES.powerBILogo} alt="Power BI" onError={(e) => e.target.parentElement.style.display = 'none'} />
                {hoveredLogo === 3 && <motion.div className="logo-glow" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 2, opacity: [0, 0.5, 0] }} transition={{ duration: 1, repeat: Infinity }} />}
              </motion.div>
            )}
            {IMAGES.tableauLogo && (
              <motion.div
                className="logo-item logo-4"
                variants={logoVariants}
                initial="initial"
                animate="animate"
                custom={3}
                whileHover="hover"
                onHoverStart={() => setHoveredLogo(4)}
                onHoverEnd={() => setHoveredLogo(null)}
              >
                <motion.img src={IMAGES.tableauLogo} alt="Tableau" onError={(e) => e.target.parentElement.style.display = 'none'} />
                {hoveredLogo === 4 && <motion.div className="logo-glow" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 2, opacity: [0, 0.5, 0] }} transition={{ duration: 1, repeat: Infinity }} />}
              </motion.div>
            )}
            {IMAGES.jiraLogo && (
              <motion.div
                className="logo-item logo-5"
                variants={logoVariants}
                initial="initial"
                animate="animate"
                custom={4}
                whileHover="hover"
                onHoverStart={() => setHoveredLogo(5)}
                onHoverEnd={() => setHoveredLogo(null)}
              >
                <motion.img src={IMAGES.jiraLogo} alt="Jira" onError={(e) => e.target.parentElement.style.display = 'none'} />
                {hoveredLogo === 5 && <motion.div className="logo-glow" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 2, opacity: [0, 0.5, 0] }} transition={{ duration: 1, repeat: Infinity }} />}
              </motion.div>
            )}
            {IMAGES.figmaLogo && (
              <motion.div
                className="logo-item logo-6"
                variants={logoVariants}
                initial="initial"
                animate="animate"
                custom={5}
                whileHover="hover"
                onHoverStart={() => setHoveredLogo(6)}
                onHoverEnd={() => setHoveredLogo(null)}
              >
                <motion.img src={IMAGES.figmaLogo} alt="Figma" onError={(e) => e.target.parentElement.style.display = 'none'} />
                {hoveredLogo === 6 && <motion.div className="logo-glow" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 2, opacity: [0, 0.5, 0] }} transition={{ duration: 1, repeat: Infinity }} />}
              </motion.div>
            )}
            {IMAGES.postmanLogo && (
              <motion.div
                className="logo-item logo-7"
                variants={logoVariants}
                initial="initial"
                animate="animate"
                custom={6}
                whileHover="hover"
                onHoverStart={() => setHoveredLogo(7)}
                onHoverEnd={() => setHoveredLogo(null)}
              >
                <motion.img src={IMAGES.postmanLogo} alt="Postman" onError={(e) => e.target.parentElement.style.display = 'none'} />
                {hoveredLogo === 7 && <motion.div className="logo-glow" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 2, opacity: [0, 0.5, 0] }} transition={{ duration: 1, repeat: Infinity }} />}
              </motion.div>
            )}
            {IMAGES.postgresqlLogo && (
              <motion.div
                className="logo-item logo-8"
                variants={logoVariants}
                initial="initial"
                animate="animate"
                custom={7}
                whileHover="hover"
                onHoverStart={() => setHoveredLogo(8)}
                onHoverEnd={() => setHoveredLogo(null)}
              >
                <motion.img src={IMAGES.postgresqlLogo} alt="PostgreSQL" onError={(e) => e.target.parentElement.style.display = 'none'} />
                {hoveredLogo === 8 && <motion.div className="logo-glow" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 2, opacity: [0, 0.5, 0] }} transition={{ duration: 1, repeat: Infinity }} />}
              </motion.div>
            )}
            {IMAGES.metabaseLogo && (
              <motion.div
                className="logo-item logo-9"
                variants={logoVariants}
                initial="initial"
                animate="animate"
                custom={8}
                whileHover="hover"
                onHoverStart={() => setHoveredLogo(9)}
                onHoverEnd={() => setHoveredLogo(null)}
              >
                <motion.img src={IMAGES.metabaseLogo} alt="Metabase" onError={(e) => e.target.parentElement.style.display = 'none'} />
                {hoveredLogo === 9 && <motion.div className="logo-glow" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 2, opacity: [0, 0.5, 0] }} transition={{ duration: 1, repeat: Infinity }} />}
              </motion.div>
            )}
          </div>
          <div className="skills-cards">
            {displaySpecs.map((spec, index) => (
              <motion.div
                key={spec.id}
                className={`skill-card skill-card-${index + 1}`}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                custom={index}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="skill-card-number"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 200 }}
                >
                  {spec.number}
                </motion.div>
                <h3 className="skill-card-title">{spec.title}</h3>
                <p className="skill-card-description">
                  {spec.description || ''}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skills

