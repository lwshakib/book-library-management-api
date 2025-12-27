import {
  commonStyles,
  initLucideIcons,
  gsapAnimations,
} from "./styles/index.js";

export const tooManyFailedLoginsTemplate = (context) => {
  const html = `
    ${commonStyles}
    <body class="bg-gradient-to-br from-red-50 to-orange-50 p-4 md:p-8">
      <div class="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-red-600 to-orange-600 p-8 md:p-12 text-white relative overflow-hidden animate-header">
          <div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32 animate-pulse-slow"></div>
          
          <div class="relative z-10 text-center">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-2xl mb-4 animate-icon">
              <i data-lucide="alert-octagon" class="w-10 h-10"></i>
            </div>
            <h1 class="text-4xl md:text-5xl font-bold mb-2">Security Alert</h1>
            <p class="text-lg text-red-100">Account protection notification</p>
          </div>
        </div>

        <!-- Content -->
        <div class="p-8 md:p-12">
          <div class="mb-6 animate-content">
            <h2 class="text-3xl font-bold text-red-600 mb-2">Hi there!</h2>
            <p class="text-gray-700 text-lg">We noticed multiple failed login attempts on your OpenLibrary account. For your security, we have temporarily locked your account.</p>
          </div>

          <!-- Failed Attempts Card -->
          <div class="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 mb-6 border-2 border-red-200 animate-content">
            <div class="flex items-center gap-2 mb-4">
              <i data-lucide="x-circle" class="w-5 h-5 text-red-600"></i>
              <h3 class="text-lg font-bold text-gray-900">Failed Login Attempts</h3>
            </div>
            <div class="space-y-3">
              <div class="flex items-start gap-3 pb-3 border-b border-red-200">
                <i data-lucide="calendar" class="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5"></i>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-gray-600">Time</p>
                  <p class="text-gray-900">${new Date().toLocaleString(
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
              <div class="flex items-start gap-3 pb-3 border-b border-red-200">
                <i data-lucide="globe" class="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5"></i>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-gray-600">IP Address</p>
                  <p class="text-gray-900 font-mono">${
                    context.ipAddress || "Unknown"
                  }</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <i data-lucide="x-circle" class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"></i>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-gray-600">Status</p>
                  <p class="text-red-600 font-semibold">Multiple Failed Attempts</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Account Locked -->
          <div class="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6 animate-content">
            <div class="flex gap-3">
              <i data-lucide="lock" class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"></i>
              <div>
                <p class="font-semibold text-red-900 mb-2">Account Locked</p>
                <p class="text-red-800 text-sm mb-2">To protect your account, we have temporarily locked it due to suspicious activity.</p>
                <p class="text-red-800 text-sm font-semibold mb-2">To unlock your account:</p>
                <ul class="space-y-1 text-red-800 text-sm">
                  <li class="flex items-start gap-2">
                    <i data-lucide="arrow-right" class="w-4 h-4 flex-shrink-0 mt-0.5"></i>
                    <span>Reset your password using a secure method</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <i data-lucide="arrow-right" class="w-4 h-4 flex-shrink-0 mt-0.5"></i>
                    <span>Enable two-factor authentication for added security</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <i data-lucide="arrow-right" class="w-4 h-4 flex-shrink-0 mt-0.5"></i>
                    <span>Contact our support team if you need assistance</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Security Tips -->
          <div class="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6 animate-content">
            <div class="flex gap-3">
              <i data-lucide="shield-check" class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"></i>
              <div>
                <p class="font-semibold text-blue-900 mb-2">Security Tips</p>
                <ul class="space-y-1 text-blue-800 text-sm">
                  <li class="flex items-start gap-2">
                    <i data-lucide="check" class="w-4 h-4 flex-shrink-0 mt-0.5"></i>
                    <span>Always sign out from public or shared devices</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <i data-lucide="check" class="w-4 h-4 flex-shrink-0 mt-0.5"></i>
                    <span>Use a unique, strong password for your account</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <i data-lucide="check" class="w-4 h-4 flex-shrink-0 mt-0.5"></i>
                    <span>Keep your browser and devices updated</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <i data-lucide="check" class="w-4 h-4 flex-shrink-0 mt-0.5"></i>
                    <span>Be cautious of phishing emails and suspicious links</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <p class="text-gray-500 text-sm"><strong>Technical Details:</strong> This notification was generated for security purposes due to multiple failed login attempts from IP address ${
            context.ipAddress || "Unknown"
          }.</p>
        </div>

        <!-- Footer -->
        <div class="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-8 text-center">
          <div class="flex items-center justify-center gap-2 mb-2">
            <i data-lucide="shield" class="w-4 h-4 text-blue-400"></i>
            <p class="text-lg">Your security is our priority!</p>
          </div>
          <p class="text-purple-400 font-semibold text-lg mb-2">OpenLibrary Security Team</p>
          <p class="text-gray-400 text-sm mb-2">This is an automated security notification • Do not reply to this email</p>
          <p class="text-gray-500 text-xs">For support, visit our help center or contact security@openlibrary.com</p>
        </div>
      </div>

      ${initLucideIcons}
      ${gsapAnimations}
    </body>
    </html>
  `;

  const text = `Security Alert: Your OpenLibrary account has been temporarily locked due to multiple failed login attempts.\n\nTime: ${new Date().toLocaleString(
    "en-US"
  )}\nIP Address: ${
    context.ipAddress || "Unknown"
  }\n\nTo unlock your account, please reset your password.\n\nOpenLibrary Security Team`;

  return { html, text };
};
