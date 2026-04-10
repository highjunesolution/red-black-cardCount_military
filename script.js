
const myModal = new bootstrap.Modal(document.getElementById("modal"));

const red = document.getElementById("red");
const black = document.getElementById("black");
const list = document.getElementById("list")
const listData = []

document.addEventListener("DOMContentLoaded", () => {
    myModal.show();
});


let redCount;
let blackCount;
const redBtn = document.getElementById("redBtn");
const blackBtn = document.getElementById("blackBtn");

document.getElementById("saveBtn").addEventListener("click", () => {
    redCount = parseInt(document.getElementById("redInput").value);
    blackCount = parseInt(document.getElementById("blackInput").value);
    document.getElementById("totalCount").innerText = ` ${Number(redCount + blackCount)} ใบ`
    if (!redCount || !blackCount || (redCount < 0 || blackCount < 0)) {
        return alert("โปรดระบุ จำนวนใบดำใบแดงให้ถูกต้องครบถ้วน")
    }

    document.getElementById("right").classList.remove("d-none")
    document.getElementById("left").classList.add("col-md-8", "col-xl-10")
    myModal.hide()
    red.innerText = redCount;
    black.innerText = blackCount;
    updatePercent()
});

redBtn.addEventListener("click", () => {
    redCount--;
    if (redCount === 0) {
        redBtn.disabled = true
    }
    red.innerText = redCount;
    listData.push({
        card: "🔴",
        time: new Date().toLocaleTimeString('th-TH', {
            hour: '2-digit',
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        })
    })
    showList()
    updatePercent()
});

blackBtn.addEventListener("click", () => {
    blackCount--;
    if (blackCount === 0) {
        blackBtn.disabled = true
    }
    black.innerText = blackCount;
    listData.push({
        card: "⚫",
        time: new Date().toLocaleTimeString('th-TH', {
            hour: '2-digit',
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        })
    })
    showList()
    updatePercent()
});

function updatePercent() {
    const total = redCount + blackCount;

    if (total === 0) return; // กันหาร 0

    const redPercent = ((redCount / total) * 100).toFixed(2);
    const blackPercent = ((blackCount / total) * 100).toFixed(2);

    document.getElementById("redPercent").innerText = redPercent + "%"
    document.getElementById("blackPercent").innerText = blackPercent + "%"

    console.log("Red:", redPercent + "%");
    console.log("Black:", blackPercent + "%");
}

function showList() {
    list.innerHTML = listData.map((item, index) =>
        ` <div 
            class="d-flex align-items-center bg-light shadow rounded p-2 mb-2 gap-2"
          >
            <p class="m-0 ">${index + 1}</p>
            <p class="m-0 me-auto">${item.card}</p>
            <p class="m-0 ">${item.time}</p>
            <button data-index="${index}" data-card="${item.card}" class="btn btn-danger btn-sm removeBtn">ลบ</button>
          </div>`
    ).join("")
}

list.addEventListener("click", (e) => {
    if (e.target.classList.contains("removeBtn")) {
        const index = e.target.dataset.index
        const card = e.target.dataset.card
        if (card === "🔴") {
            redCount++
            redBtn.disabled = false
            red.innerText = redCount;
            updatePercent()
        } else {
            blackCount++
            blackBtn.disabled = false
            black.innerText = blackCount
            updatePercent()
        }

        listData.splice(index, 1)
        showList()
    }
})

