# 📦 Changelog

## [1.0.0] - 2025-06-26

### 🚀 Features
- Enhanced service detail modal and review fetching functionality.
- Introduced real-time 1-to-1 chat with Daphne Channels Redis.
- Implemented ratings and review functionality, with backend integration and frontend modal support.
- Integrated user services (created, completed, pending) in the dashboard with updated stat cards.
- Backend and frontend integrated to enable seamless modal interactions for service details and chatrooms.
- Added toast notifications to inform users of key actions and statuses.
- Fully connected the dashboard with user data, providing a personalized experience.
  
### ♻️ Refactoring
- Refined main CSS of dashboard for better responsiveness and performance.
- Improved structure of dashboard templates for easier maintenance.

### 🛠 Fixes
- Fixed issues with service request handling, including status validation and user data integration.
- Minor typo corrections in various templates and JavaScript files.

### 🧹 Chores
- Updated color scheme and applied visual refinements across the app.
- Removed unused static files and optimized project settings.
- Updated documentation with final feature list and badges.
- Cleaned up repository, including removing deprecated files and unnecessary configurations.

---

## [0.4.15] - 2025-05-30

### 📚 Documentation
- Comprehensive update to the documentation, including badges, features list, and usage instructions.

### 🧹 Chores
- Cleaned up repository by removing deprecated files and ensuring consistency in project structure.

---

## [0.4.14] - 2025-06-02

### 🚀 Features
- None for this release.

### ♻️ Refactoring
- Removed unused apps and views; updated settings and URL routing for cleaner project structure.

### 🧹 Chores
- None for this release.

---

## [0.4.13] - 2025-06-03

### 🚀 Features
- None for this release.

### ♻️ Refactoring
- Replaced core base template with a new structure and updated homepage template for better maintainability.

### 🛠 Fixes
- Fixed minor typos in various files including `urls.py` and `views.py`.
- Corrected Adminer access and updated `pyproject.toml`.

### 🧹 Chores
- Updated `.gitignore` to include static directory for better version control management.

---

## [0.4.12] - 2025-06-04

### 🚀 Features
- Implemented dashboard styles and HTML for improved UI consistency.

### ♻️ Refactoring
- Enhanced feed template structure and routing for cleaner backend integration.

### 🛠 Fixes
- No fixes for this release.

### 🧹 Chores
- None for this release.

---

## [0.4.11] - 2025-06-06

### 🚀 Features
- Developed initial dashboard template and styles.
- Created homepage template with static files and URL routing setup.

### ♻️ Refactoring
- Improved project structure by updating Dockerfile, Makefile commands, and settings.
- Added index and dashboard views with corresponding templates for consistency.

### 🛠 Fixes
- Fixed typo in `register.html` and `Register.css` (renamed to `register.css`).

### 🧹 Chores
- Merged latest changes from `dev` into feature branch `FEAT/dashboard`.
- Removed obsolete static and template files.

---

## [0.4.10] - 2025-06-09

### 🚀 Features
- Implemented dashboard functionality with registration and login forms.
- Enhanced registration and login form styling for better user experience.

### ♻️ Refactoring
- None for this release.

### 🛠 Fixes
- Fixed typo in `register.html`.
- Corrected capitalization in `Register.css` file (now `register.css`).

### 🧹 Chores
- Updated changelog and enhanced dashboard layout with CSS adjustments.
  
---

## [0.4.9] - 2025-06-11

### 🚀 Features
- Added dynamic feed section with data rendering and updated styling.
- Improved modals and layout with new designs and structure.

### ♻️ Refactoring
- None for this release.

### 🛠 Fixes
- No fixes for this release.

### 🧹 Chores
- None for this release.

---

## [0.4.8] - 2025-06-12

### 🚀 Features
- Integrated modals with dynamic content, revamped styles, and scripts.
- Added feed section with dynamic data rendering for enhanced user interaction.

### ♻️ Refactoring
- None for this release.

### 🛠 Fixes
- Improved forms and JavaScript for smoother user experience.
- Reworked label formatting and structure for consistency.

### 🧹 Chores
- Refined dashboard modals and restructured the layout for better accessibility.

---

## [0.4.7] - 2025-06-16

### 🚀 Features
- None for this release.

### ♻️ Refactoring
- None for this release.

### 🛠 Fixes
- No fixes for this release.

### 🧹 Chores
- Enhanced dashboard modal styles and forms.
- Updated flip card and chat styles for improved UI.

---

## [0.4.6] - 2025-06-18

### 🚀 Features
- Refined main styles and features, introducing variable colors for better theming.

### ♻️ Refactoring
- None for this release.

