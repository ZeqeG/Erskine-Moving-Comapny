var hoursEl = document.getElementById("workHour");
var truckEl = document.getElementById("truckFee");
var gasEl = document.getElementById("gasFee");
var totalEl = document.getElementById("total");

function buttonCalc() {
  hoursEl = document.getElementById("workHour");
  truckEl = document.getElementById("truckFee");
  gasEl = document.getElementById("gasFee");
  totalEl = document.getElementById("total");
  let hourlyCost = 90;
  let hoursCost = Number(hoursEl.value) * hourlyCost;
  let totalCost = hoursCost + Number(truckEl.value) + Number(gasEl.value);
  totalEl.innerText = totalCost;
  console.log('done')
}
