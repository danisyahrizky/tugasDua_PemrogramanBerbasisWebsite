/* =======================================================
   SCRIPT UTAMA APLIKASI (SETELAH DIEDIT)
   
   VERSI BERSIH:
   - Bagian 4 (Logika Tracking) TELAH DIHAPUS.
   - Bagian 5 (Logika Stok) TELAH DIHAPUS.
   
   File ini HANYA mengurus Sidebar, Login, dan Dashboard.
   ======================================================= */
document.addEventListener("DOMContentLoaded", function() {

    /* =======================================================
       1. LOGIKA GLOBAL: SIDEBAR COLLAPSIBLE
       (Berjalan di dashboard, tracking, & stock)
       ======================================================= */
    
    const sidebar = document.getElementById("sidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");
    
    // Cek apakah elemen sidebar ada
    // Modifikasi: Kita tidak bisa pakai mainContent ID lagi karena ID-nya
    // (stockApp/trackingApp) sekarang dipakai Vue. Kita targetkan class-nya.
    const mainContent = document.querySelector(".main-content"); 

    if (sidebar && sidebarToggle && mainContent) {

        // 1. Cek status tersimpan saat halaman dimuat
        const sidebarState = localStorage.getItem("sidebarState");
        if (sidebarState === "collapsed") {
            sidebar.classList.add("collapsed");
            // CSS di style.css sudah mengatur margin-left .main-content
            // saat .sidebar.collapsed, jadi kita tidak perlu toggle 
            // class di mainContent lagi.
        }

        // 2. Buat listener untuk tombol toggle
        sidebarToggle.addEventListener("click", function() {
            sidebar.classList.toggle("collapsed");

            // 3. Simpan status ke localStorage
            if (sidebar.classList.contains("collapsed")) {
                localStorage.setItem("sidebarState", "collapsed");
            } else {
                localStorage.setItem("sidebarState", "expanded");
            }
        });
    }


    /* =======================================================
       2. LOGIKA HALAMAN LOGIN (index.html)
       ======================================================= */
    
    const loginForm = document.getElementById("loginForm");
    
    // Cek apakah kita di halaman login
    if (loginForm) {
        
        // --- A. Logika Validasi Login ---
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault(); // Mencegah form refresh
            
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            
            // Cari user di 'dataPengguna' (dari data.js)
            const userValid = dataPengguna.find(user => {
                return user.email === email && user.password === password;
            });
            
            if (userValid) {
                // Jika berhasil:
                alert("Login Berhasil! Selamat datang, " + userValid.nama);
                
                // Simpan nama user di localStorage agar bisa dipakai di dashboard
                localStorage.setItem("namaUser", userValid.nama);
                
                // Arahkan ke dashboard
                window.location.href = "dashboard.html"; 
            } else {
                // Jika gagal:
                alert("email/password yang anda masukkan salah");
            }
        });

        // --- B. Logika Ikon Mata (Toggle Password) ---
        const togglePassword = document.getElementById("togglePassword");
        const passwordInput = document.getElementById("password");

        if (togglePassword) { // Tambahkan cek null
            togglePassword.addEventListener("click", function() {
                // Ganti tipe input
                const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
                passwordInput.setAttribute("type", type);
                
                // Ganti ikon mata
                this.classList.toggle("fa-eye");
                this.classList.toggle("fa-eye-slash");
            });
        }

        // --- C. Logika Modal (Pop-up) ---
        const forgotModal = document.getElementById("forgotPasswordModal");
        const registerModal = document.getElementById("registerModal");
        const forgotLink = document.getElementById("forgotPasswordLink");
        const registerLink = document.getElementById("registerLink");
        const closeForgot = document.getElementById("closeForgotModal");
        const closeRegister = document.getElementById("closeRegisterModal");

        function openModal(modal) { if (modal) modal.style.display = "flex"; }
        function closeModal(modal) { if (modal) modal.style.display = "none"; }

        if(forgotLink) forgotLink.onclick = (e) => { e.preventDefault(); openModal(forgotModal); };
        if(registerLink) registerLink.onclick = (e) => { e.preventDefault(); openModal(registerModal); };
        if(closeForgot) closeForgot.onclick = () => closeModal(forgotModal);
        if(closeRegister) closeRegister.onclick = () => closeModal(registerModal);

        // Tutup modal jika klik di luar
        window.onclick = function(event) {
            if (event.target == forgotModal) closeModal(forgotModal);
            if (event.target == registerModal) closeModal(registerModal);
        }
        
        // Logika form di dalam modal (simulasi)
        const forgotForm = document.getElementById("forgotForm");
        const registerForm = document.getElementById("registerForm");

        if (forgotForm) {
            forgotForm.addEventListener("submit", function(e) {
                e.preventDefault();
                alert("Instruksi reset (simulasi) dikirim.");
                closeModal(forgotModal);
            });
        }
        if (registerForm) {
            registerForm.addEventListener("submit", function(e) {
                e.preventDefault();
                alert("Pendaftaran (simulasi) berhasil.");
                closeModal(registerModal);
            });
        }
    } // --- Akhir 'if (loginForm)'


    /* =======================================================
       3. LOGIKA HALAMAN DASHBOARD (dashboard.html)
       ======================================================= */
    
    const greetingElement = document.getElementById("greeting");
    
    // Cek apakah kita di halaman dashboard
    if (greetingElement) {
        // Ambil nama user dari localStorage
        const namaUser = localStorage.getItem("namaUser");
        
        // Tentukan sapaan berdasarkan waktu
        const jam = new Date().getHours();
        let sapaan = "";
        
        if (jam >= 4 && jam < 11) {
            sapaan = "Selamat Pagi";
        } else if (jam >= 11 && jam < 15) {
            sapaan = "Selamat Siang";
        } else if (jam >= 15 && jam < 19) {
            sapaan = "Selamat Sore";
        } else {
            sapaan = "Selamat Malam";
        }
        
        if (namaUser) {
            greetingElement.innerText = sapaan + ", " + namaUser + "!";
        } else {
            greetingElement.innerText = sapaan + ", Pengguna!";
        }
    }

}); // --- AKHIR DARI DOMContentLoaded ---