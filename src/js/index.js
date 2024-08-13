const api = axios.create({
  baseURL: "http://localhost:3000"
})

const transactionTable = document.querySelector(".transaction__content")
const searchInput = document.querySelector(".search__input")
const chevrons = document.querySelectorAll(".fa-chevron-down")
const getBtn = document.querySelector(".getBtn")
const firstPage = document.querySelector(".app__preview")

async function getTransactions(filter = "?_sort=date&_order=desc") {

  try {
    const { data } = await api.get(`/transactions${filter}`);
    // console.log(data);

    let tableData = ``
    let index = 1



    data.forEach(item => {
      tableData += `<div class="transaction-item" data-id=${item.id}>
               <div class="transaction-cell transaction__content-index">${index.toLocaleString("fa-IR", { useGrouping: false })}</div>
               <div
                 class="transaction-cell transaction__content-type"
                 data-type=${item.type === "افزایش اعتبار" ? "deposit" : "withdraw"}
               >
                 ${item.type}
               </div>
               <div class="transaction-cell transaction__content-price">
                 ${new Intl.NumberFormat('fa-IR').format(
        item.price)} ریال
               </div>
               <div
                 class="transaction-cell transaction__content-refID"
                 data-ref-id=${item.refId}
               >
                 ${item.refId.toLocaleString("fa-IR", { useGrouping: false })}
               </div>
               <div class="transaction-cell transaction__content-date">
                 ${new Date(item.date).toLocaleString("fa-IR", { dateStyle: "medium" })} ساعت ${new Date(item.date).toLocaleString("fa-IR", { timeStyle: "short" })}
               </div>
             </div>`
      index <= data.length ? index++ : ""

    });

    transactionTable.innerHTML = tableData

  } catch (error) {
    console.log(error);

  }
}

getBtn.addEventListener("click", e => {
  firstPage.classList.add("hidden");
  setTimeout(() => {
    getTransactions();
  }, 500);
})

let filterOptions = { price: false, date: false };


chevrons.forEach(chevron => {
  chevron.addEventListener("click", e => {
    let criteria = ""
    e.target.classList.toggle("asc")
    if (e.target.classList.value.includes("asc")) {
      criteria = `?_sort=${e.target.dataset.orderby}&_order=asc`;
    } else {
      criteria = `?_sort=${e.target.dataset.orderby}&_order=desc`;
    }
    getTransactions(criteria)
    filterOptions[chevron.dataset.orderby] = chevron.classList.contains("asc")
    // console.log(filterOptions);
  })
})

searchInput.addEventListener("input", input => {
  const searchString = input.target.value.trim().toLowerCase()
  const criteria = `?refId_like=${searchString}`
  getTransactions(criteria)
})






