/**
 * Form validation utilities for the project submission form.
 */
const Validator = {
  /**
   * Check if a string value is non-empty after trimming.
   */
  isRequired(value) {
    return typeof value === 'string' && value.trim().length > 0;
  },

  /**
   * Validate an email address.
   */
  isValidEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email.trim());
  },

  /**
   * Validate a URL (http or https).
   */
  isValidUrl(url) {
    if (!url || url.trim() === '') return true; // optional field
    try {
      const parsed = new URL(url.trim());
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  },

  /**
   * Check if a number is within a range.
   */
  isInRange(value, min, max) {
    const num = parseInt(value, 10);
    return !isNaN(num) && num >= min && num <= max;
  },

  /**
   * Check if the end date is after the start date.
   */
  isValidDateRange(startDate, endDate) {
    if (!startDate || !endDate) return true; // optional
    return new Date(endDate) >= new Date(startDate);
  },

  /**
   * Check max length of a string.
   */
  isWithinMaxLength(value, max) {
    return typeof value === 'string' && value.length <= max;
  },

  /**
   * Show an error for a field.
   */
  showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + '-error');
    if (field) field.classList.add('invalid');
    if (errorEl) errorEl.textContent = message;
  },

  /**
   * Clear the error for a field.
   */
  clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + '-error');
    if (field) field.classList.remove('invalid');
    if (errorEl) errorEl.textContent = '';
  },

  /**
   * Validate the entire form. Returns true if valid.
   */
  validateForm(formData) {
    let isValid = true;

    // Project Name
    if (!this.isRequired(formData.projectName)) {
      this.showError('project-name', 'Project name is required.');
      isValid = false;
    } else {
      this.clearError('project-name');
    }

    // Category
    if (!this.isRequired(formData.category)) {
      this.showError('category', 'Please select a category.');
      isValid = false;
    } else {
      this.clearError('category');
    }

    // Description
    if (!this.isRequired(formData.description)) {
      this.showError('description', 'Project description is required.');
      isValid = false;
    } else if (!this.isWithinMaxLength(formData.description, 1000)) {
      this.showError('description', 'Description must be 1000 characters or fewer.');
      isValid = false;
    } else {
      this.clearError('description');
    }

    // Tech Stack
    if (!this.isRequired(formData.techStack)) {
      this.showError('tech-stack', 'Please list at least one technology.');
      isValid = false;
    } else {
      this.clearError('tech-stack');
    }

    // Repo URL (optional but must be valid if provided)
    if (!this.isValidUrl(formData.repoUrl)) {
      this.showError('repo-url', 'Please enter a valid URL.');
      isValid = false;
    } else {
      this.clearError('repo-url');
    }

    // Demo URL (optional but must be valid if provided)
    if (!this.isValidUrl(formData.demoUrl)) {
      this.showError('demo-url', 'Please enter a valid URL.');
      isValid = false;
    } else {
      this.clearError('demo-url');
    }

    // Team Lead
    if (!this.isRequired(formData.teamLead)) {
      this.showError('team-lead', 'Team lead name is required.');
      isValid = false;
    } else {
      this.clearError('team-lead');
    }

    // Email
    if (!this.isRequired(formData.email)) {
      this.showError('email', 'Email address is required.');
      isValid = false;
    } else if (!this.isValidEmail(formData.email)) {
      this.showError('email', 'Please enter a valid email address.');
      isValid = false;
    } else {
      this.clearError('email');
    }

    // Team Size
    if (!this.isRequired(formData.teamSize)) {
      this.showError('team-size', 'Team size is required.');
      isValid = false;
    } else if (!this.isInRange(formData.teamSize, 1, 20)) {
      this.showError('team-size', 'Team size must be between 1 and 20.');
      isValid = false;
    } else {
      this.clearError('team-size');
    }

    // Date range
    if (!this.isValidDateRange(formData.startDate, formData.endDate)) {
      this.showError('timeline', 'End date must be on or after the start date.');
      isValid = false;
    } else {
      this.clearError('timeline');
    }

    // Status
    if (!formData.status) {
      this.showError('status', 'Please select a project status.');
      isValid = false;
    } else {
      this.clearError('status');
    }

    // Terms
    if (!formData.terms) {
      this.showError('terms', 'You must agree to the submission guidelines.');
      isValid = false;
    } else {
      this.clearError('terms');
    }

    return isValid;
  }
};
