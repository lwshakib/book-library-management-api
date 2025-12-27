/**
 * Lucide Icons Integration
 *
 * This file is kept for backward compatibility but is no longer used.
 * All email templates now use Lucide icons via CDN.
 *
 * Available Lucide icons used in templates:
 * - book-open: Library/book icon
 * - shield-check: Security/verification icon
 * - shield-alert: Security alert icon
 * - key-round: Password/key icon
 * - clock: Time/expiration icon
 * - check-circle, check-circle-2: Success/completion icons
 * - alert-triangle, alert-octagon: Warning/alert icons
 * - lock, lock-keyhole: Lock/security icons
 * - mail-check: Email verification icon
 * - map-pin: Location icon
 * - globe: IP/network icon
 * - calendar: Date/time icon
 * - network: Network/connection icon
 * - heart: Love/appreciation icon
 * - sparkles: Features/highlights icon
 * - rocket: Launch/start icon
 * - lightbulb: Ideas/recommendations icon
 * - users: Community/social icon
 * - star: Rating/favorite icon
 * - list, list-plus: Lists/organization icons
 * - crown: Premium/exclusive icon
 * - badge-check: Verified/certified icon
 * - arrow-right: Direction/action icon
 * - check: Checkmark icon
 * - x-circle: Error/failed icon
 *
 * To use Lucide icons in templates:
 * <i data-lucide="icon-name" class="w-5 h-5"></i>
 *
 * Then call lucide.createIcons() to initialize them.
 *
 * Documentation: https://lucide.dev/
 */

export const lucideIconsInfo = {
  cdnUrl: "https://unpkg.com/lucide@latest",
  usage: '<i data-lucide="icon-name" class="w-5 h-5"></i>',
  initialization: "lucide.createIcons()",
  documentation: "https://lucide.dev/",
};

// Legacy SVG icons (deprecated - use Lucide instead)
export const svgIcons = {
  // Kept for backward compatibility only
  // Use Lucide icons in new templates
};
