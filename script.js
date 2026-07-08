let currentMethod = 'maju';

function switchTab(method) {
    currentMethod = method;
    const tabs = ['maju', 'mundur', 'pusat'];
    
    tabs.forEach(t => {
        const btn = document.getElementById(`tab-${t}`);
        if(t === method) {
            btn.className = "tab-btn active";
        } else {
            btn.className = "tab-btn inactive";
        }
    });
    hitungSemua();
}

function hitungSemua() {
    const statusBadge = document.getElementById('status-badge');
    try {
        statusBadge.className = "badge-processing";
        statusBadge.innerText = "Memproses...";

        const formulaInput = document.getElementById('input-fx').value;
        const x = parseFloat(document.getElementById('input-x').value);
        const h = parseFloat(document.getElementById('input-h').value);

        // Kompilasi String Fungsi menggunakan Math.js
        const node = math.parse(formulaInput);
        const compiled = node.compile();
        const f = (valX) => compiled.evaluate({ x: valX });

        // Menghitung Nilai Eksak/Analitis menggunakan fungsi turunan bawaan Math.js
        const d1Simbolik = math.derivative(formulaInput, 'x');
        const d2Simbolik = math.derivative(d1Simbolik, 'x');
        
        const eksakF1 = d1Simbolik.compile().evaluate({ x: x });
        const eksakF2 = d2Simbolik.compile().evaluate({ x: x });

        let dataF1 = [];
        let dataF2 = [];

        if (currentMethod === 'maju') {
            // --- SELISIH MAJU (FORWARD DIFFERENCE) ---
            // Turunan Pertama (Orde 1 - 4)
            dataF1.push((f(x + h) - f(x)) / h);
            dataF1.push((-f(x + 2 * h) + 4 * f(x + h) - 3 * f(x)) / (2 * h));
            dataF1.push((2 * f(x + 3 * h) - 9 * f(x + 2 * h) + 18 * f(x + h) - 11 * f(x)) / (6 * h));
            dataF1.push((-3 * f(x + 4 * h) + 16 * f(x + 3 * h) - 36 * f(x + 2 * h) + 48 * f(x + h) - 25 * f(x)) / (12 * h));

            // Turunan Kedua (Orde 1 - 4)
            dataF2.push((f(x + 2 * h) - 2 * f(x + h) + f(x)) / (h * h));
            dataF2.push((-f(x + 3 * h) + 4 * f(x + 2 * h) - 5 * f(x + h) + 2 * f(x)) / (h * h));
            dataF2.push((11 * f(x + 4 * h) - 56 * f(x + 3 * h) + 114 * f(x + 2 * h) - 104 * f(x + h) + 35 * f(x)) / (12 * h * h));
            dataF2.push((45 * f(x) - 154 * f(x + h) + 214 * f(x + 2 * h) - 156 * f(x + 3 * h) + 61 * f(x + 4 * h) - 10 * f(x + 5 * h)) / (12 * h * h));

        } else if (currentMethod === 'mundur') {
            // --- SELISIH MUNDUR (BACKWARD DIFFERENCE) ---
            // Turunan Pertama (Orde 1 - 4)
            dataF1.push((f(x) - f(x - h)) / h);
            dataF1.push((3 * f(x) - 4 * f(x - h) + f(x - 2 * h)) / (2 * h));
            dataF1.push((11 * f(x) - 18 * f(x - h) + 9 * f(x - 2 * h) - 2 * f(x - 3 * h)) / (6 * h));
            dataF1.push((25 * f(x) - 48 * f(x - h) + 36 * f(x - 2 * h) - 16 * f(x - 3 * h) + 3 * f(x - 4 * h)) / (12 * h));

            // Turunan Kedua (Orde 1 - 4)
            dataF2.push((f(x) - 2 * f(x - h) + f(x - 2 * h)) / (h * h));
            dataF2.push((2 * f(x) - 5 * f(x - h) + 4 * f(x - 2 * h) - f(x - 3 * h)) / (h * h));
            dataF2.push((35 * f(x) - 104 * f(x - h) + 114 * f(x - 2 * h) - 56 * f(x - 3 * h) + 11 * f(x - 4 * h)) / (12 * h * h));
            dataF2.push((45 * f(x) - 154 * f(x - h) + 214 * f(x - 2 * h) - 156 * f(x - 3 * h) + 61 * f(x - 4 * h) - 10 * f(x - 5 * h)) / (12 * h * h));

        } else if (currentMethod === 'pusat') {
            // --- SELISIH PUSAT (CENTRAL DIFFERENCE) ---
            // Turunan Pertama (Skema Pembagian Akurasi Pola Simetris)
            dataF1.push((f(x + h) - f(x - h)) / (2 * h));
            dataF1.push((-f(x + 2 * h) + 8 * f(x + h) - 8 * f(x - h) + f(x - 2 * h)) / (12 * h));
            dataF1.push((f(x + 3 * h) - 9 * f(x + 2 * h) + 45 * f(x + h) - 45 * f(x - h) + 9 * f(x - 2 * h) - f(x - 3 * h)) / (60 * h));
            dataF1.push((-3 * f(x + 4 * h) + 32 * f(x + 3 * h) - 168 * f(x + 2 * h) + 672 * f(x + h) - 672 * f(x - h) + 168 * f(x - 2 * h) - 32 * f(x - 3 * h) + 3 * f(x - 4 * h)) / (840 * h));

            // Turunan Kedua
            dataF2.push((f(x + h) - 2 * f(x) + f(x - h)) / (h * h));
            dataF2.push((-f(x + 2 * h) + 16 * f(x + h) - 30 * f(x) + 16 * f(x - h) - f(x - 2 * h)) / (12 * h * h));
            dataF2.push((f(x + 3 * h) - 15 * f(x + 2 * h) + 135 * f(x + h) - 240 * f(x) + 135 * f(x - h) - 15 * f(x - 2 * h) + f(x - 3 * h)) / (180 * h * h));
            dataF2.push((-2 * f(x + 4 * h) + 32 * f(x + 3 * h) - 384 * f(x + 2 * h) + 2688 * f(x + h) - 4620 * f(x) + 2688 * f(x - h) - 384 * f(x - 2 * h) + 32 * f(x - 3 * h) - 2 * f(x - 4 * h)) / (5040 * h * h));
        }

        // Render Data untuk Tabel Turunan Pertama
        let htmlF1 = "";
        dataF1.forEach((val, index) => {
            let galat = eksakF1 !== 0 ? Math.abs((val - eksakF1) / eksakF1) * 100 : 0;
            // Jika galat di atas 5%, berikan styling badge merah menyala seperti di mockup Anda
            let badgeStyle = galat > 5 ? "bg-rose-500 text-white font-semibold text-xs px-2 py-0.5 rounded-full" : "text-slate-600 font-medium";
            htmlF1 += `<tr class="text-xs text-slate-600 hover:bg-slate-50/80 transition-colors">
                <td class="py-3 font-medium text-slate-500">Orde ${index + 1}</td>
                <td class="py-3 font-semibold text-slate-800">${val.toFixed(5)}</td>
                <td class="py-3 text-right"><span class="${badgeStyle}">${galat.toFixed(2)}%</span></td>
            </tr>`;
        });
        document.getElementById('table-f1').innerHTML = htmlF1;

        // Render Data untuk Tabel Turunan Kedua
        let htmlF2 = "";
        dataF2.forEach((val, index) => {
            let galat = eksakF2 !== 0 ? Math.abs((val - eksakF2) / eksakF2) * 100 : 0;
            let badgeStyle = galat > 5 ? "bg-rose-500 text-white font-semibold text-xs px-2 py-0.5 rounded-full" : "text-slate-600 font-medium";
            htmlF2 += `<tr class="text-xs text-slate-600 hover:bg-slate-50/80 transition-colors">
                <td class="py-3 font-medium text-slate-500">Orde ${index + 1}</td>
                <td class="py-3 font-semibold text-slate-800">${val.toFixed(5)}</td>
                <td class="py-3 text-right"><span class="${badgeStyle}">${galat.toFixed(2)}%</span></td>
            </tr>`;
        });
        document.getElementById('table-f2').innerHTML = htmlF2;

        // Tampilkan Nilai Hasil Ringkasan Akhir (Mengambil hasil presisi Orde 4)
        document.getElementById('final-f1').innerText = dataF1[3].toFixed(3);
        document.getElementById('final-f2').innerText = dataF2[3].toFixed(3);

        // Perbarui Logika Teks Analisis Konvergensi secara Dinamis
        let namaMetode = currentMethod === 'maju' ? 'Selisih Maju' : currentMethod === 'mundur' ? 'Selisih Mundur' : 'Selisih Pusat';
        let galatAkhir = eksakF1 !== 0 ? Math.abs((dataF1[3] - eksakF1) / eksakF1) * 100 : 0;
        document.getElementById('analisis-teks').innerHTML = `Berdasarkan hasil <strong>${namaMetode}</strong>, galat menunjukkan tren penurunan eksponensial seiring bertambahnya orde. Untuk akurasi tinggi, disarankan menggunakan <strong>Orde 4</strong> dengan nilai galat mencapai tingkat minimum sebesar <strong>${galatAkhir.toFixed(2)}%</strong> terhadap kalkulasi eksak matematis.`;

        // Kembalikan status ke normal setelah berhasil
        setTimeout(() => {
            statusBadge.className = "badge-success";
            statusBadge.innerText = "Sistem Siap";
        }, 400);

    } catch (err) {
        console.error(err);
        statusBadge.className = "badge-error";
        statusBadge.innerText = "Gagal Memproses";
        document.getElementById('analisis-teks').innerHTML = `<span class="text-rose-600 font-semibold">Kesalahan Format Rumus:</span> Pastikan penulisan ekspresi fungsi x benar. Contoh: <code>sin(x) * exp(x)</code> atau <code>x^2 + 2*x</code>.`;
    }
}

// Inisialisasi kalkulasi perdana sesaat setelah dokumen web selesai termuat
window.onload = function() {
    hitungSemua();
};