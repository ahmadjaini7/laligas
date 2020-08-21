
const baseUrl = "https://api.football-data.org/v2/";
const apiKey = "57595b3e4fae442b929a920cc5ac3352";

const homeSpanyol = `${baseUrl}competitions/2014/standings`;
const teamsSpanyol = `${baseUrl}competitions/2014/teams`;
const teamSpanyol = `${baseUrl}teams/`;

// blok kode yang akan dipanggil jika fetch berhasil
function status(response) {
    if (response.status != 200) {
        console.log("Error : " + response.status);
        return Promise.reject(new Error(response.statusText));
    } else {
        return Promise.resolve(response);
    }
}

// blok kode memparsing json menjadi array
function json(response) {
    return response.json();
}

// blok kode untuk menghandle kesalahan di blok catch
function error(error) {
    console.log("Error : " + error);
}

const fetchAPI = url => {
    return fetch(url, {
        headers: {
            'X-Auth-Token': apiKey
        }
    })
        .then(status)
        .then(json)
        .catch(error)
};

// home klasemen
function getHomeAll() {
    if ("caches" in window) {
        caches.match(homeSpanyol)
            .then(response => {
                if (response) {
                    response.json()
                        .then(data => {
                            console.log("Data Liga" + data);
                            tampilkanKlasemen(data);
                        })
                }
            })
    }

    fetchAPI(homeSpanyol)
        .then(data => {
            tampilkanKlasemen(data);
        })
        .catch(error)
}

function tampilkanKlasemen(data) {
    let standings = "";
    let standingElement = document.getElementById("home");

    data.standings[0].table.forEach(standing => {
        let logo = "";
        if (standing.team.crestUrl) {
            logo = `../https://ahmadjaini7.github.io/js/logo/${standing.team.id}.png`;
        }
        standings += `
                <tr>
                    <td>${standing.position}</td>
                    <td class="lebar"><img src="${logo}" width="40px" alt="logo Tim"/></td>
                    <td>${standing.team.name}</td>
                    <td>${standing.won}</td>
                    <td>${standing.draw}</td>
                    <td>${standing.lost}</td>
                    <td>${standing.points}</td>
                </tr>
        `;
    });

    standingElement.innerHTML = `
                <div class="box">
                <table class="responsive-table highlight">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Logo</th>
                            <th>Nama Tim</th>
                            <th>Menang</th>
                            <th>Imbang</th>
                            <th>Kalah</th>
                            <th>Point</th>
                        </tr>
                     </thead>
                    <tbody id="home">
                        ${standings}
                    </tbody>
                </table>
                </div>
    `;
}

// teams 
function getTeamsAll() {
    if ("caches" in window) {
        caches.match(teamsSpanyol)
            .then(response => {
                if (response) {
                    response.json()
                        .then(data1 => {
                            console.log("Data Semua Tim" + data1);
                            tampilkanKlubs(data1);
                        })
                }
            })
    }

    fetchAPI(teamsSpanyol)
        .then(data1 => {
            tampilkanKlubs(data1);
        })
        .catch(error)
}

function tampilkanKlubs(data1) {
    let teams = "";
    data1.teams.forEach(team => {
        let logo = "";
        if (team.crestUrl) {
            logo = `https://ahmadjaini7.github.io/js/logo/${team.id}.png`;
        }
        teams += `

            <div class="row">
            <div class="col s1 m2 l3"></div>
            <div class="col s10 m8 l6">
            <div class="card">
            <div class="card-image">
            <a href="/team.html?id=${team.id}">
            <img src="${logo}">
            </a>
            </div>
            <div class="card-action">
            <p class="center-align font" id="save">${team.name}</p>
            </div>
            </div>
            </div>
            <div class="col s1 m2 l3"></div>
            </div>
            `;
    });
    document.getElementById("teams").innerHTML = `${teams}`;
}

// Get tim berdasarkan ID
function getTeam() {
    return new Promise((resolve, reject) => {
        let urlParams = new URLSearchParams(window.location.search);
        let idParam = urlParams.get("id");

        if ("caches" in window) {
            caches.match(teamSpanyol + idParam)
                .then(response => {
                    if (response) {
                        response.json()
                            .then(data2 => {
                                console.log("Data Team" + data2);
                                tampilkanTeam(data2);
                                resolve(data2);
                            })
                    }
                })
        }

        fetchAPI(teamSpanyol + idParam)
            .then(data2 => {
                tampilkanTeam(data2);
                resolve(data2);
            });
    });
}

