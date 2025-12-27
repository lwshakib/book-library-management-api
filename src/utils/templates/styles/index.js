export const commonStyles = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              primary: {
                50: '#f5f3ff',
                100: '#ede9fe',
                200: '#ddd6fe',
                300: '#c4b5fd',
                400: '#a78bfa',
                500: '#8b5cf6',
                600: '#7c3aed',
                700: '#6d28d9',
                800: '#5b21b6',
                900: '#4c1d95',
              }
            },
            fontFamily: {
              sans: ['Inter', 'system-ui', 'sans-serif'],
            },
          }
        }
      }
    </script>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.8;
        }
      }
      
      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      .animate-fade-in-up {
        animation: fadeInUp 0.6s ease-out;
      }
      
      .animate-pulse-slow {
        animation: pulse 3s ease-in-out infinite;
      }
      
      .animate-slide-in-right {
        animation: slideInRight 0.5s ease-out;
      }
      
      .gradient-bg {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      
      .gradient-text {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .glass-effect {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
      
      .shadow-glow {
        box-shadow: 0 0 30px rgba(139, 92, 246, 0.3);
      }
      
      /* Email client compatibility */
      table {
        border-collapse: collapse;
        width: 100%;
      }
      
      img {
        border: 0;
        display: block;
        outline: none;
        text-decoration: none;
      }
    </style>
  </head>
`;

export const initLucideIcons = `
  <script>
    // Initialize Lucide icons after DOM is loaded
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  </script>
`;

export const gsapAnimations = `
  <script>
    // GSAP animations
    if (typeof gsap !== 'undefined') {
      gsap.from('.animate-header', {
        duration: 1,
        y: -50,
        opacity: 0,
        ease: 'power3.out'
      });
      
      gsap.from('.animate-content', {
        duration: 0.8,
        y: 30,
        opacity: 0,
        delay: 0.3,
        stagger: 0.1,
        ease: 'power2.out'
      });
      
      gsap.from('.animate-icon', {
        duration: 0.6,
        scale: 0,
        rotation: 180,
        delay: 0.5,
        ease: 'back.out(1.7)'
      });
    }
  </script>
`;
