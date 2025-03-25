import { StickyNote2 } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion'; // Import motion from framer-motion

export default function Logo() {
  const letterAnimation = {
    initial: { opacity: 0, y: 20 }, // Start with opacity 0 and slightly below
    animate: { opacity: 1, y: 0 }, // Fade in and slide up
    transition: { duration: 0.05 }, // Smooth transition
  };

  const backgroundAnimation = {
    initial: {
      opacity: 0,
      backgroundPosition: "0px -40px",
      boxShadow: "0px 0px 20px 20px rgba(0, 0, 0, 0.3) inset",
    },
    animate: {
      opacity: 1,
      backgroundPosition: "0px -45px",
      boxShadow: "0px 0px 20px 20px rgba(0, 0, 0, 0.5) inset",
    },
    transition: { duration: 1 },
  };

  const hoverAnimation = {
    boxShadow: "0px 0px 10px 10px rgba(0, 0, 0, 0.2) inset", // Decrease the box shadow on hover
  };

  const letterHoverAnimation = {
    y: [-5, 5, 0], // Move the letter slightly upward
    transition: {
   //     ease: "linear",
      duration: 0.25
    }
  };

  const timeBetweenLetters = 0.1;

  return (
    <motion.div
      style={{
        paddingTop: 20,
        textAlign: "center",
        color: "black",
        backgroundImage: "url(/ai-is-here/OC_AI.png)",
        backgroundSize: "cover",
        backgroundPosition: "0px -40px",
        borderRadius: 5,
      }}
      initial={backgroundAnimation.initial}
      animate={backgroundAnimation.animate}
      transition={backgroundAnimation.transition}
      whileHover={hoverAnimation} // Add hover animation
    >
      <Typography
        style={{
          fontSize: "6em",
          fontFamily: "Arial",
        }}
        component="h1"
        variant="h2"
      >
        <Stack
          style={{
            color: "white",
            textShadow: "black 2px 5px 5px",
          }}
          direction="row"
          spacing={1}
          justifyContent="center"
          alignItems={"center"}
        >
          <motion.span
            {...letterAnimation}
            transition={{ delay: timeBetweenLetters * 1 }}
            whileHover={letterHoverAnimation} // Add hover animation for the letter
          >
            A
          </motion.span>
          <motion.span
            {...letterAnimation}
            transition={{ delay: timeBetweenLetters * 2 }}
            whileHover={letterHoverAnimation} // Add hover animation for the letter
          >
            I
          </motion.span>
          <motion.span
            style={{
              fontFamily: "Arial",
              fontSize: ".5em",
              padding: "0px 10px 0px 10px",
            }}
            {...letterAnimation}
            transition={{ delay: timeBetweenLetters * 6 }}
            whileHover={letterHoverAnimation} // Add hover animation for the letter
          >
            @
          </motion.span>
          <motion.span
            {...letterAnimation}
            transition={{ delay: timeBetweenLetters * 4 }}
            whileHover={letterHoverAnimation} // Add hover animation for the letter
          >
            O
          </motion.span>
          <motion.span
            {...letterAnimation}
            transition={{ delay: timeBetweenLetters * 5 }}
            whileHover={letterHoverAnimation} // Add hover animation for the letter
          >
            C
          </motion.span>
        </Stack>
      </Typography>
    </motion.div>
  );
}