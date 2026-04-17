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
    if (quoteElement) {
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
    }

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

    // --- ASSESSMENT LOGIC ---
    const assessmentOverlay = document.getElementById('assessment-overlay');
    const resultsOverlay = document.getElementById('results-overlay');
    const startBtn = document.getElementById('start-assessment');
    const closeBtn = document.getElementById('close-assessment');
    const progressFill = document.getElementById('progress-fill');
    const questionContainer = document.getElementById('question-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const restartBtn = document.getElementById('restart-assessment');

    const questions = [
        // RIASEC
        { model: 'RIASEC', type: 'Realistic', text: 'Tôi thích làm việc với máy móc, công cụ hoặc các hoạt động ngoài trời.' },
        { model: 'RIASEC', type: 'Investigative', text: 'Tôi thích quan sát, học hỏi, điều tra và giải quyết các vấn đề phức tạp.' },
        { model: 'RIASEC', type: 'Artistic', text: 'Tôi thích các hoạt động sáng tạo, nghệ thuật, âm nhạc và viết lách.' },
        { model: 'RIASEC', type: 'Social', text: 'Tôi thích giúp đỡ, giảng dạy, tư vấn hoặc chăm sóc người khác.' },
        { model: 'RIASEC', type: 'Enterprising', text: 'Tôi thích thuyết phục, dẫn dắt người khác và quản lý công việc kinh doanh.' },
        { model: 'RIASEC', type: 'Conventional', text: 'Tôi thích làm việc với dữ liệu, con số, sắp xếp thông tin ngăn nắp.' },
        
        // BIG FIVE
        { model: 'BigFive', type: 'Openness', text: 'Tôi luôn tò mò về thế giới và thích thử những trải nghiệm mới lạ.' },
        { model: 'BigFive', type: 'Conscientiousness', text: 'Tôi là người làm việc có kế hoạch, kỷ luật và luôn hoàn thành mục tiêu.' },
        { model: 'BigFive', type: 'Extraversion', text: 'Tôi cảm thấy tràn đầy năng lượng khi được giao tiếp và ở bên cạnh mọi người.' },
        { model: 'BigFive', type: 'Agreeableness', text: 'Tôi luôn cố gắng thấu hiểu và tin tưởng vào sự tử tế của người khác.' },
        { model: 'BigFive', type: 'Neuroticism', text: 'Tôi thường cảm thấy lo lắng hoặc dễ bị ảnh hưởng bởi áp lực trong cuộc sống.' },

        // SCHWARTZ
        { model: 'Schwartz', type: 'Self-Direction', text: 'Tự do tư duy và hành động là điều cực kỳ quan trọng đối với tôi.' },
        { model: 'Schwartz', type: 'Benevolence', text: 'Tôi luôn ưu tiên lợi ích của những người thân thiết và cộng đồng xung quanh.' },
        { model: 'Schwartz', type: 'Achievement', text: 'Việc đạt được thành công và thể hiện năng lực cá nhân là mục tiêu lớn của tôi.' },
        { model: 'Schwartz', type: 'Universalism', text: 'Sự công bằng xã hội và bảo vệ môi trường là những giá trị tôi trân trọng.' }
    ];

    let currentQuestionIndex = 0;
    let userAnswers = {};

    function initAssessment() {
        currentQuestionIndex = 0;
        userAnswers = {};
        showQuestion();
    }

    function showQuestion() {
        if (!questions[currentQuestionIndex]) return;
        const q = questions[currentQuestionIndex];
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        if (progressFill) progressFill.style.width = `${progress}%`;

        if (questionContainer) {
            questionContainer.innerHTML = `
                <div class="question-fade">
                    <span class="model-tag">${q.model}</span>
                    <h2 class="question-text">${q.text}</h2>
                    <div class="options-group">
                        ${[1, 2, 3, 4, 5].map(val => `
                            <div class="option-item ${userAnswers[currentQuestionIndex] === val ? 'selected' : ''}" data-value="${val}">
                                <div class="option-circle">${val}</div>
                                <span class="option-label">${getLabel(val)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            // Add event listeners to options
            questionContainer.querySelectorAll('.option-item').forEach(item => {
                item.addEventListener('click', () => {
                    const val = parseInt(item.getAttribute('data-value'));
                    userAnswers[currentQuestionIndex] = val;
                    
                    // Visual feedback
                    questionContainer.querySelectorAll('.option-item').forEach(i => i.classList.remove('selected'));
                    item.classList.add('selected');

                    // Auto next after selection
                    setTimeout(() => {
                        if (currentQuestionIndex < questions.length - 1) {
                            currentQuestionIndex++;
                            showQuestion();
                        }
                    }, 300);
                });
            });
        }

        if (prevBtn) prevBtn.disabled = currentQuestionIndex === 0;
        if (nextBtn) nextBtn.textContent = currentQuestionIndex === questions.length - 1 ? 'Xem kết quả' : 'Tiếp theo';
    }

    function getLabel(val) {
        const labels = ['Rất không đồng ý', 'Không đồng ý', 'Trung lập', 'Đồng ý', 'Rất đồng ý'];
        return labels[val - 1];
    }

    if (startBtn) {
        startBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (assessmentOverlay) assessmentOverlay.classList.add('active');
            initAssessment();
        });
    }

    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (assessmentOverlay) assessmentOverlay.classList.add('active');
            initAssessment();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (assessmentOverlay) assessmentOverlay.classList.remove('active');
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                showQuestion();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (userAnswers[currentQuestionIndex] === undefined) {
                alert('Vui lòng chọn một câu trả lời trước khi tiếp tục.');
                return;
            }

            if (currentQuestionIndex < questions.length - 1) {
                currentQuestionIndex++;
                showQuestion();
            } else {
                showResults();
            }
        });
    }

    function showResults() {
        if (assessmentOverlay) assessmentOverlay.classList.remove('active');
        if (resultsOverlay) resultsOverlay.classList.add('active');

        // Process scores
        const scores = { RIASEC: {}, BigFive: {}, Schwartz: {} };
        questions.forEach((q, index) => {
            const score = userAnswers[index] || 3;
            scores[q.model][q.type] = score;
        });

        renderChart('riasec-chart', scores.RIASEC);
        renderChart('bigfive-chart', scores.BigFive);
        renderChart('schwartz-chart', scores.Schwartz);
    }

    function renderChart(containerId, data) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        
        const maxVal = 5;
        Object.entries(data).forEach(([key, val]) => {
            const percentage = (val / maxVal) * 100;
            const barWrapper = document.createElement('div');
            barWrapper.className = 'chart-bar-wrapper';
            barWrapper.innerHTML = `
                <div class="chart-bar" style="height: 0%">
                    <span class="chart-bar-value">${val}</span>
                </div>
                <span class="chart-bar-label">${key}</span>
            `;
            container.appendChild(barWrapper);

            // Animate after append
            setTimeout(() => {
                const bar = barWrapper.querySelector('.chart-bar');
                if (bar) bar.style.height = `${percentage}%`;
            }, 100);
        });
    }

    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            if (resultsOverlay) resultsOverlay.classList.remove('active');
            if (assessmentOverlay) assessmentOverlay.classList.add('active');
            initAssessment();
        });
    }
});