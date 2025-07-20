import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface MascotProps {
  isTyping: boolean
  color?: string
  gradient?: string
}

type MascotState = 'idle' | 'thinking' | 'typing' | 'excited' | 'curious'

const Mascot: React.FC<MascotProps> = ({ isTyping, color = '#a78bfa', gradient }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [mascotState, setMascotState] = useState<MascotState>('idle')

  // Update mascot state based on typing status
  React.useEffect(() => {
    if (isTyping) {
      setMascotState('thinking')
    } else {
      setMascotState('idle')
    }
  }, [isTyping])

  const getStateAnimations = () => {
    switch (mascotState) {
      case 'thinking':
        return {
          y: [-2, 2, -2],
          scale: 1.02,
          rotate: [0, 5, -5, 0]
        }
      case 'typing':
        return {
          y: [-1, 1, -1],
          scale: 1.01,
          rotate: [0, 2, -2, 0]
        }
      case 'excited':
        return {
          y: [-3, 3, -3],
          scale: 1.05,
          rotate: [0, 8, -8, 0]
        }
      case 'curious':
        return {
          y: [-1, 1, -1],
          scale: 1.03,
          rotate: [0, 3, -3, 0]
        }
      default: // idle
        return {
          y: 0,
          scale: isHovered ? 1.02 : 1,
          rotate: 0
        }
    }
  }

  const getEyeAnimations = (eyeIndex: number) => {
    const delay = eyeIndex * 0.1
    switch (mascotState) {
      case 'thinking':
        return {
          scale: [1, 1.1, 1],
          opacity: [1, 0.8, 1]
        }
      case 'typing':
        return {
          scale: [1, 1.05, 1],
          opacity: [1, 0.9, 1]
        }
      case 'excited':
        return {
          scale: [1, 1.15, 1],
          opacity: [1, 0.7, 1]
        }
      case 'curious':
        return {
          scale: [1, 1.08, 1],
          opacity: [1, 0.85, 1]
        }
      default:
        return {
          scale: 1,
          opacity: 1
        }
    }
  }

  const getPupilAnimations = (eyeIndex: number) => {
    const delay = eyeIndex * 0.1
    switch (mascotState) {
      case 'thinking':
        return {
          x: [0, 2, -2, 0],
          y: [0, -1, 1, 0]
        }
      case 'typing':
        return {
          x: [0, 1, -1, 0],
          y: [0, -0.5, 0.5, 0]
        }
      case 'excited':
        return {
          x: [0, 3, -3, 0],
          y: [0, -2, 2, 0]
        }
      case 'curious':
        return {
          x: [0, 1.5, -1.5, 0],
          y: [0, -1, 1, 0]
        }
      default:
        return {
          x: 0,
          y: 0
        }
    }
  }

  const getMouthAnimations = () => {
    switch (mascotState) {
      case 'thinking':
        return {
          scaleY: [1, 1.2, 1],
          scaleX: [1, 1.1, 1]
        }
      case 'typing':
        return {
          scaleY: [1, 1.1, 1],
          scaleX: [1, 1.05, 1]
        }
      case 'excited':
        return {
          scaleY: [1, 1.3, 1],
          scaleX: [1, 1.15, 1]
        }
      case 'curious':
        return {
          scaleY: [1, 1.15, 1],
          scaleX: [1, 1.08, 1]
        }
      default:
        return {
          scaleY: 1,
          scaleX: 1
        }
    }
  }

  const getPulseAnimations = () => {
    switch (mascotState) {
      case 'thinking':
        return {
          scale: [1, 1.3, 1],
          opacity: [0.4, 0, 0.4]
        }
      case 'typing':
        return {
          scale: [1, 1.2, 1],
          opacity: [0.3, 0, 0.3]
        }
      case 'excited':
        return {
          scale: [1, 1.4, 1],
          opacity: [0.5, 0, 0.5]
        }
      default:
        return {
          scale: [1, 1.1, 1],
          opacity: [0.2, 0, 0.2]
        }
    }
  }

  const handleClick = () => {
    if (mascotState === 'idle') {
      setMascotState('excited')
      setTimeout(() => setMascotState('idle'), 2000)
    }
  }

  return (
    <motion.div 
      className="mascot"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      animate={getStateAnimations()}
      transition={{
        y: {
          duration: mascotState === 'idle' ? 0.2 : 2,
          repeat: mascotState !== 'idle' ? Infinity : 0,
          ease: "easeInOut"
        },
        scale: {
          duration: 0.2,
          ease: "easeOut"
        },
        rotate: {
          duration: mascotState === 'idle' ? 0.2 : 3,
          repeat: mascotState !== 'idle' ? Infinity : 0,
          ease: "easeInOut"
        }
      }}
    >
      {/* Main mascot body */}
      <motion.div 
        className="mascot-body"
        style={{ background: gradient ? gradient : color }}
        animate={{}}
        transition={{
          duration: mascotState === 'excited' ? 0.5 : 0.3,
          repeat: mascotState === 'excited' ? 3 : 0,
          ease: "easeInOut"
        }}
      >
        {/* Eyes */}
        <div className="mascot-eyes">
          <motion.div 
            className="mascot-eye"
            animate={getEyeAnimations(0)}
            transition={{
              duration: 1,
              repeat: mascotState !== 'idle' ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            <motion.div 
              className="pupil"
              animate={getPupilAnimations(0)}
              transition={{
                duration: 3,
                repeat: mascotState !== 'idle' ? Infinity : 0,
                ease: "easeInOut"
              }}
            />
            <div className="eye-highlight" />
          </motion.div>
          
          <motion.div 
            className="mascot-eye"
            animate={getEyeAnimations(1)}
            transition={{
              duration: 1,
              repeat: mascotState !== 'idle' ? Infinity : 0,
              ease: "easeInOut",
              delay: 0.2
            }}
          >
            <motion.div 
              className="pupil"
              animate={getPupilAnimations(1)}
              transition={{
                duration: 3,
                repeat: mascotState !== 'idle' ? Infinity : 0,
                ease: "easeInOut",
                delay: 0.2
              }}
            />
            <div className="eye-highlight" />
          </motion.div>
        </div>

        {/* Mouth */}
        <motion.div 
          className="mascot-mouth"
          animate={getMouthAnimations()}
          transition={{
            duration: 0.8,
            repeat: mascotState !== 'idle' ? Infinity : 0,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Pulse ring effect */}
      <motion.div 
        className="mascot-pulse"
        animate={getPulseAnimations()}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut"
        }}
      />

      {/* State-specific particles */}
      {mascotState !== 'idle' && (
        <>
          <motion.div 
            className="particle"
            animate={{
              x: [0, 10, -10, 0],
              y: [0, -20, -10, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
          <motion.div 
            className="particle"
            animate={{
              x: [0, -8, 8, 0],
              y: [0, -15, -5, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeOut",
              delay: 1.5
            }}
          />
          {mascotState === 'excited' && (
            <motion.div 
              className="particle"
              animate={{
                x: [0, 12, -12, 0],
                y: [0, -25, -15, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.8
              }}
            />
          )}
        </>
      )}

      {/* State indicator */}
      <motion.div 
        className="mascot-state-indicator"
        animate={{
          opacity: mascotState !== 'idle' ? 1 : 0,
          scale: mascotState !== 'idle' ? 1 : 0.8
        }}
        transition={{ duration: 0.3 }}
      >
        {mascotState === 'thinking' && '🤔'}
        {mascotState === 'typing' && '💭'}
        {mascotState === 'excited' && '🎉'}
        {mascotState === 'curious' && '🤨'}
      </motion.div>
    </motion.div>
  )
}

export default Mascot 