function tampilkanTeam(data2) {
    let logo = "";
    if (data2.crestUrl) {
        logo = `https://ahmadjaini7.github.io/js/logo/${data2.id}.png`;
    }
    let detailTeam = `
                                <div class="container">
                                <h4 class="heading">Informasi Team</h4>
                                <a class="heading" href="/index.html#saved">TIM di simpan</a>

                                <div class="row">
                                <div class="col s1 m2 l3"></div>
                                <div class="col s10 m8 l6">
                                <div class="card">
                                <div class="card-image ">
                                <img src="${logo}" alt="logo Tim" />
                                </div>
                                <div class="card-content">
                                <p>
                                <ul class="collection">
                                    <li class="collection-item"><span> Nama Pendek  =</span>${data2.shortName}</li>
                                    <li class="collection-item"><span> TLA = </span>${data2.tla}</li>
                                    <li class="collection-item"><span> Tahun Berdiri = </span>${data2.founded}</li>
                                    <li class="collection-item"><span> Warna Club = </span>${data2.clubColors}</li>
                                    <li class="collection-item"><span> Stadion = </span>${data2.venue}</li>
                                    <li class="collection-item"><span> Alamat = </span>${data2.address}</li>
                                </ul>
                                </p>
                                </div>
                                <div class="card-action">
                                <p class="center-align font">${data2.name}</p>
                                </div>
                                </div>
                                <div class="col s1 m2 l3"></div>
                                </div>
                                </div>
                                `;
    document.getElementById("body-content").innerHTML = detailTeam;
}

// menampilkan dari Indexed DB
function getSavedTeam() {
    getAll()
        .then((teams) => {
            console.log(teams);
            // menyusun secar dinamis
            let infoTim = "";
            infoTim += `<div class="container"> <h4 class="heading">Daftar Team Favorit</h4> </div>`;
            teams.forEach(team => {
                let logo = "";
                if (team.crestUrl) {
                    logo = `https://ahmadjaini7.github.io/js/logo/${team.id}.png`;
                }
                infoTim += `
                <div class="container">
                <div class="row">
                <div class="col s1 m2 l3"></div>
                <div class="col s10 m8 l6">
                <div class="card">
                <div class="card-image">
                <a href="/team.html?id=${team.id}&saved=true">
                <img src="${logo}">
                </a>
                </div>
                <div class="card-action">
                <p class="center-align font" id="save">${team.name}</p>
                </div>
                </div>
                </div>
                <button id="${team.id}" class="removeButton waves-effect waves-light btn-large btn center">Hapus Tim ${team.name}</button>
                </div>
                <div class="col s1 m2 l3"></div>
                </div>
                </div>
            `;
            });
            document.getElementById("body-content").innerHTML = infoTim;

            let removeButtons = document.querySelectorAll(".removeButton");
            for (let button of removeButtons) {
                button.addEventListener("click", function (event) {
                    let id = event.target.id;
                    deleteById(id).then(() => {
                        getSavedTeam()
                    })
                })
            }
        })
}

// Get save tim dari Indexed DB
function getSavedTeamById() {
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = urlParams.get("id");
    getById(idParam)
        .then((team) => {
            let logo = "";
            if (team.crestUrl) {
                logo = `https://ahmadjaini7.github.io/js/logo/${team.id}.png`;
            }
            let informasiTim = "";
            informasiTim = `
            <div class="container">
            <h4 class="heading">Informasi Team Favorit</h4>
            <a class="heading" href="/index.html#saved">TIM di simpan</a>
            <div class="row">
            <div class="col s1 m2 l3"></div>
            <div class="col s10 m8 l6">
            <div class="card">
            <div class="card-image ">
            <img src="${logo}" alt="logo Tim" />
            </div>
            <div class="card-content">
            <p>
            <ul class="collection">
                <li class="collection-item"><span> Nama Pendek  =</span>${team.shortName}</li>
                <li class="collection-item"><span> TLA = </span>${team.tla}</li>
                <li class="collection-item"><span> Tahun Berdiri = </span>${team.founded}</li>
                <li class="collection-item"><span> Warna Club = </span>${team.clubColors}</li>
                <li class="collection-item"><span> Stadion = </span>${team.venue}</li>
                <li class="collection-item"><span> Alamat = </span>${team.address}</li>
            </ul>
            </p>
            </div>
            <div class="card-action">
            <p class="center-align font">${team.name}</p>
            </div>
            </div>
            <div class="col s1 m2 l3"></div>
            </div>
            </div>
            `;
            document.getElementById("body-content").innerHTML = informasiTim;
        });
}
