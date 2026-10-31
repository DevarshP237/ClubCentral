# ClubCentral

ClubCentral is a student project that brings the student clubs of Christ (Deemed to be University), Pune Lavasa Campus, together in one place. It helps students discover clubs, explore club profiles and events, and find communities that match their interests.

## Features

- Browse and filter the student club directory.
- View club details and enquiry links.
- Explore featured clubs and campus events.
- Use the interactive community matcher to get club recommendations.
- Responsive, animated interface with a 3D visual experience.

## Built with

HTML, CSS, and vanilla JavaScript, with Three.js, GSAP, and Lenis for 3D graphics, animation, and scrolling. Club information is stored in the local JavaScript dataset; the project does not require a build step or backend service.

## Run locally

Clone the repository, then start a local static server from the project root:

```bash
python -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000) in your browser. A local server is recommended so that assets and pages load consistently.

## Project structure

```text
├── index.html       # Main landing page
├── club.html        # Individual club details
├── css/             # Stylesheets
├── js/              # Application code, club data, and vendor libraries
└── assets/          # Club logos and other media
```

## Project context

Created as a university-level web development project to make campus clubs easier to discover. Club details are presented for informational purposes; students should use the linked official channels to confirm current information.
