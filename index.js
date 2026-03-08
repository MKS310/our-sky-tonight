const fs = require('fs');
const path = require('path');
const https = require('https');
let Parser = require('rss-parser');
const templates = require('./templates.js');
let parser = new Parser();
const promises = [];
const sources = JSON.parse(fs.readFileSync('sources.json'));

// Create the requried folders
fs.mkdir(`./dist`, () => {});

// Function to get all gallery images, shuffled with random start
function getGalleryImages() {
  const galleryDir = './images/gallery/';
  try {
    const files = fs.readdirSync(galleryDir);
    const imageFiles = files.filter(file =>
      /\.(jpg|jpeg|png|gif)$/i.test(file)
    );

    if (imageFiles.length === 0) {
      return []; // No images found
    }

    // Shuffle all images
    const shuffled = imageFiles.sort(() => 0.5 - Math.random());
    return shuffled.map(img => `images/gallery/${img}`);
  } catch (err) {
    console.log('No gallery images found');
    return [];
  }
}

// Function to get daily astronomy joke
function getDailyAstronomyJoke() {
  const jokes = [
    { joke: "Why did the sun go to school?", punchline: "To get brighter!" },
    { joke: "What do planets like to read?", punchline: "Comet books!" },
    { joke: "How do you organize a space party?", punchline: "You planet!" },
    { joke: "Why did the star go to the doctor?", punchline: "It was feeling a bit under the weather!" },
    { joke: "What's a light-year?", punchline: "The same as a regular year, but with fewer calories!" },
    { joke: "Why can't you trust atoms?", punchline: "They make up everything!" },
    { joke: "What did Mars say to Saturn?", punchline: "Give me a ring sometime!" },
    { joke: "How does the moon cut his hair?", punchline: "Eclipse it!" },
    { joke: "Why did the astronaut break up with his girlfriend?", punchline: "He needed space!" },
    { joke: "What do you call a tick on the moon?", punchline: "A luna-tick!" },
    { joke: "Why don't aliens eat clowns?", punchline: "Because they taste funny!" },
    { joke: "What's an astronaut's favorite key on a keyboard?", punchline: "The space bar!" },
    { joke: "How do you get a baby astronaut to sleep?", punchline: "You rocket!" },
    { joke: "What kind of music do planets like?", punchline: "Neptunes!" },
    { joke: "Why is the moon always broke?", punchline: "It's down to its last quarter!" }
  ];

  // Use day of year to rotate through jokes
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  return jokes[dayOfYear % jokes.length];
}

// Function to fetch quote from ZenQuotes API
function fetchQuote() {
  return new Promise((resolve, reject) => {
    https.get('https://zenquotes.io/api/today', (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const quotes = JSON.parse(data);
          if (quotes && quotes.length > 0) {
            resolve({ text: quotes[0].q, author: quotes[0].a });
          } else {
            resolve({ text: 'The stars shine brightest in the darkest skies.', author: 'Anonymous' });
          }
        } catch (err) {
          console.log('Error parsing quote:', err);
          resolve({ text: 'The stars shine brightest in the darkest skies.', author: 'Anonymous' });
        }
      });
    }).on('error', (err) => {
      console.log('Error fetching quote:', err);
      resolve({ text: 'The stars shine brightest in the darkest skies.', author: 'Anonymous' });
    });
  });
}

// Function to fetch NASA APOD
function fetchAPOD() {
  return new Promise((resolve) => {
    https.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const apod = JSON.parse(data);
          resolve({
            title: apod.title || 'Astronomy Picture of the Day',
            url: apod.url || '',
            explanation: apod.explanation || '',
            mediaType: apod.media_type || 'image',
            date: apod.date || ''
          });
        } catch (err) {
          console.log('Error parsing APOD:', err);
          resolve({ title: 'APOD Unavailable', url: '', explanation: '', mediaType: 'image' });
        }
      });
    }).on('error', (err) => {
      console.log('Error fetching APOD:', err);
      resolve({ title: 'APOD Unavailable', url: '', explanation: '', mediaType: 'image' });
    });
  });
}

// Function to fetch weather forecast from NWS API
function fetchWeatherForecast() {
  return new Promise((resolve) => {
    const options = {
      headers: {
        'User-Agent': 'OurSkyTonight/1.0 (https://github.com/MKS310/our-sky-tonight)',
        'Accept': 'application/json'
      }
    };

    https.get('https://api.weather.gov/gridpoints/GRB/74,68/forecast', options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const forecast = JSON.parse(data);
          if (forecast.properties && forecast.properties.periods) {
            // Get first 4 periods (Today, Tonight, Tomorrow, Tomorrow Night)
            const periods = forecast.properties.periods.slice(0, 4).map(period => ({
              name: period.name,
              temperature: period.temperature,
              temperatureUnit: period.temperatureUnit,
              shortForecast: period.shortForecast,
              icon: period.icon,
              windSpeed: period.windSpeed,
              windDirection: period.windDirection,
              isDaytime: period.isDaytime
            }));
            resolve(periods);
          } else {
            resolve([]);
          }
        } catch (err) {
          console.log('Error parsing weather forecast:', err);
          resolve([]);
        }
      });
    }).on('error', (err) => {
      console.log('Error fetching weather forecast:', err);
      resolve([]);
    });
  });
}

