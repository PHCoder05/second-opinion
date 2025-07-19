<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" class="logo" width="120"/>

### Medical App Design System JSON Profile

Based on common practices in mobile UI design for healthcare applications, I've created a JSON profile that captures a generalized design system. This JSON extracts and abstracts visual and structural elements from typical doctor appointment app screenshots, focusing on styles, components, layouts, and guidelines. It avoids any specific image content and is structured to help an AI (like Cursor) replicate consistent designs. The design emphasizes minimalism, accessibility, and user-friendly navigation suitable for medical contexts.

The JSON includes:

- **Design Style**: Color palettes, typography, spacing, and themes inspired by healthcare UI best practices (e.g., calming colors, high contrast for readability).
- **Structure**: Layout hierarchies, component definitions, and reusable patterns for screens like home, profiles, and scheduling.
- **Replication Aids**: Tokens for design elements, responsive rules, and accessibility guidelines to ensure consistency across platforms.

You can copy this JSON directly into tools like Cursor for generating or iterating on similar designs.

#### JSON Design System Profile

```json
{
  "designSystem": {
    "name": "MedicalAppUI",
    "version": "1.0",
    "description": "A JSON-based design system for replicating consistent medical app interfaces, focusing on doctor appointment and telehealth features.",
    "styles": {
      "colorPalette": {
        "primary": "#007BFF",
        "secondary": "#6C757D",
        "accent": "#17A2B8",
        "background": "#F8F9FA",
        "text": "#212529",
        "success": "#28A745",
        "warning": "#FFC107",
        "error": "#DC3545",
        "neutral": {
          "light": "#FFFFFF",
          "dark": "#343A40"
        },
        "guidelines": "Use calming blues and greens for trust and health themes. Ensure high contrast (e.g., text on background > 4.5:1 ratio) for accessibility[^8][^11]."
      },
      "typography": {
        "fonts": {
          "primary": "Roboto",
          "secondary": "Helvetica",
          "sizes": {
            "heading": "24px",
            "subheading": "18px",
            "body": "16px",
            "caption": "14px",
            "small": "12px"
          },
          "weights": {
            "regular": 400,
            "bold": 700
          }
        },
        "guidelines": "Prioritize sans-serif fonts for readability. Use larger sizes for elderly users or low-vision accessibility. Line height: 1.5 for body text[^17]."
      },
      "spacing": {
        "units": "8px base (modular scale)",
        "margins": {
          "small": "8px",
          "medium": "16px",
          "large": "24px"
        },
        "paddings": {
          "card": "16px",
          "button": "12px 24px"
        },
        "guidelines": "Follow a consistent grid system (e.g., 8px grid) for alignment. Ensure touch targets are at least 48x48px for mobile usability[^11]."
      },
      "themes": {
        "light": {
          "background": "#FFFFFF",
          "text": "#000000"
        },
        "dark": {
          "background": "#121212",
          "text": "#FFFFFF"
        },
        "guidelines": "Support dark mode for low-light environments. Auto-switch based on device settings[^11]."
      }
    },
    "structure": {
      "layouts": {
        "screenTypes": [
          {
            "type": "HomeScreen",
            "components": ["Header", "SearchBar", "CardList", "NavigationBar"],
            "layout": "Vertical stack with top header, central content, bottom navigation."
          },
          {
            "type": "ProfileScreen",
            "components": ["Avatar", "InfoSection", "ButtonGroup", "ScheduleCalendar"],
            "layout": "Top profile image, middle details, bottom actions."
          },
          {
            "type": "AppointmentScreen",
            "components": ["Calendar", "TimeSlots", "VideoCallInterface", "ConfirmationButton"],
            "layout": "Scrollable view with calendar at top, slots below, call controls centered."
          }
        ],
        "gridSystem": "12-column flexible grid for responsive design across mobile devices."
      },
      "components": {
        "reusable": [
          {
            "name": "Card",
            "properties": {
              "borderRadius": "8px",
              "shadow": "0 2px 4px rgba(0,0,0,0.1)",
              "background": "{colorPalette.background}"
            },
            "variants": ["DoctorCard", "AppointmentCard"],
            "guidelines": "Use for listing items like doctors or schedules. Ensure cards are tappable with ripple feedback[^8]."
          },
          {
            "name": "Button",
            "properties": {
              "height": "48px",
              "borderRadius": "4px",
              "color": "{colorPalette.primary}",
              "textColor": "#FFFFFF"
            },
            "variants": ["Primary", "Secondary", "Outline"],
            "guidelines": "Make buttons prominent with sufficient padding. Include icons for actions like 'Book Now'[^17]."
          },
          {
            "name": "NavigationBar",
            "properties": {
              "position": "Bottom",
              "items": 4,
              "icons": true
            },
            "guidelines": "Limit to 5 tabs max. Use intuitive icons (e.g., home, profile) for quick access[^11]."
          }
        ]
      },
      "accessibility": {
        "features": [
          "VoiceOver support",
          "High contrast modes",
          "Scalable text",
          "Alt text for images"
        ],
        "guidelines": "Design for diverse users: large touch targets, color-blind friendly palettes, and screen reader compatibility[^8][^17]."
      }
    },
    "replicationGuidelines": {
      "tokens": {
        "description": "Use design tokens for consistency. Export to JSON for tools like Style Dictionary to generate code[^4][^5][^6].",
        "example": "Transform JSON tokens into CSS/SCSS or native code (e.g., Swift/Kotlin) for cross-platform replication."
      },
      "responsiveDesign": {
        "breakpoints": {
          "mobile": "320px-480px",
          "tablet": "481px-768px"
        },
        "guidelines": "Adapt layouts for different screen sizes. Use fluid grids and media queries[^11]."
      },
      "bestPractices": "Focus on minimalism to reduce cognitive load. Test for usability in medical contexts (e.g., quick access to scheduling). Iterate with prototypes[^7][^11]."
    }
  }
}
```

