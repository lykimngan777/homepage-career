document.addEventListener('DOMContentLoaded', () => {
    const quoteElement = document.getElementById('typewriter-quote');
    const quoteIconTop = document.querySelector('.quote-icon-top');
    const quoteIconBottom = document.querySelector('.quote-icon-bottom');
    const authorElement = document.querySelector('.author');
    const buttonWrapper = document.querySelector('.button-wrapper');
    const ctaButton = document.getElementById('cta-button');
    
    // Prepare text: split by words first to prevent mid-word line breaks
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
        
        // Add a space span after each word except the last one
        if (index < array.length - 1) {
            const space = document.createElement('span');
            space.className = 'char';
            space.textContent = '\u00A0'; // Non-breaking space
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
            quoteIconBottom.classList.add('visible');
            setTimeout(() => {
                authorElement.style.transition = 'opacity 2s ease';
                authorElement.style.opacity = '1';
            }, 500);
            
            setTimeout(() => {
                buttonWrapper.style.transition = 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
                buttonWrapper.style.opacity = '1';
                buttonWrapper.style.transform = 'translateY(0)';
            }, 1200);
        }
    }

    function charTypeDelay(char) {
        if (char === '\u00A0') return 80;
        if (char === ',' || char === '.') return 200;
        return typingSpeed + (Math.random() * 20);
    }

    setTimeout(() => {
        quoteIconTop.classList.add('visible');
        setTimeout(drawText, 1000);
    }, 500);

    // Interaction & Parallax
    ctaButton.addEventListener('click', () => {
        ctaButton.style.transform = 'scale(0.96)';
        setTimeout(() => {
            ctaButton.style.transform = '';
            alert('Hành trình bắt đầu! Hãy cùng khám phá sứ mệnh nghề nghiệp của chính bạn.');
        }, 150);
    });

    // Discovery Spotlight Effect: Mouse acts as a guiding light
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        
        // Update CSS variables for the radial spotlight
        document.body.style.setProperty('--mouse-x', `${x}%`);
        document.body.style.setProperty('--mouse-y', `${y}%`);
        
        // Subtly shift the container for a very light breathing feel
        const container = document.querySelector('.container');
        if (container) {
            const shiftX = (e.clientX / window.innerWidth - 0.5) * 5;
            const shiftY = (e.clientY / window.innerHeight - 0.5) * 5;
            container.style.transform = `translate(${shiftX}px, ${shiftY}px)`;
        }
    });
});