// Function to fetch visible planets for Neenah, WI
function fetchVisiblePlanets() {
  return new Promise((resolve) => {
    const latitude = 44.1858;
    const longitude = -88.4626;
    const url = `https://api.visibleplanets.dev/v3?latitude=${latitude}&longitude=${longitude}`;

    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const planets = JSON.parse(data);
          // Filter for planets that are above horizon and reasonably visible
          if (planets.data && Array.isArray(planets.data)) {
            const visiblePlanets = planets.data.filter(planet =>
              planet.aboveHorizon && planet.altitude > 0
            );
            resolve(visiblePlanets);
          } else {
            resolve([]);
          }
        } catch (err) {
          console.log('Error parsing visible planets:', err);
          resolve([]);
        }
      });
    }).on('error', (err) => {
      console.log('Error fetching visible planets:', err);
      resolve([]);
    });
  });
}

// Function to fetch horoscopes for all zodiac signs
// Rotates through 30 curated readings per sign using day-of-month
function fetchHoroscopes() {
  return new Promise((resolve) => {
    const dayOfMonth = new Date().getDate() - 1; // 0-indexed

    const readings = {
      aries: [
        'Bold energy surrounds you today. Take the initiative on a project you\'ve been postponing — your confidence is your greatest asset.',
        'A competitive streak serves you well. Channel it into a goal rather than a conflict and watch results appear quickly.',
        'Impatience may surface early in the day. Pause before reacting; the best outcomes come from deliberate action.',
        'Your ruling planet Mars energizes your ambitions. Set a clear target and pursue it with your characteristic fire.',
        'Leadership opportunities arise unexpectedly. Step forward — others are watching and trusting your direction.',
        'Physical activity will clear mental fog today. A brisk walk or workout unlocks the clarity you\'ve been seeking.',
        'You\'re drawn to new beginnings. Plant a seed — an idea, a conversation, or a commitment — that can grow.',
        'A direct approach cuts through confusion today. Say what you mean; those around you will appreciate the honesty.',
        'Restlessness signals untapped potential. Find a challenge worthy of your energy rather than burning it on distractions.',
        'Creative fire burns bright. Let spontaneity guide an artistic or problem-solving endeavor this afternoon.',
        'Financial instincts are sharp today. Trust your gut on a practical decision, but verify the details first.',
        'An unexpected encounter sparks inspiration. Stay open to conversations that seem mundane — they rarely are.',
        'Your courage is tested in a small but meaningful way. Meeting it head-on builds momentum for larger victories.',
        'Independence serves you today, but don\'t mistake stubbornness for strength. Know when to accept help.',
        'The pace of the day suits your natural rhythm. Use the momentum to tackle the thing you\'ve been avoiding.',
        'A friend or colleague needs your directness. Offer honest feedback with warmth — it will be received well.',
        'New territory beckons. Whether physical, intellectual, or emotional — explore it without overthinking.',
        'Your natural optimism lights up a room today. Let it flow freely; it costs nothing and lifts everyone.',
        'A long-standing challenge shows a crack. Push through it today — you\'re closer to breakthrough than you think.',
        'Slow down long enough to appreciate a small win. Celebration fuels the next sprint forward.',
        'Communication is your superpower today. A well-timed message or call changes the arc of someone\'s week.',
        'Trust your instincts over analysis this morning. Your first read on a situation is likely the right one.',
        'Passion without patience can scatter your efforts. Focus on depth over breadth for better results today.',
        'Collaboration surprises you. A partner brings a perspective that sharpens your thinking and improves the outcome.',
        'The universe rewards boldness today. Make the ask, send the pitch, take the first step.',
        'Energy levels peak midday. Schedule your most demanding work in that window for peak output.',
        'An old rivalry fades as you realize the real competition has always been with yourself.',
        'Your enthusiasm is contagious. Lead by example today and others will naturally follow.',
        'A challenge that seemed large shrinks when you face it directly. You\'ve handled harder things before.',
        'Tonight brings a moment of stillness. Use it to reflect on how far you\'ve come — the view is worth it.'
      ],
      taurus: [
        'Steady progress defines your day. You won\'t move mountains, but you\'ll lay the foundation to do so.',
        'Comfort and beauty draw your attention. Investing in your environment — even slightly — pays dividends in peace of mind.',
        'Patience is your superpower today. What others abandon in frustration, you see through to completion.',
        'Financial matters come into focus. A practical decision made now protects your long-term security.',
        'Your senses are heightened. Enjoy a meal, a scent, or a sound that reminds you life has texture.',
        'Resistance to change is understandable today, but one small shift yields more than you expect.',
        'A relationship deepens through a quiet act of loyalty. You don\'t need grand gestures — presence is enough.',
        'Your reliability earns recognition today. Someone notices the quiet, consistent effort you\'ve been putting in.',
        'Nature restores you. Even five minutes outdoors resets your nervous system and clarifies your thinking.',
        'A creative endeavor benefits from your refined taste. Trust your aesthetic instincts — they rarely mislead.',
        'Slow and steady wins more than speed today. Let others rush; your thoroughness produces superior results.',
        'Something you\'ve been cultivating finally shows signs of growth. Keep tending to it.',
        'A financial opportunity deserves careful evaluation. Take your time — pressure to decide quickly is a red flag.',
        'Your groundedness anchors those around you. You may not realize how much others depend on your stability.',
        'Routine brings comfort today. Honor it rather than fighting the urge to "mix things up."',
        'A material goal is within reach. Map the steps and move toward it methodically — that\'s your gift.',
        'Loyalty to a friend matters more than being right. Choose the relationship over the argument.',
        'Physical pleasures nourish you today — good food, rest, or movement. Prioritize them without guilt.',
        'A long-held plan begins to crystallize. The timing finally feels right. Trust that feeling.',
        'Your persistence outlasts opposition. What seemed immovable starts to yield under your steady pressure.',
        'Beauty in ordinary things catches your eye today. Let it slow you down in the best possible way.',
        'Venus favors your social interactions. A connection made today has lasting warmth.',
        'Stubbornness and determination look the same from the outside — only the outcome reveals the difference.',
        'Your practical wisdom helps someone navigate a confusing situation. Offer it without hesitation.',
        'Comfort is earned today, not just sought. Finishing a task makes rest feel genuinely restorative.',
        'An investment in quality over quantity proves its value sooner than expected.',
        'You\'re building something lasting. Keep your focus on craftsmanship, not speed.',
        'Security comes from what you\'ve built, not what you\'re promised. Your foundation is solid.',
        'A sensory experience — music, food, art — unlocks a memory that brings perspective.',
        'The day ends quietly but well. Small comforts are underrated. Tonight is a reminder of that.'
      ],
      gemini: [
        'Your mind races with ideas today. Write them down — even the half-formed ones have seeds worth keeping.',
        'A conversation takes an unexpected turn and opens a door you didn\'t know you were looking for.',
        'Curiosity leads you somewhere interesting. Follow it past the point where most people stop.',
        'Two competing thoughts vie for your attention. Hold them both — the tension between them is productive.',
        'Communication is effortless today. Say the thing you\'ve been meaning to say and watch it land perfectly.',
        'Information you encounter today connects dots you didn\'t know needed connecting.',
        'Your adaptability is your greatest asset. What confuses others, you navigate with ease.',
        'A short trip or change of scene sparks a cascade of fresh thinking.',
        'Wit and intellect open a door that brute effort couldn\'t budge. Use them liberally.',
        'You see both sides of an argument with unusual clarity. This is a gift — use it to build, not to argue.',
        'Social energy is high. Say yes to the spontaneous invitation; it leads somewhere worth going.',
        'Your restlessness today is signal, not noise. It\'s pointing toward something you need to address.',
        'A sibling, neighbor, or nearby connection brings unexpected joy or useful information.',
        'Words matter today. Choose them carefully in writing; they may be read again.',
        'Learning something new — even briefly — feeds the part of you that withers without stimulation.',
        'Scattered energy consolidates mid-afternoon. That\'s when your best focused work gets done.',
        'A puzzle that\'s stumped you reveals its answer when you stop trying and start playing.',
        'Multitasking serves you today, but know which task is the priority when they conflict.',
        'You\'re the connector others need. An introduction you make today creates real value.',
        'Your nervous energy finds a useful outlet in creative expression. Write, sketch, or talk it out.',
        'Mercury sharpens your thinking. Tackle the complex problem you\'ve been deferring.',
        'A white lie catches up to someone today. Decide early that honesty, even uncomfortable, is your standard.',
        'Your ability to reframe a negative into an opportunity impresses those around you.',
        'Boredom is a signal that you\'re underutilizing your mind. Find something harder to chew on.',
        'Dual interests don\'t have to compete — today shows a way they might complement each other.',
        'The right words at the right moment make all the difference. You\'ll know it when you find them.',
        'Your social intelligence is at a peak. Read the room and adjust accordingly.',
        'A book, article, or podcast seeds an idea that you\'ll return to for months.',
        'Short-term plans come together easily. Trust the spontaneous structure that emerges.',
        'The day ends with your curiosity more alive than when it started. That\'s the best kind of day.'
      ],
      cancer: [
        'Your intuition is remarkably accurate today. Trust the quiet feeling before you seek outside input.',
        'Home and family anchor you. A small gesture of care for your space lifts your entire mood.',
        'Emotional intelligence is your edge. You read what others miss and respond with precision.',
        'A memory surfaces that holds more wisdom than you gave it at the time. Sit with it.',
        'Nurturing someone else today refills your own well — the connection is mutual even when it doesn\'t feel that way.',
        'Boundaries you set earlier begin to pay off. Others adjust to meet you where you actually are.',
        'Creativity flows from feeling, not forcing. Let your emotional state guide what you make today.',
        'A family matter resolves gently. The key was patience and your willingness to listen fully.',
        'Your sensitivity to atmosphere means you know which environments serve you. Choose accordingly today.',
        'Protection and care are your instincts — make sure you extend them to yourself as well as others.',
        'The moon\'s influence heightens your perception. You sense shifts in energy before others articulate them.',
        'A seemingly small act of kindness ripples out further than you\'ll ever know.',
        'Old wounds don\'t have to define present choices. Today offers a small but real chance to move forward.',
        'Your loyalty is one of your finest qualities. It is noticed and valued more than you realize.',
        'Retreat and recharge are not weakness — they\'re maintenance. Honor the need for solitude today.',
        'Something from the past resurfaces with new meaning. The timing is not coincidental.',
        'A conversation with someone you trust clarifies something you\'ve been feeling but couldn\'t name.',
        'Domestic details that feel tedious contain a form of meditation. Approach them with presence.',
        'Your empathy draws people toward you. That\'s a gift, but remember — you get to choose who to spend it on.',
        'Creative work benefits from emotional honesty today. Don\'t sanitize what you make.',
        'Security means different things in different moments. What do you need today to feel truly safe?',
        'A tender moment appears in the middle of an ordinary day. Let yourself feel it fully.',
        'Your protective instincts are strong today. Apply them wisely — not all threats require defense.',
        'Nostalgia visits, but today it brings sweetness rather than ache. Let yourself enjoy it.',
        'You sense that someone near you is struggling without saying so. A quiet check-in means everything.',
        'What you build for others, you also build for yourself. The labor of love is never one-directional.',
        'Water soothes you today — a bath, rain, the sound of a stream. Seek it if you can.',
        'Your inner life is rich. Don\'t let the busyness of the day drown it out.',
        'A relationship you\'ve invested in shows signs of deep health. Take a moment to appreciate that.',
        'The evening brings quiet comfort. Let it settle around you without trying to fill it with noise.'
      ],
      leo: [
        'The spotlight finds you today. Step into it without apology — your presence elevates the room.',
        'Creative energy surges. Make something today, even if no one sees it. The act itself is the point.',
        'Generosity comes naturally to you. Express it freely — it amplifies your own joy as much as the recipient\'s.',
        'Leadership is called for. Someone needs direction and will respond to the warmth and authority you carry.',
        'Your warmth dissolves a tension that logic couldn\'t touch. Show up as yourself — that\'s enough.',
        'Recognition arrives, perhaps in a small form. Accept it gracefully and let it fuel the next effort.',
        'Playfulness is your superpower today. Bring it to a serious task and watch it transform.',
        'A creative collaboration sparks something neither of you could produce alone.',
        'Your heart is generous but your boundaries are real. Know when to roar — and when to simply shine.',
        'Sun energy is with you today. Move toward what makes you feel most alive.',
        'Someone is watching how you handle a difficult moment. Your composure teaches more than any speech.',
        'Drama finds you, or you find it. Choose the version of this story that serves your best self.',
        'Loyalty is your currency. Someone who\'s earned it feels it today in how you show up for them.',
        'Your confidence is at a peak. Use it to tackle the thing that requires believing in yourself.',
        'Children or playful energy around you today remind you what joy uncomplicated by ego feels like.',
        'A bold statement or creative choice earns more respect than careful neutrality.',
        'You inspire others without trying. Simply being fully yourself today is the contribution.',
        'Romance or deep affection is highlighted. Express what you feel — the moment is right.',
        'Your pride can protect you or isolate you. Choose the version that keeps connections intact.',
        'A project you care about deeply gets the attention it deserves. Let yourself be proud of it.',
        'Your enthusiasm for a cause rallies others. Lead the charge with heart, not just volume.',
        'Magnanimity in a moment where pettiness would be easier elevates your standing in your own eyes.',
        'Rest is not retreat. The lion rests before the hunt — take care of your energy today.',
        'An audience — even of one — brings out your best. Find that witness today.',
        'Your sense of drama is a gift in creative work. Use it; don\'t suppress it.',
        'Vanity and self-respect are different. Know which one is driving today\'s decisions.',
        'A personal achievement deserves acknowledgment. Don\'t minimize it out of modesty.',
        'You light up a room. Today that quality is genuinely needed somewhere. Show up.',
        'Courage and heart together solve what neither alone could. That combination is uniquely yours.',
        'The day ends with a warm glow. You gave something of yourself today and it came back multiplied.'
      ],
      virgo: [
        'Details you noticed that others missed prove decisive today. Your precision is an asset, not a quirk.',
        'A system or routine that\'s been nagging you finally gets refined. The improvement is satisfying.',
        'Your analytical mind solves a problem efficiently. Don\'t downplay the skill behind what looks simple to you.',
        'Health and daily habits come into focus. One small improvement compounded becomes transformation.',
        'You see through the noise to what actually matters. That clarity is a rare gift.',
        'A service you render today is more impactful than you realize. The receiver will remember it.',
        'Perfectionism serves you when aimed at the right target — and costs you when aimed at everything.',
        'Information you\'ve been gathering starts to form a coherent picture. Trust the emerging pattern.',
        'Order creates peace for you. Invest ten minutes in organizing your space and feel the difference.',
        'Your discernment is sharp. Trust what you observe over what you\'re told today.',
        'A practical problem yields to methodical thinking. You\'re exactly the right person for it.',
        'Criticism you offer today lands well when it comes with a path forward. You already know the path.',
        'Mercury sharpens your communication. A well-crafted message achieves what hours of talking couldn\'t.',
        'Your modesty hides your competence from people who could champion you. Let a little light in.',
        'A health decision delayed too long comes back into focus. Take the first small step.',
        'Efficiency today means more time for what you actually enjoy. Optimize accordingly.',
        'Your eye for quality is a guide for others. Share your standards — they raise everyone.',
        'Anxiety masquerading as diligence is still anxiety. Recognize the difference and address the root.',
        'A project benefits enormously from your review. Your revision makes it genuinely better.',
        'Service and self-care are not opposites. You can give more when you\'re well-maintained.',
        'The gap between how things are and how they could be is your constant companion. Use it as a compass, not a torment.',
        'Your quiet reliability is noticed today. Someone expresses it or simply depends on it.',
        'A logical solution bypasses an emotional tangle. Not every problem needs to be processed — some need to be solved.',
        'Your standards protect you from wasted effort. Hold them, even when compromise feels easier.',
        'A habit you\'ve been building quietly shows tangible results. The compound interest of consistency.',
        'You catch an error before it becomes a problem. Your vigilance saves something valuable.',
        'The mind-body connection is particularly strong for you today. Physical care is mental care.',
        'You help someone understand something complex by breaking it into clear steps. Teaching is a form of mastery.',
        'Patience with imperfection — your own and others\' — is the practice of the day.',
        'The day ends neatly, tasks checked off, mind quieter than this morning. That\'s a Virgo kind of satisfaction.'
      ],
      libra: [
        'Balance is not a destination today — it\'s a practice. Each choice calibrates the scale slightly.',
        'Your gift for fairness resolves a dispute that has frustrated everyone else. You see what was missing.',
        'Beauty lifts your spirit today. Encounter it in art, nature, or the arrangement of ordinary things.',
        'A relationship benefits from your willingness to see the other side without abandoning your own.',
        'Diplomacy opens a door that directness would have closed. Your approach today is the right one.',
        'Indecision is information. When you can\'t choose, it often means the options are genuinely equal — or neither is right.',
        'Your social grace is at its peak. Use it to bridge a divide or simply make someone feel seen.',
        'Aesthetic choices matter today. The environment you create around yourself affects your thinking.',
        'Venus graces your interactions. A connection deepens or a new one forms with ease.',
        'Justice matters to you at a core level. A moment arises today to act on that value.',
        'You\'re being pulled in two directions. Honor both until the path of least inner conflict becomes clear.',
        'A collaborative project benefits from your ability to synthesize competing perspectives.',
        'Harmony at home creates the foundation for everything else. Invest in it today.',
        'Comparison is the thief of your particular joy. You\'re not in anyone else\'s race.',
        'Your natural charm serves a practical purpose today. Let it flow without overthinking.',
        'A decision you\'ve been avoiding becomes easier when you frame it as a value, not a preference.',
        'Partnership energy is strong. What you accomplish with another today exceeds what either could do alone.',
        'You notice injustice in a small, everyday form. Speaking up, even quietly, matters.',
        'Your peacemaking isn\'t passivity — it\'s skilled navigation. Be proud of that.',
        'The desire to please can obscure your own needs. Know what you want before seeking consensus.',
        'Art, music, or design speaks to something in you today. Let it in without analysis.',
        'A balanced perspective is your contribution to a heated discussion. It shifts the room.',
        'Elegance in communication — saying more with less — serves you particularly well today.',
        'Your sense of fairness extends to yourself. Treat yourself with the equity you extend to others.',
        'A partnership that\'s been out of alignment finds its footing again through a small but honest conversation.',
        'The scale tips toward joy today if you let it. Stop rebalancing toward worry.',
        'You are most yourself in relationship. The connections you nurture define and sustain you.',
        'Social energy runs high. An event or gathering that feels optional turns out to be important.',
        'Beauty is not trivial to you — it\'s essential. Honor that need today without apology.',
        'The evening finds you in a rare equilibrium. Savor it.'
      ],
      scorpio: [
        'Depth is your natural element. Go there today — surface-level answers won\'t satisfy you.',
        'Your perception cuts through pretense. What you see beneath the surface today is worth noting.',
        'Transformation is underway, even if it\'s invisible yet. Trust the process you feel but can\'t fully see.',
        'Power used with integrity amplifies your influence. Power used carelessly costs what matters most.',
        'An investigation — of information, of a person, of yourself — yields something significant.',
        'Your intensity is a gift and a challenge. Aim it at what deserves it; redirect it from what doesn\'t.',
        'A truth surfaces that changes how you understand a situation. Let it land before you react.',
        'Plutonian energy is strong today. Something dies so something better can grow.',
        'Your loyalty runs deep. Betrayal cuts you deeply too — discern who has earned which.',
        'Psychic sensitivity peaks today. Trust what you feel without requiring logical proof.',
        'Secrets have weight. Consider which ones you\'re carrying unnecessarily.',
        'Healing is available today — for old wounds, not just new ones. Enter the process willingly.',
        'Your strategic mind sees three steps ahead. Use that advantage to protect what you\'re building.',
        'Passion gives you access to reserves of energy that others simply don\'t have. Direct it well.',
        'Control and surrender are both options today. Wisdom is knowing which the moment requires.',
        'Your emotional honesty, when chosen deliberately, creates trust nothing else can.',
        'Jealousy visited briefly is useful information. Pursued, it becomes destructive. Notice and release.',
        'An obsession is either pointing you toward something important or trapping you. Only you can tell which.',
        'The shadow contains gifts. What you\'ve been avoiding holds something you actually need.',
        'Your resilience is legendary — to you and to those who\'ve watched you recover before.',
        'Research, investigation, or deep reading rewards you richly today.',
        'A financial matter benefits from your characteristic thoroughness. Leave nothing unexamined.',
        'Intimacy — not just physical, but psychological — is what you\'re seeking and offering.',
        'Your perception of others\' motivations is accurate today. Act on what you see, not what you\'re told.',
        'The phoenix energy is real. What you release today makes room for what you actually want.',
        'Revenge fantasies are expensive — they cost you more than the target. Consider that math.',
        'Your magnetism draws people to you today. Be intentional about which connections you deepen.',
        'Crisis reveals character. You perform at your best under pressure — even when you wish it weren\'t required.',
        'A private achievement matters more than a public one today. Internal alignment is the real win.',
        'The day ends with something resolved that you\'ve carried for too long. Release is a form of power.'
      ],
      sagittarius: [
        'Expansion calls to you today. Reach toward a bigger version of your life — and trust you\'ll land on your feet.',
        'A philosophical question that\'s been brewing finds a partial answer in an unexpected place.',
        'Adventure doesn\'t require a plane ticket. Today\'s version is intellectual, and it\'s just as exciting.',
        'Your optimism is contagious today. It lifts a situation that logic had given up on.',
        'Freedom is your birthright. An area of your life that feels constrained needs a renegotiation.',
        'A teacher or mentor figure — real or figurative — arrives with exactly the perspective you needed.',
        'Your honesty is refreshing in a world of careful positioning. Use it generously today.',
        'Jupiter expands what you touch today. Think bigger without abandoning the practical.',
        'A cultural, international, or cross-disciplinary connection enriches your thinking.',
        'The search for meaning leads somewhere concrete today. Pay attention to the signpost.',
        'Restlessness is your engine. Point it toward a worthy destination rather than letting it idle.',
        'Laughter is medicine today — yours and someone else\'s. Don\'t ration it.',
        'A long-distance connection sparks something worthwhile. Reach out across the gap.',
        'Your belief in possibilities has changed outcomes before. Apply it to a current situation.',
        'Study, teaching, or publication benefits from your natural enthusiasm and broad perspective.',
        'Bluntness can be precision or carelessness — the difference is care for the listener.',
        'An arrow shot with conviction lands true today. Trust your aim.',
        'The bigger picture is your native territory. Step back from the details and let your vision work.',
        'Generosity of spirit opens more doors than strategy. Be genuinely giving today.',
        'Your sense of humor navigates a tense moment that formality would have made worse.',
        'A belief you\'ve held gets tested. Examine it honestly — update it if the evidence warrants.',
        'Wanderlust surfaces. Feed it even partially — a new neighborhood, a foreign film, a different route.',
        'Ethics matter to you at a bone-deep level. A situation today asks you to act on that.',
        'You see the future others can\'t yet imagine. Share that vision in a way they can act on.',
        'Independence and connection aren\'t opposites. Today offers a version of both.',
        'Your enthusiasm for a new idea is infectious. Pitch it — the timing is right.',
        'Dogma, even your own, limits you. Approach today with beginner\'s mind.',
        'The road ahead looks good from where you stand. Trust the trajectory you\'re on.',
        'Someone needs your optimism today. Give it freely — you have more than enough to share.',
        'The day ends with a sense of possibility. Sagittarius\'s greatest gift is keeping that alive.'
      ],
      capricorn: [
        'Ambition and patience operating together are unstoppable. Today both are available to you.',
        'A long-term investment — financial, relational, or professional — shows signs of yield.',
        'Your reputation is built in moments like this one. Act in alignment with who you\'re becoming.',
        'Discipline today creates freedom later. The delayed gratification equation works in your favor.',
        'Authority is available to you — earned, not assumed. Exercise it with the gravitas it deserves.',
        'Your pragmatism cuts through wishful thinking and finds the path that actually works.',
        'A mentor relationship — as the giver or receiver — holds unusual value right now.',
        'Saturn\'s lessons are hard but honest. What\'s being demanded of you is also building you.',
        'Your work ethic is unmatched today. Set a pace that\'s sustainable and let the hours do their work.',
        'Legacy thinking serves you well. What are you building that will outlast today\'s urgency?',
        'A setback is data, not defeat. Adjust the plan and continue with characteristic resolve.',
        'Your calm under pressure is noticed by those who can make a difference in your trajectory.',
        'Responsibility is not burden — it\'s proof of trust. Carry it with pride.',
        'Material security concerns get addressed practically and effectively today.',
        'You earn something today — an accomplishment, a respect, a small but real summit.',
        'Structure is not a cage for you — it\'s a scaffold. Build within it.',
        'Slow accumulation is your strategy and it\'s working, even when you can\'t see it yet.',
        'An elder, authority figure, or institutional connection opens a door you\'ve been standing outside.',
        'Your long memory for who showed up and who didn\'t guides a current decision correctly.',
        'Vulnerability is not weakness. The right person sees your depth today and values it.',
        'You\'ve earned the right to say no to what doesn\'t serve your climb. Exercise it.',
        'A systems problem yields to your organizational mind. The solution is elegant and durable.',
        'Your sense of humor is drier than most — today it relieves a tension nothing else could.',
        'Patience that would exhaust others sustains you. You\'re playing a longer game.',
        'Recognition for sustained effort arrives — quietly, as it usually does for you.',
        'A goal clarifies. The mountain comes into view. Put one foot forward.',
        'The foundation you\'ve been laying is solid. What gets built on it next is up to you.',
        'Professionalism and genuine care are not opposites. Today you demonstrate both.',
        'Your self-discipline produces results that inspire people who could never maintain it themselves.',
        'The day ends with more completed than when it started. For you, that is a form of joy.'
      ],
      aquarius: [
        'Your vision of how things could be is not naive — it\'s necessary. Don\'t let the pragmatists dim it.',
        'Community and connection serve a larger purpose today. Who you bring together matters.',
        'An unconventional approach solves a problem that conventional thinking has made worse.',
        'Your humanitarian instincts are activated. A cause worth your energy becomes clear.',
        'Originality is your signature. Don\'t sand down the edges to fit expectations.',
        'Technology, innovation, or systems thinking puts you ahead of the curve today.',
        'Your detachment, often misread as coldness, provides the objectivity a situation desperately needs.',
        'Uranus stirs things up in a productive way. Welcome the disruption — it\'s carrying something better.',
        'A group or collective you belong to benefits from your perspective and presence.',
        'The future you\'re building toward is worth the present-day strangeness of pursuing it.',
        'Your egalitarian instincts correct an imbalance today. Fairness is its own reward.',
        'An idea that seemed too strange to share finds exactly the right listener. Share it.',
        'Your mind makes connections across domains that specialists miss. That\'s an extraordinary gift.',
        'Independence and cooperation: you need both. Today offers a rare version of each.',
        'A friendship surprises you with its depth. Aquarius lives for this kind of discovery.',
        'Social change isn\'t abstract to you — it\'s personal. An action today reflects that.',
        'You see what\'s coming before others do. Use that foresight responsibly.',
        'Your authenticity, even when it costs you approval, is the most powerful thing about you.',
        'A rebellion against the expected produces exactly the result you were hoping for.',
        'The collective good and your personal interest align today. Act on both.',
        'Eccentricity is not a flaw — it\'s the marker of original thinking. Wear it.',
        'Your network is a resource today. A connection you\'ve maintained pays forward.',
        'Old patterns and outdated systems lose their hold. Something fresher and truer takes their place.',
        'You care deeply while appearing not to — the caring is real, even when the detachment is too.',
        'An intellectual adventure today leads somewhere emotionally significant. Follow it through.',
        'Your capacity for universal thinking doesn\'t diminish personal loyalty. Both are true of you.',
        'A humanitarian gesture, even a small one, is meaningful and correct today.',
        'Radical honesty in a situation that expects politeness changes the dynamic for the better.',
        'You\'re ahead of your time — the timeline will eventually catch up. Hold the vision.',
        'The day ends with your mind still going. For Aquarius, that\'s not insomnia — it\'s alive.'
      ],
      pisces: [
        'Your imagination reaches a depth today that deserves a creative outlet. Give it one.',
        'The boundary between your feelings and others\' is thin today. Protect your energy intentionally.',
        'Spiritual awareness heightens. Something you\'ve been sensing becomes clearer.',
        'Compassion without self-loss is the practice of the day. You can feel for someone without drowning with them.',
        'A dream — literal or figurative — holds more guidance than the day\'s rational plan.',
        'Your artistic sensibility finds exactly the medium or moment it\'s been looking for.',
        'Neptune deepens your perception. What you sense beneath the surface is worth heeding.',
        'A sacrifice you\'ve been making quietly is noticed and valued today.',
        'Water, rest, and solitude restore you in a way nothing else can. Seek at least one today.',
        'Your capacity for forgiveness heals something in you, not just in the one forgiven.',
        'Illusion and inspiration look similar from the inside. Test yours gently before acting.',
        'Your empathy today is both your gift and your responsibility. Use it wisely.',
        'A mystical or transcendent experience — brief, but real — shifts your perspective.',
        'Creativity flows without force today. Get out of the way and let it move through you.',
        'A lost thing — idea, feeling, object — is found in an unexpected place.',
        'Boundaries created from love rather than fear hold without requiring constant defense.',
        'Your sensitivity to beauty — in art, in people, in moments — is a form of intelligence.',
        'Healing is available today at whatever depth you\'re willing to go.',
        'The veil between conscious and unconscious thins. Pay attention to what surfaces.',
        'Your idealism serves as the north star in a situation that has lost its direction.',
        'Music, poetry, or visual art carries a message for you today. Receive it.',
        'Sacrifice made consciously is powerful. Made resentfully, it corrodes.',
        'A connection to something larger than yourself — the cosmos, the divine, the collective — steadies you.',
        'Your intuition about a person is accurate. Trust it over their presentation.',
        'Rest is not escape today — it\'s genuine renewal. Honor it without guilt.',
        'What you feel is real data. You don\'t need external validation to trust your inner experience.',
        'Compassion extended to yourself today is the prerequisite for extending it authentically to others.',
        'The unconscious is your collaborator. What emerges in daydream or meditation has value.',
        'Your faith — in people, in outcomes, in the unseen — is tested and holds.',
        'The day ends softly, like the tide going out. That\'s the rhythm you were made for.'
      ]
    };

    const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
                   'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];

    const horoscopes = {};
    signs.forEach(sign => {
      const signReadings = readings[sign];
      horoscopes[sign] = {
        sign: sign.charAt(0).toUpperCase() + sign.slice(1),
        horoscope: signReadings[dayOfMonth % signReadings.length]
      };
    });

    resolve(horoscopes);
  });
}

