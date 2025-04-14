$(document).ready(function () {

    $('#menu').click(function () {
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    $(window).on('scroll load', function () {
        $('#menu').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        // if (window.scrollY > 60) {
        //     document.querySelector('#scroll-top').classList.add('active');
        // } else {
        //     document.querySelector('#scroll-top').classList.remove('active');
        // }

        // scroll spy
        $('section').each(function () {
            let height = $(this).height();
            let offset = $(this).offset().top - 200;
            let top = $(window).scrollTop();
            let id = $(this).attr('id');

            if (top > offset && top < offset + height) {
                $('.navbar ul li a').removeClass('active');
                $('.navbar').find(`[href="#${id}"]`).addClass('active');
            }
        });
    });

    // smooth scrolling
    $('a[href*="#"]').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top,
        }, 500, 'linear')
    });

    // <!-- emailjs to mail contact form data -->
    $("#contact-form").submit(function (event) {
        emailjs.init("TQkN3WRDsuzModKfv");

        emailjs.sendForm('service_27hxw0p', 'template_74y6axr', '#contact-form')
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
                document.getElementById("contact-form").reset();
                alert("Form Submitted Successfully");
            }, function (error) {
                console.log('FAILED...', error);
                alert("Form Submission Failed! Try Again");
            });
        event.preventDefault();
    });
    // <!-- emailjs to mail contact form data -->

});

document.addEventListener('visibilitychange',
    function () {
        if (document.visibilityState === "visible") {
            document.title = "Portfolio | Rysul ";
            $("#favicon").attr("href", "assets/images/favicon.png");
        }
        else {
            document.title = "Hi Rysul is here";
            $("#favicon").attr("href", "assets/images/favhand.png");
        }
    });


// Change the typing text to reflect your interests
var typed = new Typed('.typing-text', {
  strings: ['Environmental Research', 'GIS Analysis', 'Renewable Energy', 'Data Science', 'Sustainable Solutions', 'Climate Policy'],
  typeSpeed: 50,
  loop: true
});
// <!-- typed js effect ends -->

async function fetchData(type = "skills") {
    let response
    type === "skills" ?
        response = await fetch("skills.json")
        :
        response = await fetch("./projects.json")
    const data = await response.json();
    return data;
}

function showSkills(skills) {
    let skillsContainer = document.getElementById("skillsContainer");
    let skillHTML = "";
    skills.forEach(skill => {
        skillHTML += `
        <div class="bar">
              <div class="info">
                <img src=${skill.icon} alt="skill" />
                <span>${skill.name}</span>
              </div>
            </div>`
    });
    skillsContainer.innerHTML = skillHTML;
}


fetchData().then(data => {
    showSkills(data);
});

function showProjects(projects) {
    let projectsContainer = document.querySelector("#work .box-container");
    let projectHTML = "";
    projects.slice(0, 10).filter(project => project.category != "android").forEach(project => {
        // Get file extension
        const fileExt = project.image.split('.').pop().toLowerCase();
        const isGif = fileExt === 'gif';
        
        projectHTML += `
        <div class="box tilt">
        <img draggable="false" 
            src="./assets/images/projects/${project.image}" 
            alt="${project.image}"
            />
        <div class="content">
        <div class="tag">
        <h3>${project.name}</h3>
        </div>
        <div class="desc">
          <p>${project.desc}</p>
          <div class="btns">
            <a href="${project.links.live}" class="btn" target="_blank"><i class="fas fa-eye"></i> View</a>
          </div>
        </div>
      </div>
    </div>`
    });
    projectsContainer.innerHTML = projectHTML;

    // <!-- tilt js effect starts -->
    VanillaTilt.init(document.querySelectorAll(".tilt"), {
        max: 15,
    });
    // <!-- tilt js effect ends -->

}

fetchData("projects").then(data => {
    showProjects(data);
});


// <!-- contact section starts -->
// document.addEventListener('DOMContentLoaded', () => {
//     const form = document.getElementById('contact-form');
    
//     form.addEventListener('submit', function(event) {
//         event.preventDefault(); // Prevent the default form submission
        
//         // Retrieve form data
//         const name = form.querySelector('input[name="name"]').value;
//         const email = form.querySelector('input[name="email"]').value;
//         const phone = form.querySelector('input[name="phone"]').value;
//         const message = form.querySelector('textarea[name="message"]').value;

//         // Simple validation (you can enhance this)
//         if (!name || !email || !message) {
//             alert('Please fill in all required fields.');
//             return;
//         }

//         // Create a data object (you might want to send this to a server)
//         const formData = {
//             name: name,
//             email: email,
//             phone: phone,
//             message: message
//         };

//         console.log('Form submitted with data:', formData);
        
//         // Simulate form submission
//         // You might replace this with actual code to send data to a server
//         alert('Thank you for your message!');

//         // Clear the form fields (optional)
//         form.reset();
//     });
// });

// <!-- contact section ends -->


/* ===== SCROLL REVEAL ANIMATION ===== */
const srtop = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 1000,
    reset: true
});

// Dark mode toggle functionality
const toggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Check local storage or system preference
if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && prefersDarkScheme.matches)) {
  document.body.classList.add('dark-theme');
  toggle.innerHTML = '<i class="fas fa-sun"></i>';
}
