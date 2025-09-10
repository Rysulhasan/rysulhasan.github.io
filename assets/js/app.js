/* -----------------------------------------------
/* How to use? : Check the GitHub README
/* ----------------------------------------------- */

/* To load a config file (particles.json) you need to host this demo (MAMP/WAMP/local)... */
/*
particlesJS.load('particles-js', 'particles.json', function() {
  console.log('particles.js loaded - callback');
});
*/

/* Otherwise just put the config content (json): */

particlesJS('particles-js',
  
  {
    "particles": {
      "number": {
        "value": 90,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#ffffff"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 1,
          "color": "#000000"
        },
        "polygon": {
          "nb_sides": 5
        },
        "image": {
          "src": "img/github.svg",
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 0.7,
        "random": false,
        "anim": {
          "enable": false,
          "speed": 1,
          "opacity_min": 0.4,
          "sync": false
        }
      },
      "size": {
        "value": 5,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 40,
          "size_min": 0.2,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#ffffff",
        "opacity": 0.6,
        "width": 1.3
      },
      "move": {
        "enable": true,
        "speed": 6,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "repulse"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 200,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 200,
          "size": 40,
          "duration": 2,
          "opacity": 8,
          "speed": 3
        },
        "repulse": {
          "distance": 100
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true,
    "config_demo": {
      "hide_card": false,
      "background_color": "#000000",
      "background_image": "",
      "background_position": "50% 50%",
      "background_repeat": "no-repeat",
      "background_size": "cover"
    }
  }

);

// Add chemical labels manually since particles.js doesn't support them natively
document.addEventListener('DOMContentLoaded', function() {
  const chemicals = [  "H₂O", "O₂", "CO₂", "N₂",    "CH₄",    "NH₃",    "H₂",    "NO₂",    "SO₂",    "10m/s",    "5m/s",
    "20°C",    "1atm", "θ", "η", "ω", "λ", "∛", "f(x)", "♁", ];
  const container = document.getElementById('particles-js');
  
  function createLabel() {
    const label = document.createElement('div');
    label.className = 'chemical-label';
    label.textContent = chemicals[Math.floor(Math.random() * chemicals.length)];
    
    // Random position
    label.style.left = Math.random() * 100 + '%';
    label.style.top = Math.random() * 100 + '%';
    
    // Random size and color
    label.style.fontSize = (12 + Math.random() * 8) + 'px';
    label.style.color = `hsla(${Math.random() * 360}, 70%, 70%, 0.8)`;
    
    container.appendChild(label);
    
    // Fade in and out animation
    label.animate([
      { opacity: 0 },
      { opacity: 0.95 },
      { opacity: 0 }
    ], {
      duration: 2000 + Math.random() * 3000,
      easing: 'ease-in-out'
    }).onfinish = () => {
      label.remove();
      setTimeout(createLabel, Math.random() * 3000);
    };
  }
  
  // Create initial labels
  for (let i = 0; i < 30; i++) {
    setTimeout(createLabel, Math.random() * 3000);
  }
});