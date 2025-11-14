var appTracking = new Vue({
    // 1. 'el' (element)
    el: '#trackingApp',

    // 2. 'data': Tempat semua data reaktif kita.
    data: {
        // Mengambil data tracking dari file data-tugas2.js
        daftarTracking: trackingList, 
        
        // Data untuk menampung input pencarian
        nomorDoInput: '',
        
        // Data untuk menampung hasil pencarian
        hasilTracking: null,
        
        // Penanda jika data tidak ditemukan
        notFound: false,
        // ---  UNTUK FORM ---
        daftarEkspedisi: pengirimanList,
        daftarPaket: paketList,
        formDO: {
            nim: '',
            nama: '',
            ekspedisi: 'REG',
            paketKode: '',
            tanggalKirim: new Date().toISOString().split('T')[0]
        },
        formError: '',
        doBaru: null 
        // --- AKHIR  ---
    },

    // 3. 'computed': Properti "pintar"
    computed: {
        progressBarStyle: function() {
            if (!this.hasilTracking) {
                return { width: '0%' };
            }
            var status = this.hasilTracking.status;
            if (status.includes("Selesai") || status.includes("Dikirim")) {
                return { width: '100%' };
            }
            if (status.includes("Perjalanan")) {
                return { width: '60%' };
            }
            return { width: '20%' };
        },
        
        // Computed property untuk menambah class 'selesai'
        progressBarClass: function() {
            if (!this.hasilTracking) {
                return '';
            }
            
            var status = this.hasilTracking.status;
            if (status.includes("Selesai") || status.includes("Dikirim")) {
                return 'selesai';
            }
            return '';
        },
        
        // Computed property untuk memformat harga
        formattedHarga: function() {
            if (!this.hasilTracking) {
                return '';
            }
            return 'Rp ' + this.hasilTracking.total.toLocaleString('id-ID');
        },

        detailPaketTerpilih: function() {
            if (!this.formDO.paketKode) {
                return null;
            }
            return this.daftarPaket.find(pkt => 
                pkt.kode === this.formDO.paketKode
            );
        }
    },

    // 4. 'methods': Fungsi-fungsi
    methods: {
        cariDO: function() {
            var nomorDO = this.nomorDoInput.trim();

            // 2. Cari data di 'daftarTracking'
            var dataDitemukan = this.daftarTracking[nomorDO];

            if (dataDitemukan) {
                // --- Data DITEMUKAN ---
                this.hasilTracking = dataDitemukan;
                this.notFound = false;
            } else {
                // --- Data TIDAK DITEMUKAN ---
                this.hasilTracking = null;
                this.notFound = true;
            }
        },
        tambahDO: function() {
            this.formError = '';
            if (!this.formDO.nim || !this.formDO.nama || !this.formDO.paketKode) {
                this.formError = 'Error: NIM, Nama, dan Paket Bahan Ajar wajib diisi!';
                return;
            }

            // 2. Dapatkan detail paket (dari computed)
            var paketTerpilih = this.detailPaketTerpilih;

            // 3. Buat Nomor DO Baru
            var tahun = new Date().getFullYear();
            var sequence = Object.keys(this.daftarTracking).length + 1;
            var nomorUrut = sequence.toString().padStart(3, '0'); 
            var nomorDOBaru = `DO${tahun}-${nomorUrut}`;

            // 4. Buat Objek DO Baru
            var doBaru = {
                nim: this.formDO.nim,
                nama: this.formDO.nama,
                status: 'Baru Diproses',
                ekspedisi: this.formDO.ekspedisi,
                tanggalKirim: this.formDO.tanggalKirim,
                paket: paketTerpilih.kode,
                total: paketTerpilih.harga,
                perjalanan: [
                    { 
                        waktu: new Date().toLocaleString('id-ID'), 
                        keterangan: 'Pesanan DO diterima oleh sistem.' 
                    }
                ]
            };

            // 5. Tambahkan data baru ke 'daftarTracking'
            Vue.set(this.daftarTracking, nomorDOBaru, doBaru);

            // 6. Tampilkan pesan sukses
            this.doBaru = doBaru;
            this.doBaru.nomorDO = nomorDOBaru;

            // 7. Reset form
            this.formDO = {
                nim: '',
                nama: '',
                ekspedisi: 'REG',
                paketKode: '',
                tanggalKirim: new Date().toISOString().split('T')[0]
            };
        }
        // --- AKHIR ---
    }
});