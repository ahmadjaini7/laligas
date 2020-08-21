// koneksi dan buat database
const dbLaliga = idb.open("Liga-spanyol", 1, upgradeDb => {
    let timObjectStore = upgradeDb.createObjectStore("teams", {
        keyPath: "id",
        autoIncrement: true
    });
    timObjectStore.createIndex("name", "name", { unique: true })
});

// menambahkan ke objectstore
function simpan(team) {
    dbLaliga
        .then(db => {
            let tx = db.transaction("teams", "readwrite");
            let store = tx.objectStore("teams");
            console.log(store);
            store.add(team);
            return tx.complete;
        })
        .then(() => {
            console.log("Artikel Berhasil disimpan");
        })
}

// mengambil data dan menampilkanya
function getAll() {
    return new Promise((resolve, reject) => {
        dbLaliga
            .then((db) => {
                let tx = db.transaction("teams", "readonly");
                let store = tx.objectStore("teams");
                console.log(store);
                return store.getAll();
            })
            .then((teams) => {
                resolve(teams)
            })
    })
}

// Get Id 
function getById(id) {
    return new Promise((resolve, reject) => {
        dbLaliga
            .then((db) => {
                let tx = db.transaction("teams", "readonly");
                let store = tx.objectStore("teams");
                return store.get(+id);
            })
            .then((team) => {
                resolve(team);
            });
    });
}

// Delete id
function deleteById(id) {
    return new Promise((resolve, reject) => {
        dbLaliga
            .then((db) => {
                let tx = db.transaction("teams", "readwrite");
                let store = tx.objectStore("teams");
                store.delete(+id);
                return tx;
            })
            .then((tx) => {
                if (tx.complete) {
                    resolve(true)
                } else {
                    reject(new Error(transaction.onerror))
                }
            });
    })
}