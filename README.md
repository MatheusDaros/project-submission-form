# Project Submission Form

A responsive, client-side project submission form built with vanilla HTML, CSS, and JavaScript.

## Features

- **Multi-section form** — Project info, team details, and additional context
- **Client-side validation** — Real-time inline validation on blur with descriptive error messages
- **Responsive design** — Works on desktop, tablet, and mobile
- **Character counter** — Live character count for the description field
- **Success modal** — Confirmation dialog on successful submission
- **Accessible** — Proper labels, focus states, and semantic HTML
- **Zero dependencies** — No frameworks or libraries required

## Form Fields

### Project Information
- Project Name (required)
- Category (required)
- Project Description (required, max 1000 chars)
- Technologies Used (required)
- Repository URL (optional)
- Live Demo URL (optional)

### Team Information
- Team Lead Name (required)
- Email Address (required)
- Team Size (required, 1–20)
- Team Members (optional)

### Additional Details
- Project Timeline (start/end dates)
- Project Status (required: Planning / In Progress / Completed)
- Challenges Faced (optional)
- Submission guidelines agreement (required)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/MatheusDaros/project-submission-form.git
   ```

2. Open `index.html` in your browser — no build step required.

## Project Structure

```
project-submission-form/
├── index.html          # Main HTML page
├── css/
│   └── styles.css      # All styles
├── js/
│   ├── validation.js   # Validation utilities
│   └── form.js         # Form controller & event handling
└── README.md
```

## Customization

- **Styling** — Edit `css/styles.css`. All colors and spacing use CSS custom properties defined in `:root`.
- **Validation rules** — Edit `js/validation.js` to change or add validation logic.
- **Form fields** — Add new fields in `index.html` and update the `collectFormData()` and validation functions accordingly.
- **Backend integration** — Replace the `console.log` in the submit handler (`js/form.js`) with a `fetch()` call to your API endpoint.

## License

MIT
