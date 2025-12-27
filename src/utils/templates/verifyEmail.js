import {
  commonStyles,
  initLucideIcons,
  gsapAnimations,
} from "./styles/index.js";

export const verifyEmailTemplate = (context) => {
  const html = `
    ${commonStyles}
    <body class="bg-gradient-to-br from-purple-50 to-blue-50 p-4 md:p-8">
      <div class="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <!-- Header with Gradient -->
        <div class="gradient-bg p-8 md:p-12 text-white relative overflow-hidden animate-header">
          <div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32 animate-pulse-slow"></div>
          <div class="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24 animate-pulse-slow" style="animation-delay: 1s;"></div>
          
          <div class="relative z-10 text-center">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-2xl mb-4 animate-icon">
              <i data-lucide="book-open" class="w-10 h-10"></i>
            </div>
            <h1 class="text-4xl md:text-5xl font-bold mb-2">OpenLibrary</h1>
            <p class="text-lg text-purple-100">Welcome to your digital library</p>
          </div>
        </div>

        <!-- Content -->
        <div class="p-8 md:p-12 animate-content">
          <!-- Greeting -->
          <div class="mb-6">
            <h2 class="text-3xl font-bold gradient-text mb-2">Hello ${context.name}! 👋</h2>
            <p class="text-gray-600 text-lg">Thank you for joining OpenLibrary! We're excited to have you as part of our reading community.</p>
          </div>

          <p class="text-gray-700 mb-6">To get started, please verify your email address using the code below:</p>

          <!-- Verification Code Card -->
          <div class="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 mb-6 text-center border-2 border-purple-200 shadow-lg animate-content">
            <div class="flex items-center justify-center gap-2 mb-3">
              <i data-lucide="shield-check" class="w-5 h-5 text-purple-600"></i>
              <span class="text-sm font-semibold text-purple-700 uppercase tracking-wider">Verification Code</span>
            </div>
            <div class="text-5xl md:text-6xl font-bold gradient-text tracking-widest font-mono mb-2">
              ${context.verificationCode}
            </div>
            <p class="text-sm text-gray-500">Enter this code to verify your email</p>
          </div>

          <!-- Warning Notice -->
          <div class="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4 mb-6 flex gap-3 animate-content">
            <i data-lucide="clock" class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"></i>
            <div>
              <p class="font-semibold text-amber-900 mb-1">Time Sensitive</p>
              <p class="text-amber-800 text-sm">This verification code will expire in <strong>${context.expiredAfter}</strong>. Please use it soon!</p>
            </div>
          </div>

          <!-- Features Info -->
          <div class="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6 animate-content">
            <div class="flex gap-3">
              <i data-lucide="sparkles" class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"></i>
              <div>
                <p class="font-semibold text-blue-900 mb-2">What's Next?</p>
                <p class="text-blue-800 text-sm">Once verified, you'll have access to thousands of books, personalized recommendations, and much more.</p>
              </div>
            </div>
          </div>

          <p class="text-gray-600 text-sm">If you didn't create an account with us, you can safely ignore this email.</p>
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

  const text = `Hello ${context.name}!\n\nWelcome to OpenLibrary! Your verification code is: ${context.verificationCode}\n\nThis code will expire in ${context.expiredAfter}.\n\nIf you didn't create an account, please ignore this email.\n\nHappy reading!\nOpenLibrary Team`;

  return { html, text };
};