// Function to get upcoming meteor showers
function getUpcomingMeteorShowers() {
  // 2026 major meteor showers with peak dates
  const meteorShowers = [
    { name: 'Quadrantids', peak: '2026-01-04', peakDate: new Date('2026-01-04'), rate: '120/hr', description: 'Best viewed before dawn' },
    { name: 'Lyrids', peak: '2026-04-22', peakDate: new Date('2026-04-22'), rate: '20/hr', description: 'Ancient shower from Comet Thatcher' },
    { name: 'Eta Aquarids', peak: '2026-05-06', peakDate: new Date('2026-05-06'), rate: '60/hr', description: 'Debris from Halley\'s Comet' },
    { name: 'Perseids', peak: '2026-08-12', peakDate: new Date('2026-08-12'), rate: '100/hr', description: 'Most popular shower, excellent for viewing' },
    { name: 'Draconids', peak: '2026-10-08', peakDate: new Date('2026-10-08'), rate: 'Variable', description: 'Best viewed in evening' },
    { name: 'Orionids', peak: '2026-10-21', peakDate: new Date('2026-10-21'), rate: '25/hr', description: 'Also from Halley\'s Comet' },
    { name: 'Leonids', peak: '2026-11-17', peakDate: new Date('2026-11-17'), rate: '15/hr', description: 'Fast, bright meteors' },
    { name: 'Geminids', peak: '2026-12-14', peakDate: new Date('2026-12-14'), rate: '150/hr', description: 'Best shower of the year' }
  ];

  const now = new Date();
  // Filter for upcoming showers within next 90 days
  const upcoming = meteorShowers.filter(shower => {
    const daysUntil = (shower.peakDate - now) / (1000 * 60 * 60 * 24);
    return daysUntil >= -2 && daysUntil <= 90; // Show if peak is within 90 days or just passed (2 days ago)
  });

  // Format the showers
  return upcoming.map(shower => ({
    name: shower.name,
    peak: shower.peakDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    rate: shower.rate,
    description: shower.description,
    daysUntil: Math.ceil((shower.peakDate - now) / (1000 * 60 * 60 * 24))
  }));
}

