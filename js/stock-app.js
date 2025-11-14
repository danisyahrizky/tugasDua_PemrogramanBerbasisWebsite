var appStok = new Vue({
    // 1. 'el' (element)l
    el: '#stockApp',

    // 2. 'data':
    data: {
    // Daftar stok utama yang akan ditampilkan
        daftarStok: stokList,
        daftarKategori: kategoriList,
        daftarUpbjj: upbjjList,

        // --- TAMBAHAN BARU UNTUK FILTER ---

        //menyimpan nilai <select> UT-Daerah
        filterUpbjj: '',
        filterKategori: '',
        filterHanyaMenipis: false,

        //menyimpan pilihan sorting
        sortBy: 'judul',
        formBaru: {
            kode: '',
            judul: '',
            kategori: 'MK Wajib',
            upbjj: 'Jakarta',
            lokasiRak: '',
            harga: 0,
            qty: 0,
            safety: 0,
            catatanHTML: ''
        },

        // Untuk validasi
        formError: '',
        isEditMode: false,
        editForm: null,
        formErrorEdit: ''
    },

    // 3. 'computed':
    computed: {
        filteredStock: function() {
            //daftar lengkap
            var filtered = this.daftarStok;
            if (this.filterUpbjj) {
                filtered = filtered.filter(function(item) {
                    return item.upbjj === this.filterUpbjj;
                }.bind(this));
            }
            if (this.filterKategori) {
                filtered = filtered.filter(function(item) {
                    return item.kategori === this.filterKategori;
                }.bind(this));
            }
            if (this.filterHanyaMenipis) {
                filtered = filtered.filter(function(item) {
                    return item.qty < item.safety || item.qty == 0;
                });
            }

            //SORTING ---

            var sortKey = this.sortBy;
            filtered = filtered.sort(function(a, b) {
                var valA = a[sortKey];
                var valB = b[sortKey];
                if (sortKey === 'judul' || sortKey === 'kategori') {
                    valA = valA.toLowerCase();
                    valB = valB.toLowerCase();
                }

                if (valA < valB) {
                    return -1;
                }
                if (valA > valB) {
                    return 1;
                }
                return 0;
            });

            return filtered;
        }
    }, 

    // 4. 'methods':
    methods: {
        resetFilters: function() {
  
        },

        //METHOD TAMBAH STOK ---
        tambahStok: function() {
            //validasi
            if (!this.formBaru.kode || 
                !this.formBaru.judul || 
                !this.formBaru.lokasiRak) {

                this.formError = 'Error: Kode, Judul, dan Lokasi Rak wajib diisi!';
                return;
            }

            // membuat objek baru
            var newItem = {
                kode: this.formBaru.kode,
                judul: this.formBaru.judul,
                kategori: this.formBaru.kategori,
                upbjj: this.formBaru.upbjj,
                lokasiRak: this.formBaru.lokasiRak,
                harga: parseInt(this.formBaru.harga) || 0,
                qty: parseInt(this.formBaru.qty) || 0,
                safety: parseInt(this.formBaru.safety) || 0,
                catatanHTML: this.formBaru.catatanHTML || '',
                cover: 'img/placeholder-book.jpg' 
            };

            // 3. Memasukkan data baru ke awal array 'daftarStok'
            this.daftarStok.unshift(newItem);

            // 4. membersihkan form dan error
            this.formError = '';
            this.formBaru = {
                kode: '',
                judul: '',
                kategori: 'MK Wajib',
                upbjj: 'Jakarta',
                lokasiRak: '',
                harga: 0,
                qty: 0,
                safety: 0,
                catatanHTML: ''
            };
        },

        mulaiEdit: function(item) {
        // Reset error
            this.formErrorEdit = '';
            this.editForm = Object.assign({}, item);
            this.isEditMode = true;
        },

        // 2. Dipanggil saat tombol 'Batal' di modal diklik
        batalEdit: function() {
            this.isEditMode = false;
            this.editForm = null;
            this.formErrorEdit = '';
        },

        // 3. Dipanggil saat tombol 'Update Stok' di modal diklik
        updateStok: function() {
            if (!this.editForm.judul || !this.editForm.lokasiRak) {
                this.formErrorEdit = 'Error: Judul dan Lokasi Rak wajib diisi!';
                return;
            }
            var index = this.daftarStok.findIndex(item => 
                item.kode === this.editForm.kode
            );
            if (index > -1) {
                Vue.set(this.daftarStok, index, this.editForm);
                this.batalEdit();
            } else {
                this.formErrorEdit = 'Error: Item tidak ditemukan!';
            }
        }
        // --- AKHIR
    }
});