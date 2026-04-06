import type { Category } from "./types";

export interface CategorySeoContent {
  intro: string;
  sampleTopics: string[];
  faqs: { question: string; answer: string }[];
}

export const categorySeoContent: Record<Category, CategorySeoContent> = {
  science: {
    intro:
      "Science topics spark curiosity and critical thinking by exploring the natural world through observation, experimentation, and evidence-based reasoning. From quantum mechanics to evolutionary biology, science discussion topics challenge us to question assumptions and discover how the universe really works. Whether you are preparing for a classroom debate or looking for a thought-provoking conversation starter, science topics offer endless depth and fascination.",
    sampleTopics: [
      "If you could fund one scientific experiment with unlimited resources, what would it be?",
      "Should we bring back extinct species through de-extinction technology?",
      "How close are we to understanding consciousness from a neuroscience perspective?",
      "What would change if we discovered microbial life on another planet?",
      "Is the scientific method the only reliable path to knowledge?",
    ],
    faqs: [
      {
        question: "What are good science conversation starters?",
        answer:
          "Good science conversation starters include questions about space exploration, the ethics of genetic engineering, climate change solutions, and the future of AI. Topics that connect everyday life to scientific principles — like how vaccines work or why the sky is blue — also make excellent discussion starters because they are accessible yet surprisingly deep.",
      },
      {
        question: "How can I use science topics for classroom discussions?",
        answer:
          "Teachers can use science topics by choosing age-appropriate questions that connect to the current curriculum. Pair a random science topic with a brief article or video, then let students discuss in small groups before sharing with the class. Topics about ethics in science — such as cloning or space colonization — work especially well for developing critical thinking skills.",
      },
      {
        question: "What science debate topics work best for students?",
        answer:
          "The best science debate topics for students have clear pro and con sides and connect to real-world issues. Examples include nuclear energy vs. renewables, mandatory vaccination policies, animal testing in medical research, and whether space exploration funding is justified. These topics encourage evidence-based argumentation while remaining engaging and relevant.",
      },
    ],
  },

  technology: {
    intro:
      "Technology topics cover the innovations, tools, and digital systems that are reshaping how we live, work, and communicate. From artificial intelligence and cybersecurity to social media's impact on society, tech discussion topics are among the most relevant and fast-evolving subjects today. These topics are perfect for debates about digital ethics, conversations about the future of work, or writing prompts that imagine tomorrow's world.",
    sampleTopics: [
      "Should social media platforms be regulated like public utilities?",
      "Will artificial intelligence replace more jobs than it creates?",
      "Is privacy dead in the age of big data and surveillance technology?",
      "How would society change if the internet disappeared for a month?",
      "Should autonomous weapons be banned by international law?",
    ],
    faqs: [
      {
        question: "What are trending technology topics for discussion?",
        answer:
          "Trending technology discussion topics include the impact of generative AI on creative industries, data privacy regulations, the future of remote work technology, cryptocurrency and decentralized finance, and the ethics of facial recognition. Topics about how emerging tech affects jobs, education, and mental health are always timely and generate lively debate.",
      },
      {
        question: "How do I pick a technology topic for a presentation?",
        answer:
          "Choose a technology topic that connects to your audience's interests or concerns. For a general audience, topics like smartphone addiction or AI-generated content work well. For a technical audience, consider topics like zero-trust security architecture or the environmental cost of data centers. Use our generator to find a topic, then narrow it to a specific angle with a clear thesis.",
      },
      {
        question: "Are technology topics suitable for debate competitions?",
        answer:
          "Yes, technology topics are excellent for debate competitions because they involve real-world stakes, ethical dilemmas, and rapidly changing evidence. Topics like net neutrality, government surveillance, and algorithmic bias offer strong arguments on both sides and require debaters to engage with technical concepts, legal frameworks, and social implications simultaneously.",
      },
    ],
  },

  philosophy: {
    intro:
      "Philosophy topics invite deep reflection on the fundamental questions of existence, morality, knowledge, and meaning. These discussion topics challenge you to think beyond everyday assumptions and explore ideas that humanity has wrestled with for millennia. Whether you are exploring the trolley problem, questioning free will, or debating the nature of reality, philosophy topics are guaranteed to spark thought-provoking conversations that linger long after the discussion ends.",
    sampleTopics: [
      "Do we have free will, or is every choice predetermined?",
      "Is it ever morally acceptable to lie for the greater good?",
      "Can a machine ever truly be conscious?",
      "What makes a life meaningful — happiness, purpose, or something else?",
      "Is morality objective or just a social construct?",
    ],
    faqs: [
      {
        question: "What are good philosophical questions for beginners?",
        answer:
          "Great philosophical questions for beginners include: Is there such a thing as objective truth? What makes something beautiful? Is it possible to be truly selfless? Can money buy happiness? These questions are easy to understand but open up surprisingly complex discussions, making them perfect entry points into philosophical thinking.",
      },
      {
        question: "How can philosophy topics improve critical thinking?",
        answer:
          "Philosophy topics improve critical thinking by requiring you to examine assumptions, construct logical arguments, consider opposing viewpoints, and distinguish valid reasoning from fallacies. Engaging with philosophical questions regularly trains your mind to think more clearly, argue more persuasively, and evaluate claims more carefully — skills that transfer to every area of life.",
      },
      {
        question: "What philosophy topics work well for group discussions?",
        answer:
          "Group-friendly philosophy topics include thought experiments like the trolley problem, questions about justice and fairness, debates about technology and ethics, and discussions about what constitutes a good society. The best group philosophy topics are accessible without specialized knowledge, have no single correct answer, and naturally invite multiple perspectives.",
      },
    ],
  },

  psychology: {
    intro:
      "Psychology topics explore the fascinating inner workings of the human mind, from cognitive biases and emotional intelligence to memory, motivation, and mental health. These discussion topics help you understand why people think, feel, and behave the way they do. Whether you are interested in social psychology, developmental psychology, or the science of habits, psychology topics offer a rich foundation for conversations, essays, and classroom activities.",
    sampleTopics: [
      "Why do people procrastinate even when they know the consequences?",
      "How much of your personality is shaped by nature versus nurture?",
      "Can you truly change a deeply ingrained habit?",
      "Why do humans find comfort in routines and rituals?",
      "Is social media making us more narcissistic or more connected?",
    ],
    faqs: [
      {
        question: "What are interesting psychology topics for essays?",
        answer:
          "Interesting psychology essay topics include the bystander effect and why people fail to help, the psychology of first impressions, how childhood experiences shape adult relationships, the science behind placebo effects, and cognitive biases in decision-making. Choose a topic with solid research backing so you can cite studies and experiments in your essay.",
      },
      {
        question: "How can psychology topics be used as icebreakers?",
        answer:
          "Psychology-based icebreakers work well because everyone has personal experience with the human mind. Questions like 'What is your earliest memory?' or 'Do you think dreams have meaning?' or 'What habit would you most like to change?' get people sharing and connecting quickly. These topics feel personal without being too invasive.",
      },
      {
        question: "What psychology debate topics are most engaging?",
        answer:
          "Engaging psychology debate topics include whether free will is an illusion, the ethics of using medication vs. therapy for mental health, whether social media causes depression, nature vs. nurture in intelligence, and whether eyewitness testimony should be trusted in court. These topics have strong evidence on both sides and generate passionate, well-reasoned arguments.",
      },
    ],
  },

  history: {
    intro:
      "History topics transport you to pivotal moments, forgotten civilizations, and world-changing events that shaped the society we live in today. From ancient empires to modern revolutions, history discussion topics encourage you to learn from the past and draw connections to the present. These topics are ideal for classroom debates, writing assignments, and conversations that reveal how yesterday's decisions still influence tomorrow's possibilities.",
    sampleTopics: [
      "What invention had the single greatest impact on human civilization?",
      "If you could witness any historical event firsthand, which would you choose?",
      "Did the Industrial Revolution do more harm or good to society?",
      "How different would the world be if the Roman Empire never fell?",
      "Which historical figure is most misunderstood by popular culture?",
    ],
    faqs: [
      {
        question: "What are engaging history topics for students?",
        answer:
          "Engaging history topics for students include counterfactual questions like 'What if the internet was invented 100 years earlier?', comparison topics like 'How do modern protests compare to historical movements?', and mystery topics like 'What really happened to the lost colony of Roanoke?' Topics that connect historical events to students' daily lives generate the most interest.",
      },
      {
        question: "How do I choose a history topic for a research paper?",
        answer:
          "Start by picking an era or region that interests you, then narrow it to a specific event, person, or theme. Good research paper topics have enough primary sources available, a clear thesis you can argue, and relevance beyond just recounting facts. Use our generator to find a broad topic, then focus on a particular angle — like the economic causes of a war rather than the war itself.",
      },
      {
        question: "What are the best history debate topics?",
        answer:
          "The best history debate topics ask whether historical decisions were justified, such as the use of atomic bombs, colonialism's legacy, or whether specific revolutions improved society. Topics that compare different historical approaches to similar problems — like how different civilizations handled pandemics — also generate excellent debates with modern relevance.",
      },
    ],
  },

  "art-culture": {
    intro:
      "Art and culture topics explore the creative expressions, traditions, and shared experiences that define human societies around the world. From the impact of street art to the role of music in social movements, these discussion topics celebrate the ways people express identity, tell stories, and challenge conventions. Whether you are discussing the value of modern art or debating cultural appropriation, art and culture topics guarantee vibrant, passionate conversations.",
    sampleTopics: [
      "Is modern art as meaningful as classical art, or has creativity declined?",
      "How does music shape cultural identity and social movements?",
      "Should art that offends people be censored or protected?",
      "What defines a cultural masterpiece — popularity, innovation, or emotional impact?",
      "How has the internet changed the way we create and consume art?",
    ],
    faqs: [
      {
        question: "What are good art and culture discussion topics?",
        answer:
          "Good art and culture discussion topics include the purpose of art in society, whether digital art is 'real' art, the impact of streaming on the music industry, cultural preservation vs. modernization, and how different cultures approach storytelling. Topics that compare artistic traditions across cultures or examine art's role in social change tend to generate the most engaging discussions.",
      },
      {
        question: "How can art topics be used for writing prompts?",
        answer:
          "Art topics make excellent writing prompts because they invite personal reflection and creative interpretation. Prompts like 'Describe a piece of art that changed how you see the world' or 'Write about a culture you admire and why' encourage descriptive, narrative, and analytical writing. They also work well for compare-and-contrast essays and opinion pieces.",
      },
      {
        question: "What cultural topics work well for classroom activities?",
        answer:
          "Classroom-friendly cultural topics include food traditions around the world, how holidays differ across cultures, the role of folklore and mythology, the evolution of fashion, and how languages borrow from each other. These topics are accessible, visually rich, and naturally encourage students to share their own cultural backgrounds and experiences.",
      },
    ],
  },

  "food-travel": {
    intro:
      "Food and travel topics bring people together by exploring the flavors, destinations, and experiences that make the world endlessly interesting. From debating the best street food cities to discussing how travel changes your perspective, these topics are perfect for casual conversations, travel blogs, and creative writing. Food and travel discussions are universally accessible because everyone eats and everyone dreams of exploring somewhere new.",
    sampleTopics: [
      "What is the most underrated cuisine in the world and why?",
      "Does traveling actually make you a more open-minded person?",
      "Should countries limit tourism to protect local culture and ecosystems?",
      "If you could only eat one country's cuisine for a year, which would it be?",
      "What is the biggest misconception tourists have about your country?",
    ],
    faqs: [
      {
        question: "What are fun food topics for conversations?",
        answer:
          "Fun food conversation topics include debating the best comfort food, discussing whether pineapple belongs on pizza, comparing home cooking vs. eating out, exploring the origins of popular dishes, and sharing the weirdest food you have ever tried. Food topics are excellent conversation starters because they are relatable, low-stakes, and often lead to funny personal stories.",
      },
      {
        question: "How can travel topics inspire creative writing?",
        answer:
          "Travel topics inspire creative writing by evoking sensory details, cultural encounters, and personal transformation. Prompts like 'Describe a place that surprised you' or 'Write about a meal that told you everything about a culture' push writers to use vivid description and reflection. Travel writing can blend memoir, journalism, and storytelling in unique ways.",
      },
      {
        question: "What food and travel topics are good for debates?",
        answer:
          "Debatable food and travel topics include whether street food is better than fine dining, the ethics of food tourism, whether travel should be considered essential spending, sustainable tourism vs. economic growth, and whether fast food globalization is erasing local food cultures. These topics have strong opinions on both sides and connect to broader economic and cultural issues.",
      },
    ],
  },

  relationships: {
    intro:
      "Relationship topics dive into the dynamics of human connection — from friendships and family bonds to romantic partnerships and workplace interactions. These discussion topics help you explore communication styles, emotional intelligence, boundaries, and the evolving nature of modern relationships. Whether you are looking for deep conversation starters with a partner or thought-provoking prompts about social dynamics, relationship topics offer meaningful and often personal dialogue.",
    sampleTopics: [
      "What is the single most important quality in a lasting friendship?",
      "Is it better to have a few close friends or a large social circle?",
      "How has technology changed the way we form and maintain relationships?",
      "Can a relationship survive without trust once it has been broken?",
      "What is the difference between being alone and being lonely?",
    ],
    faqs: [
      {
        question: "What are deep relationship questions for couples?",
        answer:
          "Deep relationship questions for couples include: What does emotional safety mean to you? How has your idea of love changed over time? What is something you wish more people understood about you? What does a perfect ordinary day together look like? These questions go beyond surface-level topics and help partners understand each other on a deeper emotional level.",
      },
      {
        question: "How can relationship topics be used as icebreakers?",
        answer:
          "Relationship icebreakers work best when they are universal but not too personal. Questions like 'What is the best advice you ever received about relationships?' or 'Do you think opposites attract or do birds of a feather flock together?' get people sharing opinions and stories without feeling exposed. Avoid overly intimate questions in group settings.",
      },
      {
        question: "What relationship topics are good for writing prompts?",
        answer:
          "Relationship writing prompts that work well include exploring the moment a friendship changed forever, writing a letter to your future self about love, describing a relationship that taught you something unexpected, or exploring how digital communication has changed intimacy. These prompts encourage emotional depth, character development, and personal narrative.",
      },
    ],
  },

  education: {
    intro:
      "Education topics examine how we learn, teach, and design systems of knowledge transfer for the next generation. From standardized testing debates to the promise of personalized learning, these discussion topics challenge conventional assumptions about schools, universities, and lifelong learning. Education topics are especially valuable for teachers, students, policymakers, and anyone who believes that how we educate shapes the future of society.",
    sampleTopics: [
      "Should standardized testing be abolished in schools?",
      "Is a college degree still worth the investment in today's economy?",
      "How would you redesign the education system from scratch?",
      "Should financial literacy be a required subject in every school?",
      "What is the ideal role of technology in the classroom?",
    ],
    faqs: [
      {
        question: "What are good education debate topics?",
        answer:
          "Good education debate topics include whether homework should be eliminated, if college should be free, whether homeschooling produces better outcomes than traditional schooling, the role of arts education in STEM-focused curricula, and whether students should be grouped by ability or age. The best education debates connect classroom policy to broader social outcomes.",
      },
      {
        question: "How can education topics be used for student discussions?",
        answer:
          "Education topics work well for student discussions because students are directly affected by educational policies and practices. Let students discuss topics like grading fairness, the value of group projects, or what skills school should prioritize. When students discuss education itself, they develop metacognitive awareness — thinking about how they think and learn.",
      },
      {
        question: "What education topics are relevant for teachers?",
        answer:
          "Teachers benefit from discussing topics like differentiated instruction strategies, the impact of classroom technology, how to support students with diverse learning needs, teacher burnout and well-being, and the balance between academic standards and student creativity. Professional development discussions around these topics can directly improve teaching practice.",
      },
    ],
  },

  politics: {
    intro:
      "Politics topics explore governance, civic engagement, policy decisions, and the power structures that shape society. From local elections to international diplomacy, political discussion topics challenge you to think about justice, representation, and the common good. These topics are essential for informed citizenship and work well in debate settings, classroom discussions, and conversations about the world you want to live in.",
    sampleTopics: [
      "Should voting be mandatory for all eligible citizens?",
      "Is democracy the best form of government, or are there better alternatives?",
      "How much influence should corporations have on political decisions?",
      "Should the voting age be lowered to sixteen?",
      "Is political polarization a natural part of democracy or a threat to it?",
    ],
    faqs: [
      {
        question: "What political topics are appropriate for classroom debates?",
        answer:
          "Classroom-appropriate political topics focus on policy rather than partisan identity. Examples include whether the voting age should change, how immigration policy should balance security and compassion, the role of government in healthcare, term limits for elected officials, and whether social media companies should moderate political speech. Frame topics as questions, not positions.",
      },
      {
        question: "How can I discuss politics without causing arguments?",
        answer:
          "Discuss politics productively by focusing on policies rather than parties, asking questions instead of making accusations, acknowledging valid points from all sides, and using specific examples rather than generalizations. Starting with a random topic from a generator can help because it provides a neutral starting point that no one feels personally attacked by.",
      },
      {
        question: "What are good political topics for essays?",
        answer:
          "Good political essay topics include the effectiveness of sanctions as a foreign policy tool, the impact of gerrymandering on representation, whether direct democracy could work in the digital age, the role of media in shaping political opinion, and how different countries approach universal basic income. Choose a topic with enough research material to support a thesis.",
      },
    ],
  },

  entertainment: {
    intro:
      "Entertainment topics cover movies, music, television, gaming, celebrity culture, and the media that shape how we spend our free time. These discussion topics are fun, accessible, and surprisingly deep when you explore the cultural impact of entertainment. From debating the greatest film of all time to discussing how streaming changed the music industry, entertainment topics are perfect for casual conversations, pop culture essays, and lively group discussions.",
    sampleTopics: [
      "What movie completely changed the way you see the world?",
      "Is binge-watching ruining the art of television storytelling?",
      "Should video games be recognized as a legitimate art form?",
      "Which decade produced the best music and why?",
      "Has the rise of streaming services been good or bad for creative content?",
    ],
    faqs: [
      {
        question: "What are fun entertainment topics for group discussions?",
        answer:
          "Fun group entertainment topics include ranking the best movie franchises, debating whether remakes ever surpass originals, discussing which fictional universe you would want to live in, comparing music genres, and predicting the next big trend in entertainment. These topics are low-stakes, generate friendly disagreements, and get everyone involved because everyone consumes entertainment.",
      },
      {
        question: "Can entertainment topics be used for serious essays?",
        answer:
          "Absolutely. Entertainment topics can anchor serious analytical essays about media influence, representation in film and TV, the economics of the streaming industry, the psychology of fandom, and how pop culture reflects social values. Analyzing entertainment critically is a core part of cultural studies, media studies, and even sociology coursework.",
      },
      {
        question: "What entertainment debate topics work for students?",
        answer:
          "Student-friendly entertainment debate topics include whether violent video games contribute to real-world violence, if award shows are still relevant, whether AI-generated art counts as creativity, the ethics of celebrity cancel culture, and whether movie theaters will survive streaming. These topics connect entertainment to broader questions about society, technology, and ethics.",
      },
    ],
  },

  sports: {
    intro:
      "Sports topics bring energy and passion to any discussion, covering everything from athletic performance and team dynamics to the business of sports and its cultural significance. Whether you are debating the greatest athlete of all time, discussing the ethics of performance-enhancing drugs, or exploring how sports unite communities, these topics are perfect for conversation starters, debate practice, and persuasive writing assignments.",
    sampleTopics: [
      "Should college athletes be paid for their performance?",
      "Is esports a real sport or just competitive gaming?",
      "What makes someone the greatest athlete of all time — records, impact, or dominance?",
      "Should youth sports focus more on fun or competition?",
      "How do sports shape national identity and cultural pride?",
    ],
    faqs: [
      {
        question: "What are the best sports debate topics?",
        answer:
          "The best sports debate topics include whether athletes should use their platforms for political activism, if performance-enhancing drugs should be allowed, whether esports deserve the same recognition as traditional sports, the fairness of salary caps, and whether hosting the Olympics benefits or burdens a city. These topics combine sports knowledge with ethical reasoning and economic analysis.",
      },
      {
        question: "How can sports topics be used for persuasive writing?",
        answer:
          "Sports topics work well for persuasive writing because people hold strong opinions about them. Students can argue whether college athletes deserve compensation, whether sports gambling should be legal, or whether youth sports are too competitive. The key is to support your position with statistics, expert opinions, and real-world examples from the world of sports.",
      },
      {
        question: "What sports conversation starters work at parties?",
        answer:
          "Great sports conversation starters for social settings include asking about someone's first sports memory, debating which sport is hardest to master, discussing underrated athletes, or asking what sport they would add to the Olympics. Avoid questions that require deep expertise — the best social sports topics are accessible to both casual fans and die-hard enthusiasts.",
      },
    ],
  },

  business: {
    intro:
      "Business topics explore entrepreneurship, economics, leadership, and the forces that drive commerce and innovation in the modern world. From startup culture to corporate ethics, these discussion topics challenge you to think about how businesses create value, impact society, and adapt to change. Business topics are valuable for students, professionals, and anyone interested in how the economy works and where it is heading.",
    sampleTopics: [
      "Is the traditional nine-to-five work model becoming obsolete?",
      "Should companies be legally required to pay a living wage?",
      "What separates successful entrepreneurs from those who fail?",
      "Is remote work better for productivity or is it just more convenient?",
      "Should businesses prioritize profit or social responsibility?",
    ],
    faqs: [
      {
        question: "What are good business topics for class presentations?",
        answer:
          "Good business presentation topics include the rise of the gig economy, how social media marketing changed small business, the pros and cons of remote work culture, the economics of subscription business models, and whether corporate social responsibility drives profit. Pick a topic with recent data and case studies to make your presentation compelling and evidence-based.",
      },
      {
        question: "What business debate topics are most thought-provoking?",
        answer:
          "Thought-provoking business debate topics include whether billionaires should exist, if automation will create a jobless future, whether unpaid internships are ethical, the morality of planned obsolescence, and whether startups should prioritize growth over profitability. These topics force debaters to balance economic theory with ethical considerations.",
      },
      {
        question: "How can business topics help with career development?",
        answer:
          "Discussing business topics builds the critical thinking, communication, and analytical skills that employers value most. Engaging with topics about leadership, negotiation, market trends, and workplace culture helps you develop informed perspectives that stand out in interviews, networking events, and professional conversations. It also keeps you current on industry trends.",
      },
    ],
  },

  nature: {
    intro:
      "Nature topics connect you to the natural world, covering ecosystems, wildlife, climate, conservation, and humanity's relationship with the environment. From the mysteries of deep-sea creatures to the urgent challenges of climate change, these discussion topics inspire wonder and responsibility. Nature topics are perfect for science classes, environmental debates, creative writing about the outdoors, and conversations that remind us why protecting our planet matters.",
    sampleTopics: [
      "If one endangered species could be guaranteed survival, which should it be?",
      "Should humans intervene in natural disasters to protect wildlife?",
      "What is the most awe-inspiring natural phenomenon you have learned about?",
      "Is it possible to reverse climate change, or should we focus on adaptation?",
      "Should national parks charge admission or be free for everyone?",
    ],
    faqs: [
      {
        question: "What are good nature topics for environmental essays?",
        answer:
          "Good nature essay topics include the true cost of deforestation, whether individual actions can meaningfully combat climate change, the ethics of zoos and captive breeding programs, how urbanization affects local biodiversity, and the case for protecting ocean ecosystems. Choose a topic where you can combine scientific data with a compelling argument for change.",
      },
      {
        question: "How can nature topics be used for science discussions?",
        answer:
          "Nature topics work well for science discussions because they combine observable phenomena with complex systems. Discuss topics like how ecosystems recover after wildfires, the role of apex predators in maintaining balance, why coral reefs are dying, or how migration patterns are shifting due to climate change. These topics naturally lead to evidence-based, inquiry-driven conversations.",
      },
      {
        question: "What nature debate topics are relevant today?",
        answer:
          "Timely nature debate topics include whether economic growth and environmental protection can coexist, the ethics of genetic modification to save endangered species, whether nuclear energy is a green solution, plastic bans vs. better recycling systems, and whether wealthy nations should pay more for climate mitigation. These topics connect environmental science to policy and ethics.",
      },
    ],
  },

  health: {
    intro:
      "Health topics cover physical fitness, mental wellness, nutrition, medical ethics, and the healthcare systems that affect every person's quality of life. From the science of sleep to the debate over universal healthcare, these discussion topics are deeply personal and universally relevant. Health topics are excellent for persuasive essays, classroom discussions about science and society, and everyday conversations about living a better, more balanced life.",
    sampleTopics: [
      "Is mental health just as important as physical health in the workplace?",
      "Should junk food be taxed like tobacco to reduce obesity?",
      "What daily habit has the biggest impact on long-term health?",
      "Is the healthcare system in your country working, or does it need radical change?",
      "How much should governments regulate what people eat and drink?",
    ],
    faqs: [
      {
        question: "What are good health topics for persuasive essays?",
        answer:
          "Good health persuasive essay topics include whether sugary drinks should be banned in schools, the case for universal mental healthcare, whether alternative medicine should be covered by insurance, the ethics of organ donation policies, and whether employees should get mandatory mental health days. Choose a topic where you can cite research, statistics, and expert opinions.",
      },
      {
        question: "How can health topics spark meaningful conversations?",
        answer:
          "Health topics spark meaningful conversations because everyone has personal experience with health challenges, habits, and healthcare. Questions like 'What is the best health advice you ever received?' or 'How do you manage stress?' or 'What would you change about how society approaches mental health?' invite authentic sharing and often reveal surprising perspectives.",
      },
      {
        question: "What health debate topics are most controversial?",
        answer:
          "Controversial health debate topics include mandatory vaccination policies, the legalization of assisted dying, whether healthcare is a human right or a privilege, the regulation of pharmaceutical drug pricing, and whether schools should provide comprehensive sex education. These topics involve deeply held values and require balancing individual freedom with public health outcomes.",
      },
    ],
  },

  "weird-fun": {
    intro:
      "Weird and fun topics are the wildcard category that brings humor, absurdity, and creative thinking to any conversation or writing exercise. From bizarre hypothetical scenarios to questions that make you laugh out loud, these topics break the ice and keep everyone entertained. Weird and fun topics are perfect for parties, casual hangouts, creative writing warm-ups, and any situation where you want to surprise people and spark unexpected, hilarious discussions.",
    sampleTopics: [
      "If animals could talk, which species would be the rudest?",
      "Would you rather have fingers as long as your legs or legs as long as your fingers?",
      "If you could make one weird law that everyone had to follow, what would it be?",
      "What conspiracy theory is so ridiculous it might actually be true?",
      "If you were a supervillain, what would your hilariously impractical evil plan be?",
    ],
    faqs: [
      {
        question: "What are the funniest random topics for parties?",
        answer:
          "The funniest party topics include absurd hypotheticals like 'If you had to fight 100 duck-sized horses or one horse-sized duck, which would you choose?' and creative questions like 'What would your autobiography be titled?' and silly debates like 'Is a hot dog a sandwich?' These topics work because they are impossible to answer wrong and always lead to hilarious arguments.",
      },
      {
        question: "How can weird topics be used as creative writing prompts?",
        answer:
          "Weird topics make fantastic creative writing prompts because they force your brain out of familiar patterns. Prompts like 'Write a story where gravity reverses every Tuesday' or 'Describe a world where everyone has a useless superpower' lead to wildly creative, unexpected stories. They are especially helpful for overcoming writer's block because they bypass your inner critic.",
      },
      {
        question: "Are fun and weird topics appropriate for classrooms?",
        answer:
          "Yes, when chosen thoughtfully. Weird and fun topics can energize a classroom, encourage participation from quiet students, and make learning feel playful. Use them as warm-ups, creative writing starters, or Friday discussion topics. Questions like 'If you could invent a new holiday, what would it celebrate?' are engaging, inclusive, and still develop communication and creative thinking skills.",
      },
    ],
  },
};
