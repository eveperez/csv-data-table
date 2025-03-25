d = document;

let data = []
const firstColumn = d.getElementById("firstColumn");
const secondColumn = d.getElementById("secondColumn");
const searchInput = document.getElementById("searchInput");

cargarCSV()
    .then(() => {

        firstColumn.innerHTML = "";
        for (let i = 0; i < 25; i++) {
            const tr = document.createElement("tr");
            const tdNumber = document.createElement("td");
            tdNumber.innerHTML = i + 1;
            tr.appendChild(tdNumber);

            const tdName = document.createElement("td");
            tdName.innerHTML = data[i]["Nombre completo"];
            tr.appendChild(tdName);

            firstColumn.appendChild(tr);
        }

        secondColumn.innerHTML = "";
        for (let j = 25; j < 50; j++) {
            const tr = document.createElement("tr");
            const tdNumber = document.createElement("td");
            tdNumber.innerHTML = j + 1;
            tr.appendChild(tdNumber);

            const tdName = document.createElement("td");
            tdName.innerHTML = data[j]["Nombre completo"];
            tr.appendChild(tdName);

            secondColumn.appendChild(tr);
        }

        addClickEventToCells();

    })
    .catch((e) => {
        console.log("Error con el .csv" + e)
    })

searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.trim().toLowerCase();
    filterTable(searchTerm);
});

function filterTable(searchTerm) {
    const rowsFirstColumn = firstColumn.querySelectorAll("tr");
    const rowsSecondColumn = secondColumn.querySelectorAll("tr");

    // Función para filtrar filas en una columna
    const filterRows = (rows) => {
        rows.forEach((row) => {
            const name = row.querySelector("td:nth-child(2)").textContent.toLowerCase();
            if (name.includes(searchTerm)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    };

    filterRows(rowsFirstColumn);
    filterRows(rowsSecondColumn);
}

function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index].trim();
            return obj;
        }, {});
    });
}

async function cargarCSV() {

    try {
        const response = await fetch('data.csv');
        if (!response.ok) {
            throw new Error('Error al obtener archivo: ');
        }
        const csvText = await response.text();
        data = parseCSV(csvText);
    } catch (error) {
        console.log('Error: ' + error.message);
    }
}

function showDetails(index, row) {
    const user = data[index];

    const detailsRow = document.createElement("tr");
    detailsRow.classList.add("details-row");

    const detailsCell = document.createElement("td");
    detailsCell.colSpan = 2;
    detailsCell.innerHTML = `
        <p><strong>Nombre:</strong> ${user["Nombre completo"]}</p>
        <p><strong>Edad:</strong> ${user.Edad}</p>
        <p><strong>Sexo:</strong> ${user.Sexo}</p>
        <p><strong>Ocupación:</strong> ${user.Ocupación}</p>
        <p><strong>Nivel de estudios:</strong> ${user["Nivel de estudios"]}</p>
    `;

    detailsRow.appendChild(detailsCell);
    row.parentNode.insertBefore(detailsRow, row.nextSibling);
}

function addClickEventToCells() {
    const cellsFirstColumn = firstColumn.querySelectorAll("td:nth-child(2)");
    const cellsSecondColumn = secondColumn.querySelectorAll("td:nth-child(2)");

    const addEventToCell = (cell, index) => {
        cell.style.cursor = "pointer";
        cell.addEventListener("click", () => {
            const row = cell.parentNode;
            const existingDetailsRow = row.nextElementSibling;
            if (existingDetailsRow && existingDetailsRow.classList.contains("details-row")) {
                existingDetailsRow.remove();
            } else {
                showDetails(index, row);
            }
        });
    };

    cellsFirstColumn.forEach((cell, i) => {
        addEventToCell(cell, i);
    });

    cellsSecondColumn.forEach((cell, i) => {
        addEventToCell(cell, i + 25);
    });
}