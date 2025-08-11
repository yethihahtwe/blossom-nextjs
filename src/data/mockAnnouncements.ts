import { Announcement } from '@/types/announcement';

export const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'School Holiday Schedule - Mid-Term Break',
    slug: 'school-holiday-schedule-mid-term-break',
    content: `
      <div class="prose prose-lg max-w-none">
        <p>We would like to inform all students, parents, and staff about the upcoming mid-term break schedule for this academic year.</p>
        
        <h3>Holiday Schedule</h3>
        <ul>
          <li><strong>Last Day of Classes:</strong> Friday, March 15, 2024</li>
          <li><strong>Mid-Term Break:</strong> March 18 - March 29, 2024</li>
          <li><strong>Classes Resume:</strong> Monday, April 1, 2024</li>
        </ul>
        
        <h3>Important Notes</h3>
        <ul>
          <li>The school office will be closed during the break period</li>
          <li>Emergency contact information will be available on our website</li>
          <li>Online learning materials will be accessible throughout the break</li>
          <li>After-school programs will also be suspended during this period</li>
        </ul>
        
        <p>We encourage students to use this time for rest and family activities. Please ensure all assignments due after the break are completed on time.</p>
        
        <p>For any urgent matters during the break, please contact the school administration via email.</p>
      </div>
    `,
    featured_image: '/slider-01.png',
    excerpt: 'Important information about the upcoming mid-term break schedule, including dates and important notes for students and parents.',
    priority: 'important',
    published_at: '2024-03-01',
    status: 'published',
    category: 'Schedule',
    tags: ['holiday', 'schedule', 'break', 'important'],
    author: 'School Administration'
  },
  {
    id: '2',
    title: 'New COVID-19 Safety Protocols',
    slug: 'new-covid-19-safety-protocols',
    content: `
      <div class="prose prose-lg max-w-none">
        <p>In response to recent health guidelines, we are implementing updated COVID-19 safety protocols effective immediately.</p>
        
        <h3>Updated Safety Measures</h3>
        <ul>
          <li>Mandatory temperature checks at all entry points</li>
          <li>Hand sanitization stations installed in all classrooms</li>
          <li>Enhanced cleaning protocols for high-touch surfaces</li>
          <li>Improved ventilation systems in all buildings</li>
        </ul>
        
        <h3>Student and Staff Requirements</h3>
        <ul>
          <li>Face masks are recommended but not mandatory</li>
          <li>Students feeling unwell should stay home</li>
          <li>Report any COVID-19 symptoms to the health office immediately</li>
          <li>Maintain social distancing when possible</li>
        </ul>
        
        <h3>Visitor Policy</h3>
        <p>All visitors must check in at the main office and complete a health screening form. We encourage appointments to be scheduled in advance.</p>
        
        <p>These measures are designed to ensure the safety and well-being of our entire school community. We appreciate your cooperation and understanding.</p>
      </div>
    `,
    featured_image: '/building-character.jpg',
    excerpt: 'Updated COVID-19 safety protocols and health guidelines for students, staff, and visitors to ensure community safety.',
    priority: 'urgent',
    published_at: '2024-02-28',
    status: 'published',
    category: 'Health & Safety',
    tags: ['covid-19', 'safety', 'health', 'protocols'],
    author: 'Health Department'
  },
  {
    id: '3',
    title: 'Parent-Teacher Conference Schedule',
    slug: 'parent-teacher-conference-schedule',
    content: `
      <div class="prose prose-lg max-w-none">
        <p>We are pleased to announce the schedule for our upcoming Parent-Teacher Conferences. This is an excellent opportunity for parents to discuss their child's academic progress and development.</p>
        
        <h3>Conference Dates</h3>
        <ul>
          <li><strong>Primary Grades (1-5):</strong> April 8-10, 2024</li>
          <li><strong>Secondary Grades (6-10):</strong> April 11-13, 2024</li>
          <li><strong>Senior Grades (11-12):</strong> April 15-16, 2024</li>
        </ul>
        
        <h3>Scheduling Information</h3>
        <ul>
          <li>Conference slots are 15 minutes per teacher</li>
          <li>Online booking system opens March 25, 2024</li>
          <li>Both in-person and virtual meetings available</li>
          <li>Interpreters available upon request</li>
        </ul>
        
        <h3>What to Expect</h3>
        <p>Teachers will discuss:</p>
        <ul>
          <li>Academic performance and progress</li>
          <li>Social and emotional development</li>
          <li>Recommendations for continued growth</li>
          <li>Answers to your questions and concerns</li>
        </ul>
        
        <p>We strongly encourage all parents to participate in these conferences. Your involvement in your child's education is crucial for their success.</p>
      </div>
    `,
    featured_image: '/digital-library.jpg',
    excerpt: 'Schedule and information for upcoming Parent-Teacher Conferences, including booking details and what to expect.',
    priority: 'important',
    published_at: '2024-02-25',
    status: 'published',
    category: 'Academic',
    tags: ['parent-teacher', 'conference', 'academic', 'meetings'],
    author: 'Academic Affairs'
  },
  {
    id: '4',
    title: 'School Uniform Policy Update',
    slug: 'school-uniform-policy-update',
    content: `
      <div class="prose prose-lg max-w-none">
        <p>We are implementing minor updates to our school uniform policy to ensure comfort and practicality for all students.</p>
        
        <h3>Updated Uniform Requirements</h3>
        <h4>Primary Students (Grades 1-5)</h4>
        <ul>
          <li>Navy blue polo shirt with school logo</li>
          <li>Khaki pants or skirt (knee-length)</li>
          <li>Black or brown leather shoes</li>
          <li>Navy blue cardigan or sweater (optional)</li>
        </ul>
        
        <h4>Secondary Students (Grades 6-12)</h4>
        <ul>
          <li>White collared shirt with school tie</li>
          <li>Navy blue blazer with school crest</li>
          <li>Grey pants or plaid skirt</li>
          <li>Black leather shoes</li>
        </ul>
        
        <h3>New Additions</h3>
        <ul>
          <li>PE uniform now includes moisture-wicking fabric</li>
          <li>School-branded face masks are now available</li>
          <li>Winter coat options expanded for cold weather</li>
        </ul>
        
        <h3>Purchase Information</h3>
        <p>Uniforms can be purchased from our approved vendors or the school store. Financial assistance is available for families in need. Please contact the office for more information.</p>
        
        <p>The updated policy takes effect at the beginning of the next academic year. Current uniforms remain acceptable until then.</p>
      </div>
    `,
    featured_image: '/science-fair.jpg',
    excerpt: 'Updates to the school uniform policy including new requirements and purchasing information for the upcoming academic year.',
    priority: 'normal',
    published_at: '2024-02-20',
    status: 'published',
    category: 'Policy',
    tags: ['uniform', 'policy', 'dress-code', 'students'],
    author: 'Student Affairs'
  },
  {
    id: '5',
    title: 'Technology Integration Workshop for Parents',
    slug: 'technology-integration-workshop-parents',
    content: `
      <div class="prose prose-lg max-w-none">
        <p>We are excited to offer a comprehensive technology integration workshop designed specifically for parents to help support their children's digital learning journey.</p>
        
        <h3>Workshop Details</h3>
        <ul>
          <li><strong>Date:</strong> Saturday, April 20, 2024</li>
          <li><strong>Time:</strong> 9:00 AM - 12:00 PM</li>
          <li><strong>Location:</strong> School Computer Lab</li>
          <li><strong>Cost:</strong> Free for all parents</li>
        </ul>
        
        <h3>Topics Covered</h3>
        <ul>
          <li>Understanding our online learning platform</li>
          <li>Digital citizenship and internet safety</li>
          <li>Supporting homework with technology tools</li>
          <li>Managing screen time effectively</li>
          <li>Troubleshooting common technical issues</li>
        </ul>
        
        <h3>What to Bring</h3>
        <ul>
          <li>Your child's school-issued device (if applicable)</li>
          <li>Login credentials for school accounts</li>
          <li>Any specific questions or concerns</li>
          <li>Notebook for taking notes</li>
        </ul>
        
        <h3>Registration</h3>
        <p>Space is limited to 30 participants. Please register by April 15, 2024, through the school website or by calling the main office. Light refreshments will be provided.</p>
        
        <p>This workshop is part of our commitment to supporting families in navigating the digital learning environment effectively.</p>
      </div>
    `,
    featured_image: '/cultural-festival.png',
    excerpt: 'Free technology integration workshop for parents to learn about digital learning tools and supporting children with technology.',
    priority: 'normal',
    published_at: '2024-02-18',
    status: 'published',
    category: 'Technology',
    tags: ['technology', 'workshop', 'parents', 'digital-learning'],
    author: 'IT Department'
  },
  {
    id: '6',
    title: 'Emergency Contact Information Update Required',
    slug: 'emergency-contact-information-update-required',
    content: `
      <div class="prose prose-lg max-w-none">
        <p>All families are required to update their emergency contact information by March 31, 2024. This is crucial for student safety and communication during emergencies.</p>
        
        <h3>Required Information</h3>
        <ul>
          <li>Primary and secondary parent/guardian contacts</li>
          <li>Home, work, and mobile phone numbers</li>
          <li>Email addresses for both parents/guardians</li>
          <li>Two additional emergency contacts (non-parent)</li>
          <li>Medical information and allergies</li>
          <li>Authorized pickup persons</li>
        </ul>
        
        <h3>How to Update</h3>
        <ol>
          <li>Log into the parent portal on our website</li>
          <li>Navigate to "Student Information" section</li>
          <li>Click "Emergency Contacts" tab</li>
          <li>Update all relevant information</li>
          <li>Submit changes and print confirmation</li>
        </ol>
        
        <h3>Alternative Methods</h3>
        <ul>
          <li>Complete paper forms available at the main office</li>
          <li>Call the office to update information over the phone</li>
          <li>Email updates to info@blossomschool.edu</li>
        </ul>
        
        <h3>Important Notes</h3>
        <ul>
          <li>Information must be current and accurate</li>
          <li>Emergency contacts must be available during school hours</li>
          <li>Medical information should include any new conditions</li>
          <li>Changes take effect within 24 hours of submission</li>
        </ul>
        
        <p>Thank you for helping us maintain accurate records to ensure the safety and well-being of all students.</p>
      </div>
    `,
    featured_image: '/slider-02.png',
    excerpt: 'Mandatory update of emergency contact information for all families by March 31, 2024, including required details and update methods.',
    priority: 'urgent',
    published_at: '2024-02-15',
    status: 'published',
    category: 'Administrative',
    tags: ['emergency', 'contact', 'update', 'safety', 'required'],
    author: 'Main Office'
  }
];

// Helper functions similar to news data
export const getPublishedAnnouncements = (): Announcement[] => {
  return mockAnnouncements.filter(announcement => announcement.status === 'published');
};

export const getAnnouncementBySlug = (slug: string): Announcement | undefined => {
  return mockAnnouncements.find(announcement => announcement.slug === slug);
};

export const getAnnouncementPriorities = (): string[] => {
  const priorities = mockAnnouncements
    .filter(announcement => announcement.status === 'published')
    .map(announcement => announcement.priority)
    .filter((priority): priority is 'normal' | 'important' | 'urgent' => priority !== undefined);
  
  return Array.from(new Set(priorities));
};

export const searchAnnouncements = (query: string): Announcement[] => {
  const lowerQuery = query.toLowerCase();
  return getPublishedAnnouncements().filter(announcement =>
    announcement.title.toLowerCase().includes(lowerQuery) ||
    announcement.excerpt.toLowerCase().includes(lowerQuery) ||
    announcement.content.toLowerCase().includes(lowerQuery) ||
    announcement.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    announcement.category?.toLowerCase().includes(lowerQuery)
  );
};