// Function to fetch ISS pass predictions for Neenah, WI using Open-Notify API
function fetchISSPasses() {
  return new Promise((resolve) => {
    const latitude = 44.1858;
    const longitude = -88.4626;
    const http = require('http'); // Open-Notify uses http, not https
    const url = `http://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}&n=5`;

    http.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.response && Array.isArray(response.response)) {
            // Get the passes and format the data
            const formattedPasses = response.response.map(pass => ({
              risetime: pass.risetime,
              duration: pass.duration,
              riseDate: new Date(pass.risetime * 1000).toLocaleDateString('en-US', {
                weekday: 'short', month: 'short', day: 'numeric'
              }),
              riseTime: new Date(pass.risetime * 1000).toLocaleTimeString('en-US', {
                hour: '2-digit', minute: '2-digit'
              }),
              durationMin: Math.round(pass.duration / 60)
            }));
            resolve(formattedPasses);
          } else {
            resolve([]);
          }
        } catch (err) {
          console.log('Error parsing ISS passes:', err);
          resolve([]);
        }
      });
    }).on('error', (err) => {
      console.log('Error fetching ISS passes:', err);
      resolve([]);
    });
  });
}

// Copy images directory to dist
function copyImages() {
  const sourceDir = './images';
  const destDir = './dist/images';

  if (fs.existsSync(sourceDir)) {
    fs.mkdir(destDir, { recursive: true }, (err) => {
      if (err) {
        console.error('Error creating images directory:', err);
        return;
      }

      // Copy gallery folder
      const gallerySource = path.join(sourceDir, 'gallery');
      const galleryDest = path.join(destDir, 'gallery');

      if (fs.existsSync(gallerySource)) {
        fs.mkdir(galleryDest, { recursive: true }, (err) => {
          if (err) {
            console.error('Error creating gallery directory:', err);
            return;
          }

          fs.readdir(gallerySource, (err, files) => {
            if (err) {
              console.error('Error reading gallery directory:', err);
              return;
            }

            files.forEach(file => {
              if (/\.(jpg|jpeg|png|gif)$/i.test(file)) {
                fs.copyFile(
                  path.join(gallerySource, file),
                  path.join(galleryDest, file),
                  (err) => {
                    if (err) {
                      console.error(`Error copying ${file}:`, err);
                    } else {
                      console.log(`Copied image: ${file}`);
                    }
                  }
                );
              }
            });
          });
        });
      }
    });
  }
}

