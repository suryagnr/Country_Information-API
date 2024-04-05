document.addEventListener('DOMContentLoaded', function() {
    const countryInput = document.getElementById('country-input');
    const searchBtn = document.getElementById('search-btn');
    const countryInfoDiv = document.getElementById('country-info');

    // Event listener untuk tombol pencarian
    searchBtn.addEventListener('click', function() {
        searchCountry();
        // Menampilkan kolom informasi negara setelah tombol cari ditekan
        countryInfoDiv.style.display = 'block';
    });

    // Event listener untuk input negara
    countryInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            searchCountry();
            // Menampilkan kolom informasi negara setelah tombol cari ditekan
            countryInfoDiv.style.display = 'block';
        }
    });

    // Event listener untuk pemilihan negara dari daftar
    const countriesList = document.getElementById('countries-list');
    countriesList.addEventListener('change', function() {
        const selectedCountry = this.value;
        if (selectedCountry !== '') {
            countryInput.value = selectedCountry;
            searchCountry();
            countryInfoDiv.style.display = 'block';
        }
    });

    // Fungsi untuk mencari informasi negara berdasarkan nama
    function searchCountry() {
        const countryName = countryInput.value.trim();
        if (countryName !== '') {
            fetchCountryInfo(countryName);
        }
    }

    // Fungsi untuk mengambil daftar nama-nama negara
    function fetchCountryNames() {
        fetch('https://restcountries.com/v3.1/all')
            .then(response => response.json())
            .then(data => {
                data.forEach(country => {
                    const option = document.createElement('option');
                    option.value = country.name.common;
                    option.textContent = country.name.common;
                    countriesList.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error fetching country names:', error);
            });
    }

    fetchCountryNames();

    // Fungsi untuk mengambil informasi negara berdasarkan nama dari API
    function fetchCountryInfo(countryName) {
        fetch(`https://restcountries.com/v3.1/name/${countryName}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 404) {
                    countryInfoDiv.innerHTML = '<p>Negara tidak ditemukan</p>';
                    return;
                }
                const country = data[0];
                const countryCapital = country.capital[0];
                const countryPopulation = country.population.toLocaleString();
                const countryLanguages = Object.values(country.languages).join(', ');

                fetch(`https://id.wikipedia.org/api/rest_v1/page/summary/${countryName}`)
                    .then(response => response.json())
                    .then(wikiData => {
                        const countryDescription = wikiData.extract || 'Deskripsi tidak tersedia';

                        const countryInfoHTML = `
                            <h2>${countryName}</h2>
                            <p class="description">${countryDescription}</p>
                            <p><strong>Ibu kota:</strong> ${countryCapital}</p>
                            <p><strong>Populasi:</strong> ${countryPopulation}</p>
                            <p><strong>Bahasa:</strong> ${countryLanguages}</p>
                        `;

                        countryInfoDiv.innerHTML = countryInfoHTML;

                        if (countryDescription.split('\n').length > 5) {
                            countryInfoDiv.querySelector('.description').classList.add('with-scroll');
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching Wikipedia data:', error);
                        countryInfoDiv.innerHTML = '<p>Gagal mengambil informasi negara</p>';
                    });
            })
            .catch(error => {
                console.error('Error fetching country information:', error);
                countryInfoDiv.innerHTML = '<p>Gagal mengambil informasi negara</p>';
            });
    }
});
