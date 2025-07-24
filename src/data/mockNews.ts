import { News } from '@/types/news';

export const mockNews: News[] = [
  {
    id: '1',
    title: 'Annual Science Fair 2024 - Students Showcase Innovation',
    slug: 'annual-science-fair-2024',
    content: `
      <p>Blossom Private School proudly hosted its Annual Science Fair 2024, where students from all grade levels presented their innovative projects and scientific discoveries. The event showcased the creativity and scientific thinking of our young minds.</p>
      
      <p>This year's fair featured over 50 projects covering various fields including physics, chemistry, biology, environmental science, and technology. Students demonstrated their understanding of scientific principles through hands-on experiments and research projects.</p>
      
      <p>The winning projects included a solar-powered water purification system by Grade 10 students, an AI-based plant disease detection app by Grade 12 students, and a biodegradable plastic alternative made from banana peels by Grade 9 students.</p>
      
      <p>We congratulate all participants for their dedication and innovative thinking. Special thanks to our science teachers for their guidance and support throughout the preparation process.</p>
    `,
    featured_image: '/science-fair.jpg',
    excerpt: 'Students showcase their innovative scientific projects at our Annual Science Fair 2024, demonstrating creativity and scientific thinking across various fields.',
    published_at: '2024-03-15T08:00:00Z',
    status: 'published',
    category: 'Academic Events',
    tags: ['science', 'innovation', 'students', 'fair'],
    author: 'Dr. Khin Khin Win',
    reading_time: 3
  },
  {
    id: '2',
    title: 'New Digital Library Opens for Students',
    slug: 'new-digital-library-opens',
    content: `
      <p>We are excited to announce the opening of our new state-of-the-art Digital Library, providing students with access to thousands of digital books, research materials, and educational resources.</p>
      
      <p>The digital library features:</p>
      <ul>
        <li>Over 10,000 e-books covering various subjects</li>
        <li>Access to international academic journals</li>
        <li>Interactive learning modules</li>
        <li>Research databases for advanced students</li>
        <li>Multimedia resources including videos and audiobooks</li>
      </ul>
      
      <p>Students can access the digital library both on-campus and from home using their student credentials. This initiative is part of our commitment to providing modern educational resources and preparing students for the digital age.</p>
    `,
    featured_image: '/digital-library.jpg',
    excerpt: 'Our new Digital Library opens with over 10,000 e-books and educational resources, enhancing learning opportunities for all students.',
    published_at: '2024-03-10T09:30:00Z',
    status: 'published',
    category: 'Facilities',
    tags: ['digital', 'library', 'resources', 'technology'],
    author: 'Ms. Thant Sin Aye',
    reading_time: 2
  },
  {
    id: '3',
    title: 'Cultural Festival Celebrates Diversity and Unity',
    slug: 'cultural-festival-2024',
    content: `
      <p>Blossom Private School's annual Cultural Festival brought together students, families, and the community to celebrate the rich diversity of Myanmar's cultural heritage and international traditions.</p>
      
      <p>The festival featured traditional performances, cultural exhibitions, international food stalls, and interactive workshops where students learned about different cultures and traditions from around the world.</p>
      
      <p>Highlights of the event included traditional dance performances from various regions of Myanmar, international music presentations, and a fashion show showcasing traditional costumes from different countries.</p>
      
      <p>The event not only entertained but also educated our students about the importance of cultural diversity and global citizenship, values that are central to our educational philosophy.</p>
    `,
    featured_image: '/cultural-festival.png',
    excerpt: 'Our Cultural Festival celebrates diversity with traditional performances, exhibitions, and workshops showcasing Myanmar and international heritage.',
    published_at: '2024-02-28T10:00:00Z',
    status: 'published',
    category: 'Cultural Events',
    tags: ['culture', 'festival', 'diversity', 'community'],
    author: 'U Thura Aung',
    reading_time: 2
  },
  {
    id: '4',
    title: 'Character Building Program Launches New Initiative',
    slug: 'character-building-program-launch',
    content: `
      <p>Blossom Private School is proud to launch our enhanced Character Building Program, designed to develop well-rounded individuals with strong moral values and leadership skills.</p>
      
      <p>The program focuses on five core pillars:</p>
      <ul>
        <li>Integrity and Honesty</li>
        <li>Compassion and Empathy</li>
        <li>Leadership and Responsibility</li>
        <li>Resilience and Perseverance</li>
        <li>Global Citizenship</li>
      </ul>
      
      <p>Through interactive workshops, community service projects, and mentorship programs, students will develop the character traits necessary for success in life and positive contribution to society.</p>
      
      <p>The program is integrated into our curriculum and co-curricular activities, ensuring that character development is woven throughout the educational experience.</p>
    `,
    featured_image: '/building-character.jpg',
    excerpt: 'Our enhanced Character Building Program focuses on developing integrity, compassion, leadership, and global citizenship in our students.',
    published_at: '2024-02-20T11:15:00Z',
    status: 'published',
    category: 'Programs',
    tags: ['character', 'values', 'leadership', 'development'],
    author: 'Ms. Aye Aye Mon',
    reading_time: 3
  },
  {
    id: '5',
    title: 'Cambridge English Qualifications Program Update',
    slug: 'cambridge-english-program-update',
    content: `
      <p>We are pleased to provide an update on our Cambridge English Qualifications Program, which continues to prepare our students for international English language certifications.</p>
      
      <p>Recent achievements include:</p>
      <ul>
        <li>95% pass rate in Cambridge YLE (Young Learners English) tests</li>
        <li>87% of students achieving Merit or Distinction grades</li>
        <li>Expansion of program to include Cambridge KET and PET preparations</li>
        <li>Introduction of specialized speaking practice sessions</li>
      </ul>
      
      <p>Our qualified Cambridge English teachers continue to provide high-quality instruction using the latest materials and methodologies approved by Cambridge Assessment English.</p>
      
      <p>Registration for the next examination session is now open. Please contact the school office for more information about enrollment and examination schedules.</p>
    `,
    featured_image: '/cambridge_light_mode.png',
    excerpt: 'Updates on our Cambridge English Qualifications Program showing excellent student achievements and program expansion.',
    published_at: '2024-02-15T08:45:00Z',
    status: 'published',
    category: 'Academic Programs',
    tags: ['cambridge', 'english', 'qualifications', 'achievements'],
    author: 'Ms. Emily Johnson',
    reading_time: 2
  },
  {
    id: '6',
    title: 'Upcoming Parent-Teacher Conference Schedule',
    slug: 'parent-teacher-conference-schedule',
    content: `
      <p>We would like to invite all parents to our upcoming Parent-Teacher Conference scheduled for the first week of April 2024.</p>
      
      <p>Conference Schedule:</p>
      <ul>
        <li>April 1-2: Primary School (Grades 1-5)</li>
        <li>April 3-4: Middle School (Grades 6-8)</li>
        <li>April 5-6: High School (Grades 9-12)</li>
      </ul>
      
      <p>During these conferences, teachers will discuss your child's academic progress, social development, and provide recommendations for continued growth. This is also an excellent opportunity for parents to ask questions and discuss any concerns.</p>
      
      <p>Please contact our school office to schedule your appointment. We recommend booking early as slots fill up quickly.</p>
      
      <p>We look forward to meeting with you and working together to support your child's educational journey.</p>
    `,
    featured_image: '/blossom-logo.png',
    excerpt: 'Parent-Teacher Conferences scheduled for April 1-6, 2024. Book your appointment early to discuss your child\'s progress.',
    published_at: '2024-03-18T14:00:00Z',
    status: 'published',
    category: 'School Events',
    tags: ['parents', 'teachers', 'conference', 'academic'],
    author: 'Principal Daw Khin Thida',
    reading_time: 2
  }
];

export const getNewsBySlug = (slug: string): News | undefined => {
  return mockNews.find(news => news.slug === slug);
};

export const getNewsById = (id: string): News | undefined => {
  return mockNews.find(news => news.id === id);
};

export const getNewsByCategory = (category: string): News[] => {
  return mockNews.filter(news => news.category === category && news.status === 'published');
};

export const getPublishedNews = (): News[] => {
  return mockNews.filter(news => news.status === 'published').sort((a, b) => 
    new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );
};

export const searchNews = (query: string): News[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockNews.filter(news => 
    news.status === 'published' && (
      news.title.toLowerCase().includes(lowercaseQuery) ||
      news.excerpt.toLowerCase().includes(lowercaseQuery) ||
      news.content.toLowerCase().includes(lowercaseQuery) ||
      news.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    )
  );
};

export const getNewsCategories = (): string[] => {
  const categories = mockNews
    .filter(news => news.status === 'published')
    .map(news => news.category)
    .filter((category): category is string => category !== undefined);
  
  return Array.from(new Set(categories));
};