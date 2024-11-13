document.addEventListener('DOMContentLoaded', () => {
    const proxyUrl = 'https://api.allorigins.win/get?url=';
    const targetUrl = encodeURIComponent('https://apps.odoo.com/apps/modules/browse?order=Newest&search=odooly');
    
    let imageCounter = 1; // Initialize image counter
    
    fetch(proxyUrl + targetUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data.contents, 'text/html');
            const entries = doc.querySelectorAll('.loempia_app_entry');

            entries.forEach(entry => {
                const appUrl = entry.querySelector('a').getAttribute('href');
                const imageUrl = `images/apps/${imageCounter}.png`; // Generate image URL
                imageCounter++; // Increment image counter
                const summary = entry.querySelector('.loempia_panel_summary').textContent.trim();
                const title = entry.querySelector('.loempia_app_entry_bottom h5').textContent.trim();
                const author = entry.querySelector('.loempia_panel_author b').textContent.trim();
                const price = entry.querySelector('.oe_currency_value').textContent.trim();

                const appHtml = `
                    <div class="col-md-6 col-lg-3 mt-2" style="height: 400px;">
                        <div class="card" style="height: 100%;">
                            <a href="https://apps.odoo.com${appUrl}" target="_blank" style="height: 100%;">
                                <img src="${imageUrl}" class="card-img-top" style="height: 150px; object-fit: cover;">
                                <div class="card-body" style="flex: 1 1 auto;">
                                    <h5 class="card-title">${title}</h5>
                                    <p class="card-text"><small class="text-muted">Author: ${author}</small></p>
                                    <p class="card-text"><strong>$${price}</strong></p>              
                                </div>
                            </a>
                        </div>
                    </div>
                `;

                document.getElementById('odoo-apps').insertAdjacentHTML('beforeend', appHtml);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});

