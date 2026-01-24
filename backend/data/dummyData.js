export const categories = [
  { id: 1, name: "Technology", posts: 2340, color: "from-blue-400 to-blue-600" },
  { id: 2, name: "Lifestyle", posts: 1890, color: "from-green-400 to-green-600" },
  { id: 3, name: "Travel", posts: 1560, color: "from-yellow-400 to-orange-500" },
  { id: 4, name: "Food", posts: 1420, color: "from-red-400 to-pink-500" },
  { id: 5, name: "Business", posts: 1230, color: "from-purple-400 to-indigo-500" },
  { id: 6, name: "Health", posts: 980, color: "from-teal-400 to-emerald-500" }
];

export const posts = [
  // Technology
  {
    id: 1,
    title: "The Future of AI in Creative Writing",
    excerpt: "Will AI replace authors or become their most powerful tool? Exploring the synergy between human creativity and machine intelligence.",
    content: "Artificial Intelligence has been making waves in every industry, and creative writing is no exception. \n\nFrom assisting with plot structures to generating character names, AI tools like GPT-4 are becoming indispensable for modern authors. However, the question remains: Can a machine truly replicate the human soul found in great literature? \n\nWhile AI can mimic style and syntax, strict emotional depth often requires a human touch. The future likely holds a collaborative model where AI acts as a co-pilot, handling the mundane aspects of writing while humans focus on the heart of the story.",
    author: "Sarah Jenkins",
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    likes: 856,
    comments: 120,
    views: 5400,
    readTime: "12 min read",
    createdAt: "1 day ago"
  },
  {
    id: 101,
    title: "Virtual Reality: Beyond Gaming",
    excerpt: "How VR is transforming education, healthcare, and remote work interaction.",
    content: "Virtual Reality (VR) is often associated with immersive gaming, but its potential extends far beyond entertainment. \n\nIn healthcare, VR is being used for pain management and surgical training. In education, students can take virtual field trips to Mars or the Louvre. As hardware becomes more accessible, we are seeing a shift towards the 'Metaverse' where digital interactions feel as real as physical ones.",
    author: "David Kim",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1592478411213-61535fdd861d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    likes: 420,
    comments: 45,
    views: 3100,
    readTime: "8 min read",
    createdAt: "2 days ago"
  },
  {
    id: 102,
    title: "Web 3.0: A Decentralized Internet",
    excerpt: "Understanding blockchain, NFTs, and the promise of a user-owned web.",
    content: "The internet is evolving. Web 1.0 was read-only. Web 2.0 was read-write (social media). Web 3.0 promises to be read-write-own. \n\nBy leveraging blockchain technology, users can own their data and digital assets without relying on centralized tech giants. This article explores the implications of this shift for privacy, economy, and online identity.",
    author: "Alex Chen",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    likes: 350,
    comments: 28,
    views: 2800,
    readTime: "10 min read",
    createdAt: "3 days ago"
  },

  // Business
  {
    id: 201,
    title: "Remote Work Revolution 2026",
    excerpt: "Why the office as we know it is gone forever, and what replaces it.",
    content: "The pandemic accelerated a trend that was already in motion. Now, in 2026, remote work is not just an option; it's the default for knowledge workers. \n\nCompanies that insist on full-time office returns are losing top talent. The hybrid model has emerged as the winner, balancing collaboration with deep work. We explore the tools and cultures that define successful remote-first organizations.",
    author: "Emily Roberts",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    category: "Business",
    image: "https://images.unsplash.com/photo-1593642632823-8f78536788c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    likes: 510,
    comments: 67,
    views: 4200,
    readTime: "7 min read",
    createdAt: "5 hours ago"
  },
  {
    id: 202,
    title: "Bootstrapping vs VC Funding",
    excerpt: "The pros and cons of raising capital versus growing your startup organically.",
    content: "For startup founders, the allure of a massive Venture Capital check is strong. But is it always the right path? \n\nBootstrapping allows you to retain full control and equity, forcing you to focus on profitability from day one. VC funding provides rocket fuel for growth but comes with high pressure and diluted ownership. We interview founders from both sides of the divide.",
    author: "Michael Ross",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    category: "Business",
    image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    likes: 290,
    comments: 15,
    views: 1900,
    readTime: "6 min read",
    createdAt: "1 week ago"
  },
  {
    id: 203,
    title: "Sustainable Business Practices",
    excerpt: "Why going green is good for the planet and your bottom line.",
    content: "Consumers are voting with their wallets, and sustainability is a key factor. \n\nBusinesses that adopt eco-friendly practices are seeing higher customer loyalty and employee retention. From supply chain transparency to carbon neutrality, we look at how modern companies are building a greener future.",
    author: "Sarah Jenkins",
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    category: "Business",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb7d5afa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    likes: 600,
    comments: 89,
    views: 5100,
    readTime: "9 min read",
    createdAt: "4 days ago"
  },

  // Food
  {
    id: 301,
    title: "The Rise of Plant-Based Fine Dining",
    excerpt: "Vegetables are taking center stage in the world's top restaurants.",
    content: "Gone are the days when vegetarian options were an afterthought. \n\nTop chefs around the world are dedicating entire menus to the art of plant-based cuisine. We explore how fermentation, molecular gastronomy, and sourcing local ingredients are elevating vegetables to Michelin-star status.",
    author: "Jessica Park",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    category: "Food",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    likes: 780,
    comments: 112,
    views: 6500,
    readTime: "5 min read",
    createdAt: "12 hours ago"
  },
  {
    id: 302,
    title: "Mastering Sourdough at Home",
    excerpt: "A comprehensive guide to keeping your starter alive and baking the perfect loaf.",
    content: "Baking bread is an ancient tradition that surged back into popularity recently. \n\nBut sourdough can be finicky. In this guide, we break down the science of wild yeast, hydration percentages, and the importance of patience. Get ready to bake the crustiest, airiest bread of your life.",
    author: "David Kim",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    category: "Food",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    likes: 450,
    comments: 56,
    views: 3200,
    readTime: "15 min read",
    createdAt: "1 week ago"
  },
  {
    id: 303,
    title: "Street Food Capitals of the World",
    excerpt: "A culinary tour through Bangkok, Mexico City, and Istanbul.",
    content: "Some of the best food isn't found in white-tablecloth restaurants, but on the busy corners of bustling cities. \n\nFrom the spicy Pad Kra Pao of Thailand to the savory Tacos al Pastor in Mexico, we take you on a journey to discover the most authentic flavors the world has to offer.",
    author: "Maria Garcia",
    authorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    category: "Food",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    likes: 920,
    comments: 140,
    views: 8900,
    readTime: "10 min read",
    createdAt: "2 days ago"
  },

  // Travel
  {
    id: 401,
    title: "Japan: A Blend of Tradition and Future",
    excerpt: "Exploring the neon streets of Tokyo and the serene temples of Kyoto.",
    content: "Japan is a country of contrasts. High-speed bullet trains whiz past ancient shrines. \n\nThis travelogue covers a 2-week itinerary starting in the electric Akihabara district of Tokyo, moving through the food heaven of Osaka, and ending in the peaceful bamboo forests of Arashiyama. Tips on rail passes, etiquette, and accommodation included.",
    author: "Maria Garcia",
    authorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    category: "Travel",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    likes: 1100,
    comments: 200,
    views: 12500,
    readTime: "12 min read",
    createdAt: "1 day ago"
  },
  {
    id: 402,
    title: "Solo Travel: Why Everyone Should Do It",
    excerpt: "The daunting yet liberating experience of exploring the world alone.",
    content: "Traveling alone forces you out of your comfort zone. You are solely responsible for your decisions, which builds incredible confidence. \n\nIt also opens you up to meeting new people in ways that traveling in a group does not. We discuss safety tips, destination recommendations, and the joy of complete freedom.",
    author: "Emily Roberts",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    category: "Travel",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    likes: 670,
    comments: 88,
    views: 5600,
    readTime: "8 min read",
    createdAt: "3 days ago"
  },
  {
    id: 403,
    title: "Eco-Tourism: Leaving No Trace",
    excerpt: "How to travel responsibly and preserve the beauty of our planet.",
    content: "As tourism booms, fragile ecosystems are at risk. \n\nEco-tourism is about visiting natural areas in a way that conserves the environment and improves the well-being of local people. We highlight key destinations like Costa Rica and Norway that are leading the way in sustainable travel.",
    author: "Marcus Chen",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    category: "Travel",
    image: "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    likes: 540,
    comments: 42,
    views: 3900,
    readTime: "6 min read",
    createdAt: "4 hours ago"
  },

  // Lifestyle
  {
    id: 501,
    title: "Minimalism: A Path to Better Living",
    excerpt: "Decluttering your space can lead to a less cluttered mind.",
    content: "Minimalism isn't just about having white walls and fewer chairs. It's about intentionality. \n\nBy stripping away the excess—whether it's physical possessions, digital noise, or toxic relationships—you make room for what truly matters. This article guides you through the first steps of a minimalist lifestyle.",
    author: "David Kim",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    likes: 420,
    comments: 38,
    views: 2100,
    readTime: "6 min read",
    createdAt: "2 days ago"
  },
  {
    id: 502,
    title: "Digital Detox: Reclaiming Your Attention",
    excerpt: "Strategies to disconnect from screens and reconnect with reality.",
    content: "We touch our phones an average of 2,617 times a day. \n\nScreen addiction is real, and it affects our focus, sleep, and mental health. We try a 7-day digital detox challenge and share the results. Spoiler: The world didn't end when we logged off.",
    author: "Sarah Jenkins",
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1511184111239-4f670e3c0336?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    likes: 380,
    comments: 30,
    views: 2400,
    readTime: "7 min read",
    createdAt: "3 days ago"
  },
  {
    id: 503,
    title: "The Power of a Morning Routine",
    excerpt: "How the first hour of your day determines your success.",
    content: "Many of the world's most successful people swear by a morning routine. \n\nWhether it's meditation, exercise, or simply enjoying a coffee in silence, establishing a ritual can ground you before the chaos of the day begins. We analyze the routines of CEOs, athletes, and artists.",
    author: "Jessica Park",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1489533119213-35a5a02225a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    likes: 550,
    comments: 62,
    views: 4100,
    readTime: "5 min read",
    createdAt: "1 week ago"
  },

  // Health
  {
    id: 601,
    title: "Mental Health in a Hectic World",
    excerpt: "Why prioritizing your psyche is as important as physical fitness.",
    content: "Mental health awareness has come a long way, but stigma persists. \n\nStress, anxiety, and burnout are rising globally. This article discusses practical coping mechanisms, the importance of therapy, and how to build mental resilience in challenging times.",
    author: "Dr. Alan Grant",
    authorAvatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    category: "Health",
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    likes: 890,
    comments: 150,
    views: 9200,
    readTime: "11 min read",
    createdAt: "2 days ago"
  },
  {
    id: 602,
    title: "The Science of Sleep",
    excerpt: "Understanding specific cycles and how to get better rest.",
    content: "Sleep is the foundation of health. \n\nDuring REM and Deep Sleep, our bodies repair cells and consolidate memories. We delve into circadian rhythms, the impact of blue light, and actionable tips for a better night's rest.",
    author: "Sarah Jenkins",
    authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    category: "Health",
    image: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    likes: 670,
    comments: 78,
    views: 5800,
    readTime: "9 min read",
    createdAt: "4 days ago"
  },
  {
    id: 603,
    title: "HIIT vs Steady State Cardio",
    excerpt: "Which workout is best for your goals? A breakdown of the evidence.",
    content: "High-Intensity Interval Training (HIIT) promises results in less time, while steady-state cardio builds endurance. \n\nWe compare the caloric burn, afterburn effect (EPOC), and impact on cardiovascular health to help you decide which training modality fits your lifestyle.",
    author: "Marcus Chen",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    category: "Health",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    likes: 410,
    comments: 29,
    views: 3100,
    readTime: "7 min read",
    createdAt: "1 week ago"
  }
];

export const trending = [
  { id: 1, title: "The Future of AI in Creative Writing", views: "5.4K" },
  { id: 401, title: "Japan: A Blend of Tradition and Future", views: "12.5K" },
  { id: 301, title: "The Rise of Plant-Based Fine Dining", views: "6.5K" },
  { id: 601, title: "Mental Health in a Hectic World", views: "9.2K" }
];

export const writers = [
  { id: 1, name: "Maria Garcia", followers: "45.2K", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" },
  { id: 2, name: "Sarah Jenkins", followers: "38.7K", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" },
  { id: 3, name: "David Kim", followers: "32.4K", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" }
];
