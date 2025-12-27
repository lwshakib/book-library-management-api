import {
  commonStyles,
  initLucideIcons,
  gsapAnimations,
} from "./styles/index.js";

export const verifyEmailSuccessTemplate = (context) => {
  const html = `
    ${commonStyles}
    <body class="bg-gradient-to-br from-green-50 to-emerald-50 p-4 md:p-8">
      <div class="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-green-600 to-emerald-600 p-8 md:p-12 text-white relative overflow-hidden animate-header">
          <div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32 animate-pulse-slow"></div>
          <div class="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24 animate-pulse-slow" style="animation-delay: 1s;"></div>
          
          <div class="relative z-10 text-center">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-2xl mb-4 animate-icon">
              <i data-lucide="check-circle-2" class="w-10 h-10"></i>
            </div>
            <h1 class="text-4xl md:text-5xl font-bold mb-2">Email Verified Successfully! 🎉</h1>
            <p class="text-lg text-green-100">Welcome to OpenLibrary</p>
          </div>
        </div>

        <!-- Content -->
        <div class="p-8 md:p-12">
          <div class="mb-6 animate-content">
            <h2 class="text-3xl font-bold text-green-600 mb-2">Congratulations ${
              context.name
            }!</h2>
            <p class="text-gray-700 text-lg">Your email address has been successfully verified. You're now a verified member of the OpenLibrary community!</p>
          </div>

          <!-- Success Notice -->
          <div class="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 mb-6 animate-content">
            <div class="flex gap-3">
              <i data-lucide="badge-check" class="w-6 h-6 text-green-600 flex-shrink-0"></i>
              <div>
                <p class="font-semibold text-green-900 mb-1">Verification Complete</p>
                <p class="text-green-800 text-sm">Your account is now fully activated and ready to use.</p>
              </div>
            </div>
          </div>

          <!-- What's Next Card -->
          <div class="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-6 border border-blue-200 animate-content">
            <div class="flex items-center gap-2 mb-4">
              <i data-lucide="rocket" class="w-6 h-6 text-purple-600"></i>
              <h3 class="text-xl font-bold text-gray-900">What's Next?</h3>
            </div>
            <p class="text-gray-700 mb-4">Now that your account is verified, you can:</p>
            <div class="space-y-3">
              <div class="flex items-start gap-3">
                <div class="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i data-lucide="book-open" class="w-4 h-4 text-purple-600"></i>
                </div>
                <div>
                  <p class="font-semibold text-gray-900">Browse our extensive collection</p>
                  <p class="text-sm text-gray-600">Explore thousands of books across all genres</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i data-lucide="list-plus" class="w-4 h-4 text-purple-600"></i>
                </div>
                <div>
                  <p class="font-semibold text-gray-900">Create personalized reading lists</p>
                  <p class="text-sm text-gray-600">Organize your favorite books and track your progress</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i data-lucide="star" class="w-4 h-4 text-purple-600"></i>
                </div>
                <div>
                  <p class="font-semibold text-gray-900">Rate and review books</p>
                  <p class="text-sm text-gray-600">Share your thoughts with the community</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i data-lucide="lightbulb" class="w-4 h-4 text-purple-600"></i>
                </div>
                <div>
                  <p class="font-semibold text-gray-900">Get personalized recommendations</p>
                  <p class="text-sm text-gray-600">Discover books tailored to your interests</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i data-lucide="users" class="w-4 h-4 text-purple-600"></i>
                </div>
                <div>
                  <p class="font-semibold text-gray-900">Join reading discussions</p>
                  <p class="text-sm text-gray-600">Connect with fellow book lovers</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i data-lucide="crown" class="w-4 h-4 text-purple-600"></i>
                </div>
                <div>
                  <p class="font-semibold text-gray-900">Access exclusive features</p>
                  <p class="text-sm text-gray-600">Unlock member-only benefits and content</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Security Info -->
          <div class="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6 animate-content">
            <div class="flex gap-3">
              <i data-lucide="shield-check" class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"></i>
              <div>
                <p class="font-semibold text-blue-900 mb-1">Account Security</p>
                <p class="text-blue-800 text-sm">Your account is now secure and verified. You can sign in with confidence knowing your email address is confirmed.</p>
              </div>
            </div>
          </div>

          <div class="text-center text-sm text-gray-500">
            <p><strong>Verification Details:</strong> Email verified on ${new Date().toLocaleString(
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
        </div>

        <!-- Footer -->
        <div class="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-8 text-center">
          <div class="flex items-center justify-center gap-2 mb-2">
            <i data-lucide="heart" class="w-4 h-4 text-red-400"></i>
            <p class="text-lg">Happy reading!</p>
          </div>
          <p class="text-purple-400 font-semibold text-lg mb-2">OpenLibrary Team</p>
          <p class="text-gray-400 text-sm">This is an automated message, please do not reply to this email.</p>
        </div>
      </div>

      ${initLucideIcons}
      ${gsapAnimations}
    </body>
    </html>
  `;

  const text = `Congratulations ${
    context.name
  }!\n\nYour email address has been successfully verified. You're now a verified member of the OpenLibrary community!\n\nYour account is now fully activated and ready to use.\n\nVerification Details: Email verified on ${new Date().toLocaleString(
    "en-US"
  )}.\n\nHappy reading!\nOpenLibrary Team`;

  return { html, text };
};
