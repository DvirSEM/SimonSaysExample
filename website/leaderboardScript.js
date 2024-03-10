let table = document.getElementsByClassName("recordsTable")[0];

async function getRecords() {
  let response = await fetch("/getRecords");
  let records = await response.json();

  for (let i = 0; i < records.length; i++) {
    let record = records[i];

    let tr = document.createElement("tr");
    table.appendChild(tr);
    
    let nameTd = document.createElement("td");
    nameTd.innerText = record.Name;
    tr.appendChild(nameTd);

    let scoreTd = document.createElement("td");
    scoreTd.innerText = record.Score;
    scoreTd.classList.add("toRight");
    tr.appendChild(scoreTd);
  }
} 

getRecords();