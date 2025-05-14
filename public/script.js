const apiUrl = '/api/data';

async function getPhoneNumbers() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    displayPhoneNumbers(data.number.phone);
  } catch (error) {
    alert('Error fetching data');
  }
}

async function addPhoneNumber() {
  const key = document.getElementById('key').value;
  const phone = document.getElementById('phone').value;
  
  if (!key || !phone) {
    alert('Key and phone number are required');
    return;
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, phone })
  });

  const result = await response.json();
  if (result.success) {
    alert(`Phone added: ${result.added}`);
    getPhoneNumbers();
  } else {
    alert('Error: ' + result.error);
  }
}

async function deletePhoneNumber() {
  const key = document.getElementById('key').value;
  const phone = document.getElementById('phone').value;

  if (!key || !phone) {
    alert('Key and phone number are required');
    return;
  }

  const response = await fetch(apiUrl, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, phone })
  });

  const result = await response.json();
  if (result.success) {
    alert(`Phone deleted: ${result.removed}`);
    getPhoneNumbers();
  } else {
    alert('Error: ' + result.error);
  }
}

async function editPhoneNumber() {
  const key = document.getElementById('key').value;
  const phone = document.getElementById('phone').value;
  const newPhone = document.getElementById('newPhone').value;

  if (!key || !phone || !newPhone) {
    alert('Key, phone, and new phone number are required');
    return;
  }

  const response = await fetch(apiUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, phone, newPhone })
  });

  const result = await response.json();
  if (result.success) {
    alert(`Phone updated: ${result.updated}`);
    getPhoneNumbers();
  } else {
    alert('Error: ' + result.error);
  }
}

async function changeKey() {
  const key = document.getElementById('key').value;
  const newKey = prompt('Enter new key (kosongkan untuk tidak mengubah):');

  if (!key) {
    alert('Key saat ini wajib diisi');
    return;
  }

  const response = await fetch(apiUrl, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, newKey })
  });

  const result = await response.json();
  if (result.success) {
    alert(`Key saat ini: ${result.updatedKey}`);
  } else {
    alert('Error: ' + result.error);
  }
}

function displayPhoneNumbers(phones) {
  const listElement = document.getElementById('phone-list');
  listElement.innerHTML = '';

  phones.forEach(phone => {
    const listItem = document.createElement('li');
    listItem.textContent = phone;
    listElement.appendChild(listItem);
  });
}

// Load phone numbers when the page is loaded
window.onload = getPhoneNumbers;