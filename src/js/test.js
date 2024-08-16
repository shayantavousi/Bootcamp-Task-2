const api = axios.create({
    baseURL: "http://localhost:3000"
})

const transactionTable = document.querySelector(".transaction__content")
const searchInput = document.querySelector(".search__input")
const chevrons = document.querySelectorAll(".fa-chevron-down")
const getBtn = document.querySelector(".getBtn")
const firstPage = document.querySelector(".app__preview")


searchInput.addEventListener("click", e => e.target.parentNode.classList.add("selected"))
searchInput.addEventListener("blur", e => e.target.parentNode.classList.remove("selected"))

getBtn.addEventListener("click", e => {
    firstPage.classList.add("hidden");
    setTimeout(() => {
        getData({})
    }, 500);
})



chevrons.forEach(chevron => {
    chevron.addEventListener("click", e => {
        // let criteria = ""
        e.target.classList.toggle("asc")
        if (e.target.classList.value.includes("asc")) {
            getData({ search: searchInput.value, sort: { orderBy: e.target.dataset.orderby, sortType: "asc" } })
        } else {
            getData({ search: searchInput.value, sort: { orderBy: e.target.dataset.orderby, sortType: "desc" } })
        }
    })
})

let searchString = "";
searchInput.addEventListener("input", input => {
    searchString = input.target.value.trim().toLowerCase()
    getData({ search: searchString })
})




function createUi(transactions) {
    let tableData = ``
    let index = 1



    transactions.forEach(item => {
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
        index <= transactions.length ? index++ : ""

    });

    transactionTable.innerHTML = tableData
}



async function getData({ search = "", sort = { orderBy: "", sortType: "" } }) {
    let result;

    try {
        const searchedData = await api.get(`/transactions?refId_like=${search}`);
        const sortedData = searchedData.data.sort((a, b) => {
            switch (sort.orderBy) {
                case "price": {
                    if (sort.sortType === "asc") {
                        return a.price > b.price ? 1 : -1
                    }
                    if (sort.sortType === "desc") {
                        return a.price > b.price ? -1 : 1
                    }
                    break;
                }

                case "date": {
                    if (sort.sortType === "asc") {
                        return a.date > b.date ? 1 : -1
                    }
                    if (sort.sortType === "desc") {
                        return a.date > b.date ? -1 : 1
                    }
                    break;
                }
                default: {
                    return a.date > b.date ? -1 : 1
                }

            }
        });

        result = sortedData;
        createUi(result)

    } catch (error) {
        alert("تراکنشی جهت نمایش وجود ندارد")
    }
}