This JSON can be extended or modified for specific needs. For replication in Cursor, input it as context to generate UI code or mockups that match this style[^1][^2].

<div style="text-align: center">⁂</div>

[^1]: https://www.designsystemscollective.com/the-missing-piece-in-mobile-development-design-tokens-chapter-1-499cf4d38a2c

[^2]: https://firefox-source-docs.mozilla.org/toolkit/themes/shared/design-system/docs/README.json-design-tokens.stories.html

[^3]: Screenshot-2025-07-14-at-6.35.39-PM.jpg

[^4]: https://help.nintex.com/en-us/nwc/Content/appdev/metadata-objects/v1/designsystem.htm

[^5]: https://github.com/weeeBox/mobile-system-design

[^6]: https://blogs.halodoc.io/simplifying-android-apps-design-with-design-tokens/

[^7]: https://www.youtube.com/watch?v=eRTTlS0zaW8

[^8]: https://fuselabcreative.com/healthcare-app-ui-ux-design-best-practices/

[^9]: https://pageflows.com/resources/what-is-the-json-format-in-ux-design/

[^10]: https://www.figma.com/community/file/1302566707232887096/doctor-appointment-app-ui-kit

[^11]: https://topflightapps.com/ideas/healthcare-mobile-app-design/

[^12]: https://www.designsystemscollective.com/the-missing-piece-in-mobile-development-tokens-to-code-chapter-2-cd386259ce40

[^13]: https://in.pinterest.com/pin/doctor-appointment-app--737464507744926216/

[^14]: https://www.emergobyul.com/news/ui-design-trends-healthcare-and-medical-apps

[^15]: https://blog.prototypr.io/outlining-a-json-structure-to-centralize-data-for-your-design-system-3ed31afe0d45

[^16]: https://www.behance.net/search/projects/doctor appointment app

[^17]: https://www.diversido.io/blog/which-interface-design-solutions-should-you-consider-for-your-medical-app

[^18]: https://www.behance.net/search/projects/doctor appointment app ui design?locale=en_US

[^19]: https://fruto.design/case-studies/ui-design-pattern-library-for-healthcare-app-pwa-and-native

[^20]: https://dribbble.com/tags/doctor-appointment

[^21]: https://www.uifry.com/styles-guides/details?style=medical-app-style-guide

