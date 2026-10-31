/*----------theme js-----------------*/

/*====================================
01. Mobile Menu js
02. Header Search js
03. sticky
04. Loder 
05. counterUp
06. wow js
07. sidebar
08. room-suites-active
09. facilities-active 
10. suites-classic-active
11. testimonial-active
12. brand js
13. testimonial-active
14. gallary-active
15. dine-list js
16. Image Reveal Animation
17. Video Modal cursor
18. Text Effect Animation
19. Section title Js
20. Parallaxie js
21. Popup Video 
22. section border animation
23. Image Hover Effect
24. preloader js
25. Portfolio Isotope 
26. panel scrool
=====================================*/


(function ($) {
    'use strict';
    var $window = $(window); 
	var $body = $('body'); 

    // Mobile Menu js
    $('.mobile-menu nav').meanmenu({
        meanScreenWidth: "991",
        meanMenuContainer: ".mobile-menu",
        meanMenuOpen: "<span></span> <span></span> <span></span>",
        onePage: false,
    });

    //Header Search js
    if($('.search-box-outer').length) {
        $('.search-box-outer').on('click', function() {
            $('body').addClass('search-active');
        });
        $('.close-search').on('click', function() {
            $('body').removeClass('search-active');
        });
    }

    // sticky
    var wind = $(window);
    var sticky = $('#sticky-header');
    wind.on('scroll', function () {
        var scroll = wind.scrollTop();
        if (scroll < 100) {
            sticky.removeClass('sticky');
        } else {
            sticky.addClass('sticky');
        }
    });

    // Loder  //
	if($('.preloader').length){
			$('.preloader').delay(200).fadeOut(500);
		}

    // counterUp
    $('.counter').counterUp({
        delay: 10,
        time: 1000
    });

    // Data backgrond image
        $("[data-background]").each(function() {
        $(this).css("background-image", "url(" + $(this).attr("data-background") + ")");
        });


    /*---------------------
    WOW active js 
    --------------------- */
    new WOW().init();


    // scroll btn
    if($('.prgoress_indicator path').length){
        var progressPath = document.querySelector('.prgoress_indicator path');
        var pathLength = progressPath.getTotalLength();
        progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
        progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
        progressPath.style.strokeDashoffset = pathLength;
        progressPath.getBoundingClientRect();
        progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';
        var updateProgress = function () {
          var scroll = $(window).scrollTop();
          var height = $(document).height() - $(window).height();
          var progress = pathLength - (scroll * pathLength / height);
          progressPath.style.strokeDashoffset = progress;
        }
        updateProgress();
        $(window).on('scroll', updateProgress);
        var offset = 250;
        var duration = 550;
        jQuery(window).on('scroll', function () {
          if (jQuery(this).scrollTop() > offset) {
            jQuery('.prgoress_indicator').addClass('active-progress');
          } else {
            jQuery('.prgoress_indicator').removeClass('active-progress');
          }
        });
        jQuery('.prgoress_indicator').on('click', function (event) {
          event.preventDefault();
          jQuery('html, body').animate({ scrollTop: 0 }, duration);
          return false;
        });
    }

    /* Image Reveal Animation */
	if ($('.reveal').length) {
        gsap.registerPlugin(ScrollTrigger);
        let revealContainers = document.querySelectorAll(".reveal");
        revealContainers.forEach((container) => {
            let image = container.querySelector("img");
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    toggleActions: "play none none none"
                }
            });
            tl.set(container, {
                autoAlpha: 1
            });
            tl.from(container, 1, {
                xPercent: -100,
                ease: Power2.out
            });
            tl.from(image, 1, {
                xPercent: 100,
                scale: 1,
                delay: -1,
                ease: Power2.out
            });
        });
    }

    /* Text Effect Animation */
	function initHeadingAnimation() {
		
		if($('.text-effect').length) {
			var textheading = $(".text-effect");

			if(textheading.length === 0) return; gsap.registerPlugin(SplitText); textheading.each(function(index, el) {
				
				el.split = new SplitText(el, { 
					type: "lines,words,chars",
					linesClass: "split-line"
				});
				
				if( $(el).hasClass('text-effect') ){
					gsap.set(el.split.chars, {
						opacity: .3,
						x: "-7",
					});
				}
				el.anim = gsap.to(el.split.chars, {
					scrollTrigger: {
						trigger: el,
						start: "top 92%",
						end: "top 60%",
						markers: false,
						scrub: 1,
					},

					x: "0",
					y: "0",
					opacity: 1,
					duration: .7,
					stagger: 0.2,
				});
				
			});
		}
		
		if ($('.text-anime-1').length) {
			let staggerAmount 	= 0.05,
				translateXValue = 0,
				delayValue 		= 0.5,
			   animatedTextElements = document.querySelectorAll('.text-anime-1');
			
			animatedTextElements.forEach((element) => {
				let animationSplitText = new SplitText(element, { type: "chars, words" });
					gsap.from(animationSplitText.words, {
					duration: 1,
					delay: delayValue,
					x: 20,
					autoAlpha: 0,
					stagger: staggerAmount,
					scrollTrigger: { trigger: element, start: "top 85%" },
					});
			});		
		}
		
		if ($('.text-anime-2').length) {				
			let	 staggerAmount 		= 0.03,
				translateXValue	= 20,
				delayValue 		= 0.1,
				easeType 			= "power2.out",
				animatedTextElements = document.querySelectorAll('.text-anime-2');
			
			animatedTextElements.forEach((element) => {
				let animationSplitText = new SplitText(element, { type: "chars, words" });
					gsap.from(animationSplitText.chars, {
						duration: 1,
						delay: delayValue,
						x: translateXValue,
						autoAlpha: 0,
						stagger: staggerAmount,
						ease: easeType,
						scrollTrigger: { trigger: element, start: "top 85%"},
					});
			});		
		}
		
		if ($('.text-anime-3').length) {		
			let	animatedTextElements = document.querySelectorAll('.text-anime-3');
			
			 animatedTextElements.forEach((element) => {
				//Reset if needed
				if (element.animation) {
					element.animation.progress(1).kill();
					element.split.revert();
				}

				element.split = new SplitText(element, {
					type: "lines,words,chars",
					linesClass: "split-line",
				});
				gsap.set(element, { perspective: 400 });

				gsap.set(element.split.chars, {
					opacity: 0,
					x: "50",
				});

				element.animation = gsap.to(element.split.chars, {
					scrollTrigger: { trigger: element,	start: "top 90%" },
					x: "0",
					y: "0",
					rotateX: "0",
					opacity: 1,
					duration: 1,
					ease: Back.easeOut,
					stagger: 0.02,
				});
			});		
		}
	}
	
	if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            initHeadingAnimation();
        });
    } else {
        window.addEventListener("load", initHeadingAnimation);
    }

     // Section title Js
    if ($(window).width() > 576 && $(".char-animation").length > 0) {
        let char_come = gsap.utils.toArray(".char-animation");
        char_come.forEach(splitTextLine => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: splitTextLine,
                    start: "top 90%",
                    end: "bottom 60%",
                    scrub: false,
                    markers: false,
                    toggleActions: "play none none none",
                },
            });

            const itemSplitted = new SplitText(splitTextLine, {
                type: "chars, words",
            });
            gsap.set(splitTextLine, {
                perspective: 300
            });
            itemSplitted.split({
                type: "chars, words"
            });
            tl.from(itemSplitted.chars, {
                duration: 1,
                delay: 0.5,
                x: 100,
                autoAlpha: 0,
                stagger: 0.05,
            });
        });
    }

    //Title anim
    let splitTitleLines = gsap.utils.toArray(".title-anim");

    splitTitleLines.forEach(splitTextLine => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: splitTextLine,
          start: 'top 90%',
          end: 'bottom 60%',
          scrub: false,
          markers: false,
          toggleActions: 'play none none none'
        }
      });

      const itemSplitted = new SplitText(splitTextLine, { type: "words, lines" });
      gsap.set(splitTextLine, { perspective: 400 });
      itemSplitted.split({ type: "lines" })
      tl.from(itemSplitted.lines, { duration: 1, delay: 0.3, opacity: 0, rotationX: -80, force3D: true, transformOrigin: "top center -50", stagger: 0.1 });
    });

	/* Parallaxie js */
	var $parallaxie = $('.parallaxie');
	if($parallaxie.length && ($window.width() > 991))
	{
		if ($window.width() > 768) {
			$parallaxie.parallaxie({
				speed: 0.55,
				offset: 0,
			});
		}
	}

	// 45. tp-hero-md-col-custom
	$('.hztab__item').on('mouseenter', function () {
		$(this).addClass('active').siblings().removeClass('active');
	})

	

    /* Popup Video */
	if ($('.popup-video').length) {
		$('.popup-video').magnificPopup({
			type: 'iframe',
			mainClass: 'mfp-fade',
			removalDelay: 160,
			preloader: false,
			fixedContentPos: true
		});
	}

	/* Image Hover Effect js */
	const dataItemHover = () =>{
		const initHoverEffect = (container, images) => {
			const hoverInstance = new hoverEffect({
				parent: container.get(0),
				intensity: container.data("intensity") || undefined,
				speedIn: container.data("speedin") || undefined,
				speedOut: container.data("speedout") || undefined,
				easing: container.data("easing") || undefined,
				hover: container.data("hover") || undefined,
				image1: images.eq(0).attr("src"),
				image2: images.eq(0).attr("src"),
				displacementImage: "assets/images/demo-image/image-effect.jpg",
				imagesRatio:  images[0].width / images[0].height,
				hover: false
			});
			
			container.closest(".data-item-hover")
				.on("mouseenter", () => hoverInstance.next())
				.on("mouseleave", () => hoverInstance.previous());
		};

		const setupHoverAnimations = () => {
			$(".data-img-hover").each(function () {
				const currentContainer = $(this);
				const imageElements = currentContainer.find("img");
				const firstImage = imageElements.eq(0);

				if (firstImage[0].complete) {
					initHoverEffect(currentContainer, imageElements);
				} else {
					firstImage.on("load", () => {
						initHoverEffect(currentContainer, imageElements);
					});
				}
			});
		};

		setupHoverAnimations();
	}

	// Call this function when page loads
	document.addEventListener("DOMContentLoaded", () => {
		dataItemHover();
	});
	/* Image Hover Effect End */

    // panel scrool
    window.addEventListener("load", () => {
	gsap.registerPlugin(ScrollTrigger);

	const width = window.innerWidth;
	const panels = gsap.utils.toArray(".panel-item");

	const endEl = document.querySelector(".panel-area");
	if (!endEl) {
		return;
	}

	panels.forEach((panel, i) => {
		gsap.set(panel, { zIndex: i });

		ScrollTrigger.create({
		trigger: panel,
		start: "top 10%",
		end:
			width >= 1600
			? "bottom 90%"
			: width >= 1400
			? "bottom 160%"
			: "bottom 170%",
		endTrigger: endEl,
		pin: true,
		pinSpacing: false,
		scrub: 1,
		markers: false,
		});
	});
	});

    
	// service-item
	document.addEventListener("DOMContentLoaded", function () {
		let serviceItems = document.querySelectorAll(".process-item");
		let images = document.querySelectorAll(".hover-image");

		// initial state
		gsap.set(images, { opacity: 0, y: 50, scale: 1 });
		gsap.set(images[0], { opacity: 1, y: 0, zIndex: 2 }); 

		serviceItems.forEach((item, index) => {
			item.addEventListener("mouseenter", function () {
				serviceItems.forEach((el) => el.classList.remove("active"));
				this.classList.add("active");
				images.forEach((img, i) => {
					if (i === index) {
						gsap.to(img, {
							opacity: 1,
							y: 0,
							scale: 1,
							duration: 0.8,
							scrub: 1,
							zIndex: 2,
						});
					} else {
						gsap.to(img, {
							opacity: 0,
							y: 200,
							duration: 0.8,
							zIndex: 1,
							scale: .8,
						});
					}
				});
			});
		});
	});

	// project thumb animation
	gsap.registerPlugin(ScrollTrigger);

	gsap.utils.toArray(".single-project-box").forEach(box => {

	const tl = gsap.timeline({
		scrollTrigger:{
		trigger: box,
		start: "top 75%",
		end: "bottom 40%",
		toggleActions: "play none none reverse"
		}
	});

	tl.addLabel("start");

	tl.to(box.querySelectorAll(".uncover_slice"), {
		height: 0,
		duration: 1,
		ease: "power4.inOut",
		stagger: { amount: 0.33 }
	}, "start")

	.to(box.querySelector(".myimg"), {
		scale: 1.3,
		duration: 1.2,
		ease: "power4.inOut"
	}, "start");

	});

	
	// =======< accordion js >========
    jQuery(document).ready(function ($) {
      "use strict";

      $(".accordion > li:eq(0) a").addClass("active").next().slideDown();
      $(".accordion a").on("click", function (j) {
        let dropDown = $(this).closest("li").find("p");

        $(this).closest(".accordion").find("p").not(dropDown).slideUp();

        if ($(this).hasClass("active")) {
          $(this).removeClass("active");
        } else {
          $(this).closest(".accordion").find("a.active").removeClass("active");
          $(this).addClass("active");
        }

        dropDown.stop(false, true).slideToggle();

        j.preventDefault();
      });
    });

    jQuery(document).ready(function ($) {
      "use strict";

      $(".accordion2 > li:eq(0) a").addClass("active").next().slideDown();
      $(".accordion2 a").on("click", function (j) {
        let dropDown = $(this).closest("li").find("p");

        $(this).closest(".accordion2").find("p").not(dropDown).slideUp();

        if ($(this).hasClass("active")) {
          $(this).removeClass("active");
        } else {
          $(this).closest(".accordion2").find("a.active").removeClass("active");
          $(this).addClass("active");
        }

        dropDown.stop(false, true).slideToggle();

        j.preventDefault();
      });
    });


                           
})(jQuery);




