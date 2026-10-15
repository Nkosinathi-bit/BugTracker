# BugTracker

[![Browser checks](https://github.com/Nkosinathi-bit/BugTracker/actions/workflows/site-check.yml/badge.svg)](https://github.com/Nkosinathi-bit/BugTracker/actions/workflows/site-check.yml)

**Learning project · JavaScript · HTML/CSS · Bootstrap 5**

A browser-only issue tracker with a dashboard, issue creation and editing, assignee selection, search, filtering and local persistence.

## Try it

Run from the repository root:

~~~bash
python -m http.server 8000
~~~

Open http://localhost:8000 and use the **demo login: admin / 1234**.

Create an issue straight away, or choose **Load 10 Sample Issues** to explore the dashboard with sample data.

## Implemented features

- Create issues with a summary, description, priority, target date and assignee.
- Search by text and filter by status or priority.
- View issue details and edit existing records.
- Set resolution information and automatically fill a missing resolution date.
- Show overdue status for open issues past their target date.
- Persist issues in localStorage and the demo login state in sessionStorage.
- Load or clear the demo dataset and inspect its JSON representation.

## Files

| File | Responsibility |
| --- | --- |
| index.html | Login, creation form, dashboard and edit modal |
| style.css | Responsive application styling |
| script.js | Browser storage, validation, rendering and issue operations |
| .github/scripts/check-site.cjs | Browser behaviour checks |
| .github/workflows/site-check.yml | Automated Chromium check workflow |

## Storage and login scope

All application data is stored in the current browser. There is no server, shared database or real authentication service. The hard-coded demo login is a presentation gate for this learning application.

Bootstrap is loaded from jsDelivr, so an internet connection is needed for the framework's styles and modal behaviour. Sample project and team-member records are demonstration data.

## Verification

Browser checks cover login, sample data, issue creation, editing, filtering, persistence and responsive layout.
