document.addEventListener('DOMContentLoaded', () => {
    const quoteElement = document.getElementById('typewriter-quote');
    const quoteIconTop = document.querySelector('.quote-icon-top');
    const quoteIconBottom = document.querySelector('.quote-icon-bottom');
    const authorElement = document.querySelector('.author');
    const buttonWrapper = document.querySelector('.button-wrapper');
    const ctaButton = document.getElementById('cta-button');
    const featuresSection = document.getElementById('features');
    const stepsSection = document.getElementById('steps');
    const stepCards = document.querySelectorAll('.step-card');
    
    // Preparation
    const textToType = quoteElement.getAttribute('data-text');
    quoteElement.innerHTML = '';
    
    textToType.split(' ').forEach((word, index, array) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word';
        word.split('').forEach(char => {
            const charSpan = document.createElement('span');
            charSpan.className = 'char';
            charSpan.textContent = char;
            wordSpan.appendChild(charSpan);
        });
        quoteElement.appendChild(wordSpan);
        if (index < array.length - 1) {
            const space = document.createElement('span');
            space.className = 'char';
            space.textContent = '\u00A0';
            quoteElement.appendChild(space);
        }
    });

    const characters = quoteElement.querySelectorAll('.char');
    let currentIndex = 0;
    const typingSpeed = 30; 

    function drawText() {
        if (currentIndex < characters.length) {
            characters[currentIndex].classList.add('visible');
            currentIndex++;
            setTimeout(drawText, charTypeDelay(characters[currentIndex-1].textContent));
        } else {
            // FINISHED DRAWING
            quoteIconBottom.classList.add('visible');
            setTimeout(() => {
                // Show Author
                authorElement.style.opacity = '1';
                authorElement.style.transform = 'translateY(0)';
                
                // Show Button
                buttonWrapper.style.transition = 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
                buttonWrapper.style.opacity = '1';
                buttonWrapper.style.transform = 'translateY(0)';

                // UNLOCK SCROLL & SHOW FEATURES
                document.body.style.overflowY = 'auto';
                if (featuresSection) {
                    featuresSection.classList.add('visible');
                }
                if (stepsSection) {
                    stepsSection.style.opacity = '1';
                    stepsSection.style.transform = 'translateY(0)';
                }
            }, 600);
        }
    }

    function charTypeDelay(char) {
        if (char === '\u00A0') return 80;
        if (char === ',' || char === '.') return 200;
        return typingSpeed + (Math.random() * 20);
    }

    // Start Sequence
    setTimeout(() => {
        quoteIconTop.classList.add('visible');
        setTimeout(drawText, 800);
    }, 400);

    // Mouse Tracking Effect
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        document.body.style.setProperty('--mouse-x', `${x}%`);
        document.body.style.setProperty('--mouse-y', `${y}%`);
        
        const quoteWrapper = document.querySelector('.quote-wrapper');
        if (quoteWrapper) {
            const shiftX = (e.clientX / window.innerWidth - 0.5) * 10;
            const shiftY = (e.clientY / window.innerHeight - 0.5) * 10;
            quoteWrapper.style.transform = `translate(${shiftX}px, ${shiftY}px)`;
        }
    });

    // Step Cards Animation on Scroll
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    stepCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.2}s`;
        cardObserver.observe(card);
    });
});
