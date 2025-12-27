import {
  commonStyles,
  initLucideIcons,
  gsapAnimations,
} from "./styles/index.js";

export const welcomeTemplate = (context) => {
  const html = `
    ${commonStyles}
    <body class="bg-gradient-to-br from-purple-50 to-blue-50 p-4 md:p-8">
      <div class="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <!-- Header -->
        <div class="gradient-bg p-8 md:p-12 text-white relative overflow-hidden animate-header">
          <div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32 animate-pulse-slow"></div>
          <div class="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24 animate-pulse-slow" style="animation-delay: 1s;"></div>
          
          <div class="relative z-10 text-center">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-2xl mb-4 animate-icon">
              <i data-lucide="book-open" class="w-10 h-10"></i>
            </div>
            <h1 class="text-4xl md:text-5xl font-bold mb-2">Welcome to OpenLibrary! 🎉</h1>
            <p class="text-lg text-purple-100">Your journey into the world of books begins here</p>
          </div>
        </div>

        <!-- Content -->
        <div class="p-8 md:p-12">
          <!-- Greeting -->
          <div class="mb-6 animate-content">
            <h2 class="text-3xl font-bold gradient-text mb-2">Hello ${
              context.name
            }! 👋</h2>
            <p class="text-gray-700 text-lg">Welcome to OpenLibrary! We're thrilled to have you join our community of book lovers and readers.</p>
          </div>

          <!-- Success Notice -->
          <div class="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 mb-6 flex gap-3 animate-content">
            <i data-lucide="check-circle" class="w-6 h-6 text-green-600 flex-shrink-0"></i>
            <div>
              <p class="font-semibold text-green-900 mb-1">Account Created Successfully</p>
              <p class="text-green-800 text-sm">Your OpenLibrary account has been created and you're ready to start exploring!</p>
            </div>
          </div>

          <!-- Features Card -->
          <div class="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-6 border border-blue-200 animate-content">
            <div class="flex items-center gap-2 mb-4">
              <i data-lucide="sparkles" class="w-6 h-6 text-purple-600"></i>
              <h3 class="text-xl font-bold text-gray-900">What You Can Do Now</h3>
            </div>
            <p class="text-gray-700 mb-4">As a new member, you have access to:</p>
            <div class="space-y-3">
              <div class="flex items-start gap-3">
                <i data-lucide="book" class="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5"></i>
                <p class="text-gray-700"><strong>Browse thousands of books</strong> across all genres</p>
              </div>
              <div class="flex items-start gap-3">
                <i data-lucide="list" class="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5"></i>
                <p class="text-gray-700"><strong>Create reading lists</strong> to organize your favorite books</p>
              </div>
              <div class="flex items-start gap-3">
                <i data-lucide="star" class="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5"></i>
                <p class="text-gray-700"><strong>Rate and review</strong> books you've read</p>
              </div>
              <div class="flex items-start gap-3">
                <i data-lucide="lightbulb" class="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5"></i>
                <p class="text-gray-700"><strong>Get personalized recommendations</strong> based on your interests</p>
              </div>
              <div class="flex items-start gap-3">
                <i data-lucide="users" class="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5"></i>
                <p class="text-gray-700"><strong>Join book discussions</strong> and connect with fellow readers</p>
              </div>
              <div class="flex items-start gap-3">
                <i data-lucide="trending-up" class="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5"></i>
                <p class="text-gray-700"><strong>Track your reading progress</strong> and set reading goals</p>
              </div>
            </div>
          </div>

          <!-- Next Step Warning -->
          <div class="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4 mb-6 animate-content">
            <div class="flex gap-3">
              <i data-lucide="mail-check" class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"></i>
              <div>
                <p class="font-semibold text-amber-900 mb-1">Next Step: Verify Your Email</p>
                <p class="text-amber-800 text-sm mb-2">To unlock all features and ensure account security, please verify your email address.</p>
                <p class="text-amber-800 text-sm">Check your inbox for a verification email with a code that expires in 10 minutes.</p>
              </div>
            </div>
          </div>

          <!-- Security Info -->
          <div class="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6 animate-content">
            <div class="flex gap-3">
              <i data-lucide="shield-check" class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"></i>
              <div>
                <p class="font-semibold text-blue-900 mb-2">Account Security</p>
                <p class="text-blue-800 text-sm mb-2">We take your privacy and security seriously:</p>
                <ul class="space-y-1 text-blue-800 text-sm">
                  <li class="flex items-start gap-2">
                    <i data-lucide="check" class="w-4 h-4 flex-shrink-0 mt-0.5"></i>
                    <span>Your personal information is encrypted and secure</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <i data-lucide="check" class="w-4 h-4 flex-shrink-0 mt-0.5"></i>
                    <span>We never share your data with third parties</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <i data-lucide="check" class="w-4 h-4 flex-shrink-0 mt-0.5"></i>
                    <span>You can update your privacy settings anytime</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <i data-lucide="check" class="w-4 h-4 flex-shrink-0 mt-0.5"></i>
                    <span>All communications are encrypted</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="text-center text-sm text-gray-500 mb-4">
            <p><strong>Account Details:</strong> Account created on ${new Date().toLocaleString(
              "en-US",
              {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                timeZoneName: "short",
              }
            )}</p>
          </div>

          <p class="text-gray-600 text-sm">If you have any questions or need help getting started, don't hesitate to reach out to our support team. We're here to help!</p>
        </div>

        <!-- Footer -->
        <div class="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-8 text-center">
          <div class="flex items-center justify-center gap-2 mb-2">
            <i data-lucide="heart" class="w-4 h-4 text-red-400"></i>
            <p class="text-lg">Happy reading and welcome to the community!</p>
          </div>
          <p class="text-purple-400 font-semibold text-lg mb-2">The OpenLibrary Team</p>
          <p class="text-gray-400 text-sm">This is an automated message, please do not reply to this email.</p>
        </div>
      </div>

      ${initLucideIcons}
      ${gsapAnimations}
    </body>
    </html>
  `;

  const text = `Hello ${
    context.name
  }!\n\nWelcome to OpenLibrary! We're thrilled to have you join our community of book lovers and readers.\n\nYour OpenLibrary account has been created and you're ready to start exploring!\n\nAs a new member, you have access to:\n- Browse thousands of books across all genres\n- Create reading lists to organize your favorite books\n- Rate and review books you've read\n- Get personalized recommendations based on your interests\n- Join book discussions and connect with fellow readers\n- Track your reading progress and set reading goals\n\nNext Step: Verify Your Email\nTo unlock all features and ensure account security, please verify your email address. Check your inbox for a verification email with a code that expires in 10 minutes.\n\nAccount created on ${new Date().toLocaleString(
    "en-US"
  )}.\n\nHappy reading and welcome to the community!\nThe OpenLibrary Team`;

  return { html, text };
};
