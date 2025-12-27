import {
  commonStyles,
  initLucideIcons,
  gsapAnimations,
} from "./styles/index.js";

export const resetPasswordTemplate = (context) => {
  const html = `
    ${commonStyles}
    <body class="bg-gradient-to-br from-purple-50 to-blue-50 p-4 md:p-8">
      <div class="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <!-- Header -->
        <div class="gradient-bg p-8 md:p-12 text-white relative overflow-hidden animate-header">
          <div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32 animate-pulse-slow"></div>
          
          <div class="relative z-10 text-center">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-2xl mb-4 animate-icon">
              <i data-lucide="key-round" class="w-10 h-10"></i>
            </div>
            <h1 class="text-4xl md:text-5xl font-bold mb-2">Password Reset</h1>
            <p class="text-lg text-purple-100">Secure your account</p>
          </div>
        </div>

        <!-- Content -->
        <div class="p-8 md:p-12">
          <div class="mb-6 animate-content">
            <h2 class="text-3xl font-bold gradient-text mb-2">Hello ${context.userName}!</h2>
            <p class="text-gray-700 text-lg">We received a request to reset your OpenLibrary account password.</p>
          </div>

          <p class="text-gray-700 mb-6">Use the verification code below to create a new password:</p>

          <!-- Reset Code Card -->
          <div class="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 mb-6 text-center border-2 border-purple-200 shadow-lg animate-content">
            <div class="flex items-center justify-center gap-2 mb-3">
              <i data-lucide="lock-keyhole" class="w-5 h-5 text-purple-600"></i>
              <span class="text-sm font-semibold text-purple-700 uppercase tracking-wider">Password Reset Code</span>
            </div>
            <div class="text-5xl md:text-6xl font-bold gradient-text tracking-widest font-mono mb-2">
              ${context.verificationCode}
            </div>
            <p class="text-sm text-gray-500">Enter this code to reset your password</p>
          </div>

          <!-- Time Warning -->
          <div class="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4 mb-6 flex gap-3 animate-content">
            <i data-lucide="clock" class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"></i>
            <div>
              <p class="font-semibold text-amber-900 mb-1">Time Sensitive</p>
              <p class="text-amber-800 text-sm">This reset code will expire in <strong>${context.expiredAfter}</strong>. Use it promptly to secure your account.</p>
            </div>
          </div>

          <!-- Security Tips -->
          <div class="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6 animate-content">
            <div class="flex gap-3">
              <i data-lucide="shield-alert" class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"></i>
              <div>
                <p class="font-semibold text-blue-900 mb-2">Security Tips:</p>
                <ul class="space-y-2 text-blue-800 text-sm">
                  <li class="flex items-start gap-2">
                    <i data-lucide="check" class="w-4 h-4 flex-shrink-0 mt-0.5"></i>
                    <span>Choose a strong password with at least 8 characters</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <i data-lucide="check" class="w-4 h-4 flex-shrink-0 mt-0.5"></i>
                    <span>Include uppercase, lowercase, numbers, and symbols</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <i data-lucide="check" class="w-4 h-4 flex-shrink-0 mt-0.5"></i>
                    <span>Don't reuse passwords from other accounts</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <p class="text-gray-600 text-sm">If you didn't request this password reset, please ignore this email. Your current password will remain unchanged.</p>
        </div>

        <!-- Footer -->
        <div class="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-8 text-center">
          <div class="flex items-center justify-center gap-2 mb-2">
            <i data-lucide="shield-check" class="w-4 h-4 text-green-400"></i>
            <p class="text-lg">Keep your account safe!</p>
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

  const text = `Hello ${context.userName}!\n\nPassword reset requested for your OpenLibrary account.\n\nYour reset code is: ${context.verificationCode}\n\nThis code expires in ${context.expiredAfter}.\n\nIf you didn't request this, please ignore this email.\n\nOpenLibrary Team`;

  return { html, text };
};
