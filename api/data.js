const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../../data.json');

// Fungsi untuk membaca data dari file JSON
const readData = () => {
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
};

// Fungsi untuk menulis data ke file JSON
const writeData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

module.exports = (req, res) => {
  let data;
  try {
    data = readData();
  } catch (e) {
    return res.status(500).json({ error: 'Gagal membaca file data.json' });
  }

  const { key, phone, newPhone, newKey } = req.body;
  const method = req.method;

  if (method === 'GET') {
    return res.status(200).json(data);
  }

  if (method === 'POST') {
    if (!key || !phone) return res.status(400).json({ error: 'Key dan phone wajib diisi' });
    if (key !== data.key) return res.status(403).json({ error: 'Key salah' });

    const list = data.number.phone;
    const phones = Array.isArray(phone) ? phone : [phone];
    const added = [];

    phones.forEach(p => {
      if (!list.includes(p)) {
        list.push(p);
        added.push(p);
      }
    });

    writeData(data);
    return res.status(200).json({ success: true, added });
  }

  if (method === 'DELETE') {
    if (!key || !phone) return res.status(400).json({ error: 'Key dan phone wajib diisi' });
    if (key !== data.key) return res.status(403).json({ error: 'Key salah' });

    const list = data.number.phone;
    const phones = Array.isArray(phone) ? phone : [phone];
    const removed = [];

    data.number.phone = list.filter(p => {
      if (phones.includes(p)) {
        removed.push(p);
        return false;
      }
      return true;
    });

    writeData(data);
    return res.status(200).json({ success: true, removed });
  }

  if (method === 'PUT') {
    if (!key || !phone || !newPhone) {
      return res.status(400).json({ error: 'Key, phone, dan newPhone wajib diisi' });
    }
    if (key !== data.key) return res.status(403).json({ error: 'Key salah' });

    const idx = data.number.phone.indexOf(phone);
    if (idx === -1) return res.status(404).json({ error: 'Nomor tidak ditemukan' });

    data.number.phone[idx] = newPhone;
    writeData(data);
    return res.status(200).json({ success: true, updated: newPhone });
  }

  if (method === 'PATCH') {
    if (!key || key !== data.key) return res.status(403).json({ error: 'Key salah' });

    // Jika newKey tidak kosong, ubah; jika kosong, abaikan
    if (typeof newKey === 'string' && newKey.trim() !== '') {
      data.key = newKey;
    }

    writeData(data);
    return res.status(200).json({ success: true, updatedKey: data.key });
  }

  return res.status(405).json({ error: 'Metode tidak didukung' });
};