function createFile(fileName, data) {
  fs.writeFile(fileName, data, (err) => {
    if (!err) {
      console.log('File created: ' + fileName);
    }
  });
}

function itemTemplate(item) {
  return `<li class="mb-1">
    <a rel="noopener" target="_blank" href="${item.link}" title="${item.title}">${item.title}</a>
    <time datetime="${item.pubDate}" class="ps-2 small">${item.pubDate}</time>
  </li>`
}

sources.sections.forEach((section) => {
  section.items.forEach((item) => {
    promises.push(
      parser.parseURL(item.url).catch(err => {
        console.log(`Error fetching ${item.title}:`, err.message);
        return { title: item.title, items: [] };
      })
    );
  });
});

// Add API fetches to promises
promises.push(fetchQuote());
promises.push(fetchAPOD());
promises.push(fetchWeatherForecast());
promises.push(fetchVisiblePlanets());
promises.push(fetchHoroscopes());
promises.push(fetchISSPasses());

Promise.all(promises).then((results) => {
  // Extract results: quote is 6th from end, apod is 5th from end, weather is 4th from end, planets is 3rd from end, horoscopes is 2nd from end, iss is last
  const quote = results[results.length - 6];
  const apod = results[results.length - 5];
  const weather = results[results.length - 4];
  const planets = results[results.length - 3];
  const horoscopes = results[results.length - 2];
  const issPasses = results[results.length - 1];
  const feeds = results.slice(0, results.length - 6);

  let output = ``;

  feeds.forEach((feed) => {
    output += `<section class="row">`;
      output += `<div class="col">`;
        output += `<h2 class="h3">${feed.title}</h2>`;
        output += '<ul class="mb-4">';
        output += feed.items.slice(0, 10).map(itemTemplate).join('');
        output += '</ul>';
      output += `</div>`;
    output += `</section>`;
  });

  // Get all gallery images, shuffled
  const galleryImages = getGalleryImages();

  // Get upcoming meteor showers
  const meteorShowers = getUpcomingMeteorShowers();

  // Get daily astronomy joke
  const dailyJoke = getDailyAstronomyJoke();

  // Get current date/time info
  const now = new Date();
  const dateTimeInfo = {
    date: now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  };

  output = templates.document(output, galleryImages, quote, dateTimeInfo, apod, horoscopes, weather, planets, issPasses, meteorShowers, dailyJoke);

  // Copy images to dist folder
  copyImages();

  createFile('./dist/index.html', output)
});