### 🛠 Fixes
- Improved placement and animations for main content elements.

### 🧹 Chores
- Integrated flip card functionality.
- Updated feed and index templates.

---

## [0.4.5] - 2025-06-19

### 🚀 Features
- Added files via upload.

### ♻️ Refactoring
- None for this release.

### 🛠 Fixes
- No fixes for this release.

### 🧹 Chores
- None for this release.

---

## [0.4.4] - 2025-06-22

### 🚀 Features
- Implemented 1-to-1 chat with real-time communication using Daphne Channels Redis.
- Updated feed, register, and index templates to reflect new functionality.

### ♻️ Refactoring
- None for this release.

### 🛠 Fixes
- No fixes for this release.

### 🧹 Chores
- None for this release.

---

## [0.4.3] - 2025-06-23

### 🚀 Features
- Integrated chat functionality with backend for real-time communication.
- Added tests for critical API paths to ensure system stability.
- Backend API integration for user authentication, dashboard, and service listing.
- Updated service models to include `desired_category` and default pricing.
- Implemented service request handling via API, including service listing and filtering.

### ♻️ Refactoring
- None for this release.

### 🛠 Fixes
- Fixed form issues with user data not being sent to the database (e.g., `first_name`, `last_name`, `location`).
- Added missing `pillow` dependency to the project.
- Corrected mismatched types and URL errors in API endpoints.

### 🧹 Chores
- Refined user avatar styling and functionality.
- Updated API endpoint for service requests and user profiles.
- Synced feature branch with latest `dev` changes.

---

## [0.4.2] - 2025-06-24

### 🚀 Features
- Added backend integration to the dashboard to display user services (created, completed, pending) with updated stat cards.
- Connected frontend modals to the chatroom and backend services.

### ♻️ Refactoring
- None for this release.

### 🛠 Fixes
- No fixes for this release.

### 🧹 Chores
- Updated site color and applied minor adjustments across UI components.

---

## [0.4.1] - 2025-06-25

### 🚀 Features
- Added ratings functionality, including review modal styles.
- Implemented review functionality with serializers, views, and API endpoints for better interaction.

### ♻️ Refactoring
- Refined dashboard CSS for cleaner structure and improved performance.

### 🛠 Fixes
- No fixes for this release.

### 🧹 Chores
- Revamped all styles and color schemes for better consistency.

---

## [0.4.0] - 2025-06-26

### 🚀 Features
- Implemented backend integration to display user services in the dashboard, including updated stat cards and service detail modals.
- Added real-time 1-to-1 chat functionality with backend integration.

### ♻️ Refactoring
- Refined main CSS of the dashboard for improved user experience.

### 🛠 Fixes
- No fixes for this release.

### 🧹 Chores
- Updated `feed.css` and `feed.js` for performance improvements.

---
## [0.3.0] - 2025-04-06

### 🚀 Features
- Implemented Register template with new design and user interaction.
- Introduced Flipcard HTML structure, styles, and assets for a more engaging UI.

### 📚 Documentation
- Updated the main documentation with detailed instructions on new features and design updates.

### 🧹 Chores
- Removed unnecessary HTTP logs from views for improved performance.

---

## [0.2.1] - 2025-03-06

### 🧹 Chores
- Created custom_static folder to better organize website assets.

### ♻️ Refactoring
- Enhanced project structure, including Dockerfile updates and new Makefile commands.
- Improved dashboard and index views for better backend interaction.

---

## [0.2.0] - 2025-04-06

### 🚀 Features
- Implemented Dashboard template for a better user experience.
- Introduced dashboard HTML structure, styles, and associated assets.

### 🛠 Fixes
- Fixed typos in view files and app URLs to prevent routing errors.

### 📚 Documentation
- Updated the main documentation with new sections reflecting recent updates.

### 🧹 Chores
- Removed unnecessary static file uploads from `.gitignore`.

---

## [0.1.0] - 2025-01-06

### 🚀 Features
- Implemented homepage template and set up static assets with URL routing.
- Integrated development container for streamlined environment setup.

### ♻️ Refactoring
- Replaced core base template with a new structure to enhance flexibility.
- Implemented index view and updated URL routing for better navigation.
- Removed unused apps and views, cleaned up settings and URLs.

### 🛠 Fixes
- Fixed various typos in `urls.py` and other template files.
- Corrected Adminer access and updated `pyproject.toml`.
- Applied minor typo and formatting fixes across the project.

### 📚 Documentation
- Updated main documentation with badges and an overview of new features.

### 🧹 Chores
- Initial project setup using Django core.
- Updated `.gitignore` to include the `static/` directory.
- Deleted unused static files and legacy HTML templates. 
