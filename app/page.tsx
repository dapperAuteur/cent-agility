import Link from 'next/link';
import { ArrowRight, Zap, Trophy, Users, TrendingUp, Calendar, Lock } from 'lucide-react';
import CourseSlideshow from '@/components/agility/CourseSlideshow';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-gray-600 hover:text-gray-900 font-semibold text-sm sm:text-base">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <span className="text-xl font-bold text-gray-900">Agility Engine</span>
            </div>
          </Link>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/agility/auth/signin" className="text-gray-600 hover:text-gray-900 font-semibold text-sm sm:text-base">
              Sign In
            </Link>
            <Link href="/agility/auth/signup" className="px-4 sm:px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition text-sm sm:text-base">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full mb-6">
            <Zap className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-600">Train Faster. React Quicker.</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
            Test Your Reaction Speed with
            <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Timed Drills</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-8">
            Sprint to numbered cones, compete on leaderboards, and track your improvement over time. Perfect for athletes, coaches, and anyone serious about speed training.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/agility/auth/signup" className="px-8 py-4 bg-indigo-600 text-white text-lg font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg flex items-center justify-center gap-2">
              Start Training Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/agility/drill/setup" className="px-8 py-4 bg-white text-gray-900 text-lg font-bold rounded-xl hover:bg-gray-50 transition border-2 border-gray-200">
              Try Demo
            </Link>
          </div>
        </div>

        {/* Course Slideshow & How It Works */}
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Course Slideshow */}
            <CourseSlideshow />

            {/* Drill Steps */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">What You Do During Assessment</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <div>
                    <p className="font-semibold text-gray-900">Stand at center position</p>
                    <p className="text-sm text-gray-600">Place yourself at the START point equidistant from all cones</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <div>
                    <p className="font-semibold text-gray-900">Press START and wait for random delay</p>
                    <p className="text-sm text-gray-600">Audio beep sounds after 2-5 seconds (tests your reaction time)</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <div>
                    <p className="font-semibold text-gray-900">Listen for audio callout</p>
                    <p className="text-sm text-gray-600">Voice announces random cone number: &quot;Cone 3&quot;</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                  <div>
                    <p className="font-semibold text-gray-900">Sprint to cone and back</p>
                    <p className="text-sm text-gray-600">Touch the called cone, return to center as fast as possible</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">5</span>
                  <div>
                    <p className="font-semibold text-gray-900">Press RETURN button</p>
                    <p className="text-sm text-gray-600">App records your sprint time automatically</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">6</span>
                  <div>
                    <p className="font-semibold text-gray-900">Repeat for full set</p>
                    <p className="text-sm text-gray-600">Complete 10 reps, rest 60 seconds, do 3 sets (customizable)</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">7</span>
                  <div>
                    <p className="font-semibold text-gray-900">View your results</p>
                    <p className="text-sm text-gray-600">See total time, average speed, and your leaderboard ranking</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
          
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Athletes Choose Agility Engine
            </h2>
            <p className="text-lg text-gray-600">Everything you need to train smarter and faster</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Compete on Leaderboards</h3>
              <p className="text-gray-600">
                See how you rank against others on official courses. Track both speed and consistency metrics.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Challenge Friends Weekly</h3>
              <p className="text-gray-600">
                Create custom challenges, share results, and compete with your training partners.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Track Progress Over Time</h3>
              <p className="text-gray-600">
                Watch your times improve with detailed analytics on sprint speed and reaction time.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Train Anywhere, Anytime</h3>
              <p className="text-gray-600">
                Offline-first design works in parks, gyms, or fields without internet connection.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Structured Training Plans</h3>
              <p className="text-gray-600">
                Follow guided drill programs designed for different skill levels and goals.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Privacy First</h3>
              <p className="text-gray-600">
                Your data stays yours. Optional anonymous mode available. Control what you share.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simple 3-Step Process
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Set Up Cones</h3>
              <p className="text-gray-600">
                Place numbered cones according to course diagram. Standard layouts or create custom.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Start Drill</h3>
              <p className="text-gray-600">
                Audio calls random cone numbers. Sprint there and back to center. Repeat.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Track & Compete</h3>
              <p className="text-gray-600">
                See your stats, climb leaderboards, and challenge friends to beat your time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-20 bg-linear-to-br from-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full mb-6 shadow-sm">
            <span className="text-sm font-semibold text-indigo-600">Coming Soon</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            More Features in Development
          </h2>
          
          <div className="grid sm:grid-cols-2 gap-4 text-left mb-8">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-semibold text-gray-900">📹 Video Recording</p>
              <p className="text-sm text-gray-600">Capture drills for form analysis</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-semibold text-gray-900">❤️ Heart Rate Monitor</p>
              <p className="text-sm text-gray-600">Track fitness during training</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-semibold text-gray-900">👥 Team Challenges</p>
              <p className="text-sm text-gray-600">Compete as groups</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="font-semibold text-gray-900">🎨 Custom Course Builder</p>
              <p className="text-sm text-gray-600">Design your own layouts</p>
            </div>
          </div>

          <p className="text-gray-600 mb-6">
            Create an account now to get early access to new features as they launch.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-linear-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Get Faster?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join athletes training smarter with Agility Engine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/agility/auth/signup" className="px-8 py-4 bg-white text-indigo-600 text-lg font-bold rounded-xl hover:bg-gray-100 transition shadow-lg">
              Create Free Account
            </Link>
            <Link href="/agility/drill/setup" className="px-8 py-4 bg-white/10 backdrop-blur text-white border-2 border-white text-lg font-bold rounded-xl hover:bg-white/20 transition">
              Try Without Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">⚡</span>
                <span className="text-lg font-bold text-gray-900">Agility Engine</span>
              </div>
              <p className="text-sm text-gray-600">
                Speed training for athletes of all levels.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/agility/drill/setup" className="hover:text-gray-900">Drills</Link></li>
                <li><Link href="/agility/leaderboard" className="hover:text-gray-900">Leaderboard</Link></li>
                {/* <li><Link href="#" className="hover:text-gray-900">Pricing</Link></li> */}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/" className="hover:text-gray-900">About</Link></li>
                <li><Link href="https://i.brandanthonymcdonald.com/blog" className="hover:text-gray-900">Blog</Link></li>
                <li><Link href="https://i.brandanthonymcdonald.com/portfolio" className="hover:text-gray-900">Contact</Link></li>
              </ul>
            </div>

            <div>
              {/* <h4 className="font-bold text-gray-900 mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="#" className="hover:text-gray-900">Privacy</Link></li>
                <li><Link href="#" className="hover:text-gray-900">Terms</Link></li>
                <li><Link href="#" className="hover:text-gray-900">Security</Link></li>
              </ul> */}
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <p>© 2025 Agility Engine. MIT License.</p>
            <div className="flex gap-6">
              <Link href="https://i.brandanthonymcdonald.com/cent-agility-repo" className="hover:text-gray-900">GitHub</Link>
              <Link href="https://i.brandanthonymcdonald.com/portfolio" className="hover:text-gray-900">BAM Page</Link>
              <Link href="https://i.centenarianos.com/beta" className="hover:text-gray-900">Cent OS</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}