import {
  commonStyles,
  initLucideIcons,
  gsapAnimations,
} from "./styles/index.js";

export const signInTemplate = (context) => {
  const html = `
    ${commonStyles}
    <body class="bg-gradient-to-br from-purple-50 to-blue-50 p-4 md:p-8">
      <div class="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <!-- Header -->
        <div class="gradient-bg p-8 md:p-12 text-white relative overflow-hidden animate-header">
          <div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32 animate-pulse-slow"></div>
          
          <div class="relative z-10 text-center">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-2xl mb-4 animate-icon">
              <i data-lucide="shield-alert" class="w-10 h-10"></i>
            </div>
            <h1 class="text-4xl md:text-5xl font-bold mb-2">Security Alert</h1>
            <p class="text-lg text-purple-100">Account activity notification</p>
          </div>
        </div>

        <!-- Content -->
        <div class="p-8 md:p-12">
          <div class="mb-6 animate-content">
            <h2 class="text-3xl font-bold gradient-text mb-2">Hi ${
              context.name
            }!</h2>
            <p class="text-gray-700 text-lg">We detected a new sign-in to your OpenLibrary account. Here are the details:</p>
          </div>

          <!-- Sign-in Details Card -->
          <div class="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 mb-6 border border-gray-200 animate-content">
            <div class="flex items-center gap-2 mb-4">
              <i data-lucide="map-pin" class="w-5 h-5 text-purple-600"></i>
              <h3 class="text-lg font-bold text-gray-900">Sign-in Details</h3>
            </div>
            <div class="space-y-3">
              <div class="flex items-start gap-3 pb-3 border-b border-gray-200">
                <i data-lucide="calendar" class="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5"></i>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-gray-600">Time</p>
                  <p class="text-gray-900">${new Date().toLocaleString(
                    "en-US",
                    {
                      timeZone: context.details?.timezone || "UTC",
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
              <div class="flex items-start gap-3 pb-3 border-b border-gray-200">
                <i data-lucide="map-pin" class="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5"></i>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-gray-600">Location</p>
                  <p class="text-gray-900">${
                    context.details?.city || "Unknown"
                  }, ${context.details?.region || "Unknown"}, ${
    context.details?.country_name || "Unknown"
  }</p>
                </div>
              </div>
              <div class="flex items-start gap-3 pb-3 border-b border-gray-200">
                <i data-lucide="globe" class="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5"></i>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-gray-600">IP Address</p>
                  <p class="text-gray-900 font-mono">${
                    context.ipAddress || context.details?.ip || "Unknown"
                  }</p>
                </div>
              </div>
              <div class="flex items-start gap-3 pb-3 border-b border-gray-200">
                <i data-lucide="network" class="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5"></i>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-gray-600">Network</p>
                  <p class="text-gray-900">${
                    context.details?.org || "Unknown"
                  }</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <i data-lucide="check-circle" class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"></i>
                <div class="flex-1">
                  <p class="text-sm font-semibold text-gray-600">Status</p>
                  <p class="text-green-600 font-semibold">Successful</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Was This You? -->
          <div class="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 mb-6 animate-content">
            <div class="flex gap-3">
              <i data-lucide="check-circle" class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"></i>
              <div>
                <p class="font-semibold text-green-900 mb-1">Was this you?</p>
                <p class="text-green-800 text-sm"><strong>If this was you:</strong> No further action is required. You can continue enjoying your reading experience safely.</p>
              </div>
            </div>
          </div>

          <!-- If Not You -->
          <div class="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6 animate-content">
            <div class="flex gap-3">
              <i data-lucide="alert-triangle" class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"></i>
              <div>
                <p class="font-semibold text-red-900 mb-2">If this wasn't you:</p>
                <p class="text-red-800 text-sm mb-2"><strong>Take immediate action to secure your account:</strong></p>
                <ul class="space-y-1 text-red-800 text-sm">
                  <li class="flex items-start gap-2">
                    <i data-lucide="arrow-right" class="w-4 h-4 flex-shrink-0 mt-0.5"></i>
                    <span>Change your password immediately</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <i data-lucide="arrow-right" class="w-4 h-4 flex-shrink-0 mt-0.5"></i>
                    <span>Review your recent account activity</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <i data-lucide="arrow-right" class="w-4 h-4 flex-shrink-0 mt-0.5"></i>
                    <span>Enable two-factor authentication if available</span>
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

          <p class="text-gray-500 text-sm"><strong>Technical Details:</strong> This notification was generated for security purposes.</p>
        </div>

        <!-- Footer -->
        <div class="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-8 text-center">
          <div class="flex items-center justify-center gap-2 mb-2">
            <i data-lucide="shield" class="w-4 h-4 text-blue-400"></i>
            <p class="text-lg">Your security is our priority!</p>
          </div>
          <p class="text-purple-400 font-semibold text-lg mb-2">OpenLibrary Security Team</p>
          <p class="text-gray-400 text-sm">This is an automated security notification • Do not reply to this email</p>
        </div>
      </div>

      ${initLucideIcons}
      ${gsapAnimations}
    </body>
    </html>
  `;

  const text = `Hi ${
    context.name
  }!\n\nNew sign-in detected on your OpenLibrary account:\n\nTime: ${new Date().toLocaleString(
    "en-US",
    { timeZone: context.details?.timezone || "UTC" }
  )}\nLocation: ${context.details?.city || "Unknown"}\nIP Address: ${
    context.ipAddress || "Unknown"
  }\n\nIf this was you, no action needed.\nIf this wasn't you, please change your password immediately.\n\nOpenLibrary Security Team`;

  return { html, text };
};
