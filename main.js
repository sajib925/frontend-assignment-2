
const maxSelection = 11;
let selectedCount = 0;
const cardContainer = document.getElementById('cardContainer');
const searchInput = document.getElementById('searchInput');
const playerDetailsBody = document.getElementById('playerDetailsBody');

const playerNames = [ "Lionel_Messi", "Cristiano_Ronaldo", "Neymar", "Kylian_Mbappe", "Luis_Suarez","Gianluigi Buffon", "Vinicius Junior", "Casemiro", "Harry_Kane", "Zinedine_Zidane", "Karim_Benzema", "Cafu", "Rodrygo", "Jude_Bellingham", "Mohamed_Salah", "Virgil_van_Dijk", "Luka_Modric", "Sadio_Mane", "Kaká", "Antonio_Rüdiger", "Roberto_Carlos"];

const playerPromises = playerNames.map(name => {
    return fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${name}`)
        .then(response => response.json())
        .then(data => data.player[0]);
});

Promise.all(playerPromises)
    .then(players => {
            
            players.forEach(player => {
                const truncatedDescription = player.strDescriptionEN ? player.strDescriptionEN.split(' ').slice(0, 6).join(' ') + '...' : 'No description available.';
                const card = document.createElement('div');
                card.className = 'col-md-6 col-lg-4 mb-4 card-item';
                card.dataset.cardTitle = player.strPlayer;
                card.innerHTML = `
                    <div class="card">
                        <img src="${player.strThumb || 'https://via.placeholder.com/150'}" class="card-img-top" alt="${player.strPlayer}">
                        <div class="card-body">
                            <h5 class="card-title">${player.strPlayer}</h5>
                            <p><strong>Position:</strong> ${player.strPosition}</p>
                            <p><strong>Date of Birth:</strong> ${player.dateBorn}</p>
                            <p><strong>Nationality:</strong> ${player.strNationality}</p>
                            <p><strong>Team:</strong> ${player.strTeam}</p>
                            <p><strong>Status:</strong> ${player.strStatus}</p>
                            <p><strong>Description:</strong> ${truncatedDescription}</p>
                            <div class="social-icons">
                                <i class="fab fa-facebook-square" onclick="window.open('https://www.facebook.com/${player.strFacebook}', '_blank')"></i>
                                <i class="fab fa-twitter-square" onclick="window.open('https://www.twitter.com/${player.strTwitter}', '_blank')"></i>
                            </div>
                            <button class="btn btn-primary select-button">Select</button>
                            <button class="btn btn-info view-details-button" data-toggle="modal" data-target="#playerDetailsModal">View Details</button>
                        </div>
                    </div>
                `;
                cardContainer.appendChild(card);
            });

            cardContainer.addEventListener('click', function(event) {
                if (event.target.classList.contains('select-button')) {
                    const card = event.target.closest('.card');
                    const button = event.target;
                    if (card.classList.contains('selected')) {
                        card.classList.remove('selected');
                        button.textContent = 'Select';
                        selectedCount--;
                    } else if (selectedCount < maxSelection) {
                        card.classList.add('selected');
                        button.textContent = 'Selected';
                        selectedCount++;
                    }
                }
                if (event.target.classList.contains('view-details-button')) {
                    const card = event.target.closest('.card');
                    const playerName = card.querySelector('.card-title').textContent;
                    const player = players.find(p => p.strPlayer === playerName);
                    displayPlayerDetails(player);
                }
                updateSelectionStatus();
                updateCart();
            });
            function displayPlayerDetails(player) {
                
                const truncatedDescription = player.strDescriptionEN ? player.strDescriptionEN.split(' ').slice(0, 50).join(' ') + '...' : 'No description available.';
                playerDetailsBody.innerHTML = `
                    <div class="row">
                        <div class="col-md-4">
                            <img src="${player.strThumb || 'https://via.placeholder.com/150'}" class="img-fluid" alt="${player.strPlayer}">
                        </div>
                        <div class="col-md-8">
                            <h3>${player.strPlayer}</h3>
                            <p><strong>Position:</strong> ${player.strPosition}</p>
                            <p><strong>Date of Birth:</strong> ${player.dateBorn}</p>
                            <p><strong>Nationality:</strong> ${player.strNationality}</p>
                            <p><strong>Team:</strong> ${player.strTeam}</p>
                            <p><strong>Sport:</strong> ${player.strSport}</p>
                            <p><strong>Gender:</strong> ${player.strGender}</p>
                            <p><strong>Status:</strong> ${player.strStatus}</p>
                            <p><strong>Wage:</strong> ${player.strWage ? player.strWage : "Not Share"}</p>
                            <div class="social-icons">
                                <i class="fab fa-facebook-square" onclick="window.open('https://www.facebook.com/${player.strFacebook}', '_blank')"></i>
                                <i class="fab fa-twitter-square" onclick="window.open('https://www.twitter.com/${player.strTwitter}', '_blank')"></i>
                            </div>
                            <p><strong>Description:</strong> ${truncatedDescription}</p>
                        </div>
                    </div>
                `;
            }

            function updateSelectionStatus() {
                const buttons = document.querySelectorAll('.select-button');
                buttons.forEach(button => {
                    const card = button.closest('.card');
                    if (selectedCount >= maxSelection && !card.classList.contains('selected')) {
                        button.disabled = true;
                    } else {
                        button.disabled = false;
                    }
                });
            }

            function updateCart() {
                const selectedCards = document.querySelectorAll('.card.selected');
                const cartBody = document.getElementById('cartBody');
                const selectedCountElement = document.getElementById('selectedCount');
                
                cartBody.innerHTML = '';
                let totalSelected = 0;

                selectedCards.forEach(card => {
                    const cardTitle = card.querySelector('.card-title').textContent;
                    const quantity = card.classList.contains('selected') ? 1 : 0;
                    totalSelected += quantity;

                    const cardItem = document.createElement('p');
                    cardItem.textContent = cardTitle;
                    cartBody.appendChild(cardItem);
                });

                selectedCountElement.textContent = `Total Selected Players: ${totalSelected}`;
            }



            searchInput.addEventListener('input', function() {
                const filter = searchInput.value.toLowerCase();
                const cards = document.querySelectorAll('.card-item');
                cards.forEach(card => {
                    const title = card.dataset.cardTitle.toLowerCase();
                    if (title.includes(filter)) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
    })
    .catch(error => console.error('Error fetching data:', error));

