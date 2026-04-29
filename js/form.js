/**
 * Project Submission Form — main controller.
 */
(function () {
  'use strict';

  const form = document.getElementById('submission-form');
  const successModal = document.getElementById('success-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const descriptionField = document.getElementById('description');
  const charCount = document.getElementById('description-count');
  const MAX_DESC_LENGTH = 1000;

  // ---- Character counter for description ----
  function updateCharCount() {
    const len = descriptionField.value.length;
    charCount.textContent = len + ' / ' + MAX_DESC_LENGTH;
    charCount.classList.remove('limit-near', 'limit-reached');
    if (len >= MAX_DESC_LENGTH) {
      charCount.classList.add('limit-reached');
    } else if (len >= MAX_DESC_LENGTH * 0.9) {
      charCount.classList.add('limit-near');
    }
  }

  descriptionField.addEventListener('input', updateCharCount);

  // ---- Collect form data ----
  function collectFormData() {
    const statusRadio = form.querySelector('input[name="status"]:checked');
    return {
      projectName: form.querySelector('#project-name').value,
      category: form.querySelector('#category').value,
      description: form.querySelector('#description').value,
      techStack: form.querySelector('#tech-stack').value,
      repoUrl: form.querySelector('#repo-url').value,
      demoUrl: form.querySelector('#demo-url').value,
      teamLead: form.querySelector('#team-lead').value,
      email: form.querySelector('#email').value,
      teamSize: form.querySelector('#team-size').value,
      teamMembers: form.querySelector('#team-members').value,
      startDate: form.querySelector('#start-date').value,
      endDate: form.querySelector('#end-date').value,
      status: statusRadio ? statusRadio.value : null,
      challenges: form.querySelector('#challenges').value,
      terms: form.querySelector('#terms').checked
    };
  }

  // ---- Inline validation on blur ----
  function attachBlurValidation() {
    const requiredFields = [
      { id: 'project-name', key: 'projectName' },
      { id: 'category', key: 'category' },
      { id: 'description', key: 'description' },
      { id: 'tech-stack', key: 'techStack' },
      { id: 'team-lead', key: 'teamLead' },
      { id: 'email', key: 'email' },
      { id: 'team-size', key: 'teamSize' }
    ];

    requiredFields.forEach(function (field) {
      var el = document.getElementById(field.id);
      if (!el) return;

      el.addEventListener('blur', function () {
        var data = collectFormData();
        // Re-validate just this field by running full validation quietly
        // then only showing/clearing error for this field
        validateSingleField(field.id, field.key, data);
      });

      // Clear error on input
      el.addEventListener('input', function () {
        Validator.clearError(field.id);
      });
    });

    // URL fields
    ['repo-url', 'demo-url'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('blur', function () {
        if (!Validator.isValidUrl(el.value)) {
          Validator.showError(id, 'Please enter a valid URL.');
        } else {
          Validator.clearError(id);
        }
      });
      el.addEventListener('input', function () {
        Validator.clearError(id);
      });
    });
  }

  function validateSingleField(fieldId, key, data) {
    switch (key) {
      case 'projectName':
        if (!Validator.isRequired(data.projectName)) {
          Validator.showError(fieldId, 'Project name is required.');
        } else {
          Validator.clearError(fieldId);
        }
        break;
      case 'category':
        if (!Validator.isRequired(data.category)) {
          Validator.showError(fieldId, 'Please select a category.');
        } else {
          Validator.clearError(fieldId);
        }
        break;
      case 'description':
        if (!Validator.isRequired(data.description)) {
          Validator.showError(fieldId, 'Project description is required.');
        } else if (!Validator.isWithinMaxLength(data.description, MAX_DESC_LENGTH)) {
          Validator.showError(fieldId, 'Description must be 1000 characters or fewer.');
        } else {
          Validator.clearError(fieldId);
        }
        break;
      case 'techStack':
        if (!Validator.isRequired(data.techStack)) {
          Validator.showError(fieldId, 'Please list at least one technology.');
        } else {
          Validator.clearError(fieldId);
        }
        break;
      case 'teamLead':
        if (!Validator.isRequired(data.teamLead)) {
          Validator.showError(fieldId, 'Team lead name is required.');
        } else {
          Validator.clearError(fieldId);
        }
        break;
      case 'email':
        if (!Validator.isRequired(data.email)) {
          Validator.showError(fieldId, 'Email address is required.');
        } else if (!Validator.isValidEmail(data.email)) {
          Validator.showError(fieldId, 'Please enter a valid email address.');
        } else {
          Validator.clearError(fieldId);
        }
        break;
      case 'teamSize':
        if (!Validator.isRequired(data.teamSize)) {
          Validator.showError(fieldId, 'Team size is required.');
        } else if (!Validator.isInRange(data.teamSize, 1, 20)) {
          Validator.showError(fieldId, 'Team size must be between 1 and 20.');
        } else {
          Validator.clearError(fieldId);
        }
        break;
    }
  }

  // ---- Form submit ----
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = collectFormData();
    var isValid = Validator.validateForm(data);

    if (isValid) {
      // In a real app, this would POST to an API.
      console.log('Form submitted:', data);
      successModal.classList.add('active');
    } else {
      // Scroll to first error
      var firstInvalid = form.querySelector('.invalid');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalid.focus();
      }
    }
  });

  // ---- Reset form ----
  form.addEventListener('reset', function () {
    // Clear all errors after a tick (reset event fires before values clear)
    setTimeout(function () {
      var errors = form.querySelectorAll('.error-message');
      errors.forEach(function (el) { el.textContent = ''; });
      var invalids = form.querySelectorAll('.invalid');
      invalids.forEach(function (el) { el.classList.remove('invalid'); });
      updateCharCount();
    }, 0);
  });

  // ---- Modal close ----
  modalCloseBtn.addEventListener('click', function () {
    successModal.classList.remove('active');
    form.reset();
  });

  successModal.addEventListener('click', function (e) {
    if (e.target === successModal) {
      successModal.classList.remove('active');
      form.reset();
    }
  });

  // ---- Init ----
  attachBlurValidation();
  updateCharCount();
})();
