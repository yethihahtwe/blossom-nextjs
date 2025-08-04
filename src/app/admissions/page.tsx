import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

export const metadata: Metadata = {
  title: 'Admissions | Blossom International School',
  description: 'Apply to Blossom International School. Learn about our admission requirements, application process, and join our vibrant educational community.',
};

export default function AdmissionsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-white py-16" style={{backgroundColor: '#791218'}}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">
                Admissions
              </h1>
              <p className="text-xl text-gray-200 max-w-3xl mx-auto">
                Join our vibrant educational community at Blossom International School. We welcome students who are eager to learn, grow, and excel in a nurturing environment that fosters academic excellence and character development.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Admission Information */}
            <div className="mb-12">
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{color: '#791218'}}>
                  Welcome to Blossom International School
                </h2>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  We are committed to providing world-class education that prepares students for success in an ever-changing global landscape. Our admissions process is designed to identify students who will thrive in our collaborative and challenging academic environment.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <div className="text-3xl mb-3" style={{color: '#791218'}}>🎓</div>
                    <h3 className="text-xl font-semibold mb-2" style={{color: '#791218'}}>Excellence</h3>
                    <p className="text-gray-600">Academic excellence with personalized attention for every student</p>
                  </div>
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <div className="text-3xl mb-3" style={{color: '#791218'}}>🌍</div>
                    <h3 className="text-xl font-semibold mb-2" style={{color: '#791218'}}>Global Perspective</h3>
                    <p className="text-gray-600">International curriculum preparing students for global opportunities</p>
                  </div>
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <div className="text-3xl mb-3" style={{color: '#791218'}}>👥</div>
                    <h3 className="text-xl font-semibold mb-2" style={{color: '#791218'}}>Community</h3>
                    <p className="text-gray-600">Supportive community fostering growth and character development</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Admission Requirements */}
            <div className="mb-12">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{color: '#791218'}}>
                  Admission Requirements
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">Required Documents</h3>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{backgroundColor: '#791218'}}></span>
                        Completed application form
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{backgroundColor: '#791218'}}></span>
                        Academic transcripts from previous school
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{backgroundColor: '#791218'}}></span>
                        Student&apos;s birth certificate
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{backgroundColor: '#791218'}}></span>
                        Passport-size photographs (4 copies)
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{backgroundColor: '#791218'}}></span>
                        Medical health certificate
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0" style={{backgroundColor: '#791218'}}></span>
                        Recommendation letters (2 required)
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">Age Requirements</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="font-semibold text-gray-900">Kindergarten (KG)</div>
                        <div className="text-gray-600">Ages 4-5 years</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="font-semibold text-gray-900">Primary (Grades 1-5)</div>
                        <div className="text-gray-600">Ages 6-11 years</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="font-semibold text-gray-900">Secondary (Grades 6-10)</div>
                        <div className="text-gray-600">Ages 12-16 years</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="font-semibold text-gray-900">Senior (Grades 11-12)</div>
                        <div className="text-gray-600">Ages 17-18 years</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Process */}
            <div className="mb-12">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{color: '#791218'}}>
                  Application Process
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-lg" style={{backgroundColor: '#791218'}}>
                      1
                    </div>
                    <h3 className="font-semibold mb-2">Submit Application</h3>
                    <p className="text-gray-600 text-sm">Complete and submit the online application form with required documents</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-lg" style={{backgroundColor: '#791218'}}>
                      2
                    </div>
                    <h3 className="font-semibold mb-2">Assessment</h3>
                    <p className="text-gray-600 text-sm">Student assessment and parent interview will be scheduled</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-lg" style={{backgroundColor: '#791218'}}>
                      3
                    </div>
                    <h3 className="font-semibold mb-2">Review</h3>
                    <p className="text-gray-600 text-sm">Application review by our admissions committee</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-lg" style={{backgroundColor: '#791218'}}>
                      4
                    </div>
                    <h3 className="font-semibold mb-2">Notification</h3>
                    <p className="text-gray-600 text-sm">Admission decision communicated within 7-10 business days</p>
                  </div>
                </div>
              </div>
            </div>


            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{color: '#791218'}}>
                Contact Admissions Office
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">Get in Touch</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-6 h-6 mt-1 mr-3 flex-shrink-0" style={{color: '#791218'}}>
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold">Phone</div>
                        <div className="text-gray-600">+95 9 123 456 789</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 mt-1 mr-3 flex-shrink-0" style={{color: '#791218'}}>
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold">Email</div>
                        <div className="text-gray-600">admissions@blossomschool.edu</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 mt-1 mr-3 flex-shrink-0" style={{color: '#791218'}}>
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold">Address</div>
                        <div className="text-gray-600">Thatipahtan Street, Myingyan, Myanmar</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">Office Hours</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Monday - Friday</span>
                      <span className="text-gray-600">8:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Saturday</span>
                      <span className="text-gray-600">9:00 AM - 1:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Sunday</span>
                      <span className="text-gray-600">Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
}