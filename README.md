# Tresford Mulilima | Interactive Student Portfolio

This repository contains my ICT251 Web Technologies Activity 3 project for
Mulungushi University. It is a responsive and interactive personal student
portfolio website created using HTML5, CSS3 and JavaScript.

## Website Content

The website includes:

- About Me section.
- Interests and hobbies section.
- Projects and Skills section.
- Weekly web-development learning plan table.
- Captioned photo gallery.
- Self-introduction video.
- Audio reflection.
- Contact form.
- Responsive navigation and layout.
- View Source on GitHub link.

## JavaScript Features

This website contains four interactive JavaScript features:

1. **Contact form validation and local preview**
   - Rejects blank or whitespace-only names.
   - Rejects blank or whitespace-only messages.
   - Rejects invalid email addresses.
   - Shows a local validated preview without sending or storing data.
   - The form uses `event.preventDefault()` so no message is sent.

2. **Expandable project details**
   - Each project has a Show details button.
   - Clicking the button opens extra information.
   - Clicking Hide details closes the information.
   - The button updates its open or closed state.

3. **Photo gallery viewer**
   - Previous and Next buttons display one photo at a time.
   - The Previous button is disabled on the first photo.
   - The Next button is disabled on the last photo.
   - A status message shows the current photo number.

4. **Light and dark theme switch**
   - A button in the navigation switches between light and dark themes.
   - The button text changes between Dark mode and Light mode.
   - Both themes keep text, links, controls and form fields readable.

## How to Test the Website

1. Open the project folder in Visual Studio Code.
2. Open `index.html` using Live Server.
3. Click all navigation links.
4. Test the website at desktop and phone-sized widths.
5. Confirm that all photos load.
6. Play and pause the video and audio.
7. Submit the contact form with blank fields.
8. Submit the form using spaces only in the name or message fields.
9. Submit the form with an invalid email address.
10. Submit the form with valid information and confirm that a local preview appears.
11. Click each Show details button and then Hide details.
12. Use Previous and Next to test the gallery boundaries.
13. Click the theme button repeatedly to test light and dark modes.
14. Press the Tab key to confirm that links, buttons and form controls receive visible focus.
15. Open browser Developer Tools and confirm there are no JavaScript Console errors.

## Project Structure

```text
Web_Tech_TRESFORD/
├── index.html
├── README.md
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── images/
│   ├── logo.jpg
│   ├── Captain.jpeg
│   ├── Lukas focus mode.jpeg
│   └── Shaddy focus mode.jpeg
└── videos/
    ├── Zimba.mp4
    └── voice.mp3
```

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Visual Studio Code
- Git and GitHub
- Render Static Site hosting

## Sources and Credits

- Personal photos, logo, video and audio are my own or used with permission.
- Web-development learning resource:
  [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Learn)
- GitHub repository:
  [View Source on GitHub](https://github.com/2007Trek/Web_Tech_TRESFORD)

## Important Note

The contact form is a browser demonstration only. It validates input and
displays a local preview, but it does not send, store or deliver messages.